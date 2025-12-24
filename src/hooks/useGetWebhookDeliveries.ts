import { useCallback, useEffect, useState } from "react";
import { ApiError, fetcher } from "@/hooks/fetcher";
import type { ListWebhookDeliveriesResponse } from "@/types/webhook";
import { toApiError } from "@/utils";

interface UseGetWebhookDeliveriesParams {
	page?: number;
	limit?: number;
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

	const response = await fetcher<ListWebhookDeliveriesResponse>(url, {
		method: "GET",
	});

	return response;
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
