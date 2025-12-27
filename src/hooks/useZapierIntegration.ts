import { useCallback, useEffect, useState } from "react";
import { fetcher } from "@/api/client";

export interface ZapierStatus {
	connected: boolean;
	active_subscriptions: number;
}

export interface ZapierSubscription {
	id: string;
	event_type: string;
	campaign_id?: string;
	status: string;
	trigger_count: number;
	last_triggered_at?: string;
	created_at: string;
}

export interface ApiError {
	error: string;
}

/**
 * Hook for getting Zapier connection status
 */
export const useZapierStatus = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<ZapierStatus | null>(null);

	const fetchStatus = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetcher<ZapierStatus>(
				`${import.meta.env.VITE_API_URL}/api/protected/integrations/zapier/status`,
			);
			setData(response);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to fetch Zapier status";
			setError({ error: errorMessage });
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchStatus();
	}, [fetchStatus]);

	return { data, loading, error, refetch: fetchStatus };
};

/**
 * Hook for getting Zapier subscriptions
 */
export const useZapierSubscriptions = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<ZapierSubscription[]>([]);

	const fetchSubscriptions = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetcher<ZapierSubscription[]>(
				`${import.meta.env.VITE_API_URL}/api/protected/integrations/zapier/subscriptions`,
			);
			setData(response);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to fetch Zapier subscriptions";
			setError({ error: errorMessage });
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchSubscriptions();
	}, [fetchSubscriptions]);

	return { data, loading, error, refetch: fetchSubscriptions };
};

/**
 * Hook for disconnecting Zapier
 */
export const useZapierDisconnect = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ApiError | null>(null);

	const disconnect = useCallback(async (): Promise<boolean> => {
		setLoading(true);
		setError(null);
		try {
			await fetcher(
				`${import.meta.env.VITE_API_URL}/api/protected/integrations/zapier/disconnect`,
				{ method: "POST" },
			);
			return true;
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to disconnect Zapier";
			setError({ error: errorMessage });
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	return { disconnect, loading, error };
};
