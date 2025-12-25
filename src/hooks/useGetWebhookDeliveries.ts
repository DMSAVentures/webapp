import { useCallback, useEffect, useState } from "react";
import {
	type ApiError,
	type ApiListWebhookDeliveriesResponse,
	fetcher,
	toUiWebhookDelivery,
} from "@/api";
import type { WebhookDelivery } from "@/types/webhook";
import { toApiError } from "@/utils";

interface UseGetWebhookDeliveriesParams {
	page?: number;
	limit?: number;
}

interface ListWebhookDeliveriesResponse {
	deliveries: WebhookDelivery[];
	total: number;
	pagination: {
		page: number;
		limit: number;
		offset: number;
	};
}

async function getWebhookDeliveries(
	webhookId: string,
	params?: UseGetWebhookDeliveriesParams,
): Promise<ListWebhookDeliveriesResponse> {
	const searchParams = new URLSearchParams();
	if (params?.page) searchParams.append("page", params.page.toString());
	if (params?.limit) searchParams.append("limit", params.limit.toString());

	const queryString = searchParams.toString();
	const url = `${import.meta.env.VITE_API_URL}/api/protected/webhooks/${webhookId}/deliveries${queryString ? `?${queryString}` : ""}`;

	const response = await fetcher<ApiListWebhookDeliveriesResponse>(url, {
		method: "GET",
	});

	return {
		deliveries: response.deliveries.map(toUiWebhookDelivery),
		total: response.total,
		pagination: response.pagination,
	};
}

export const useGetWebhookDeliveries = (
	webhookId: string,
	params?: UseGetWebhookDeliveriesParams,
) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<ListWebhookDeliveriesResponse | null>(null);

	// Extract primitive values to avoid object reference issues
	const page = params?.page;
	const limit = params?.limit;

	const fetchDeliveries = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			const response = await getWebhookDeliveries(webhookId, { page, limit });
			setData(response);
		} catch (error: unknown) {
			setError(toApiError(error));
		} finally {
			setLoading(false);
		}
	}, [webhookId, page, limit]);

	useEffect(() => {
		if (webhookId) {
			fetchDeliveries();
		}
	}, [fetchDeliveries, webhookId]);

	return {
		data,
		loading,
		error,
		refetch: fetchDeliveries,
	};
};
