/**
 * Email Template Hooks
 *
 * Hooks for managing email templates for campaigns
 */

import { useCallback, useEffect, useState } from "react";
import { type ApiError, fetcher } from "@/api";
import { isAbortError, toApiError } from "@/utils";

// ============================================================================
// Types
// ============================================================================

export interface EmailTemplate {
	id: string;
	campaign_id: string;
	name: string;
	type:
		| "verification"
		| "welcome"
		| "position_update"
		| "reward_earned"
		| "milestone"
		| "custom";
	subject: string;
	html_body: string;
	text_body?: string;
	enabled: boolean;
	send_automatically: boolean;
	variant_name?: string;
	variant_weight?: number;
	created_at: string;
	updated_at: string;
}

export interface CreateEmailTemplateRequest {
	name: string;
	type: EmailTemplate["type"];
	subject: string;
	html_body: string;
	text_body?: string;
	enabled?: boolean;
	send_automatically?: boolean;
}

export interface UpdateEmailTemplateRequest {
	name?: string;
	subject?: string;
	html_body?: string;
	text_body?: string;
	enabled?: boolean;
	send_automatically?: boolean;
}

export interface SendTestEmailRequest {
	recipient_email: string;
	test_data?: Record<string, string | number>;
}

// ============================================================================
// useGetEmailTemplates - Fetch all templates for a campaign
// ============================================================================

export const useGetEmailTemplates = (
	campaignId: string,
	type?: EmailTemplate["type"],
) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [templates, setTemplates] = useState<EmailTemplate[]>([]);

	const fetchTemplates = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			if (!campaignId) {
				setTemplates([]);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const url = type
					? `${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/email-templates?type=${type}`
					: `${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/email-templates`;

				const response = await fetcher<EmailTemplate[]>(url, {
					method: "GET",
					signal,
				});
				setTemplates(response || []);
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return;
				}
				setError(toApiError(error));
				setTemplates([]);
			} finally {
				setLoading(false);
			}
		},
		[campaignId, type],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchTemplates(controller.signal);
		return () => controller.abort();
	}, [fetchTemplates]);

	return {
		templates,
		loading,
		error,
		refetch: fetchTemplates,
	};
};

// ============================================================================
// useGetEmailTemplate - Fetch a single template
// ============================================================================

export const useGetEmailTemplate = (campaignId: string, templateId: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [template, setTemplate] = useState<EmailTemplate | null>(null);

	const fetchTemplate = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			if (!campaignId || !templateId) {
				setTemplate(null);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<EmailTemplate>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/email-templates/${templateId}`,
					{ method: "GET", signal },
				);
				setTemplate(response);
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return;
				}
				setError(toApiError(error));
			} finally {
				setLoading(false);
			}
		},
		[campaignId, templateId],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchTemplate(controller.signal);
		return () => controller.abort();
	}, [fetchTemplate]);

	return {
		template,
		loading,
		error,
		refetch: fetchTemplate,
	};
};

// ============================================================================
// useCreateEmailTemplate - Create a new template
// ============================================================================

export const useCreateEmailTemplate = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<EmailTemplate | null>(null);

	const createTemplate = useCallback(
		async (
			campaignId: string,
			request: CreateEmailTemplateRequest,
		): Promise<EmailTemplate | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<EmailTemplate>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/email-templates`,
					{
						method: "POST",
						body: JSON.stringify(request),
					},
				);
				setData(response);
				return response;
			} catch (error: unknown) {
				setError(toApiError(error));
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		createTemplate,
		loading,
		error,
		data,
	};
};

// ============================================================================
// useUpdateEmailTemplate - Update an existing template
// ============================================================================

export const useUpdateEmailTemplate = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<EmailTemplate | null>(null);

	const updateTemplate = useCallback(
		async (
			campaignId: string,
			templateId: string,
			request: UpdateEmailTemplateRequest,
		): Promise<EmailTemplate | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<EmailTemplate>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/email-templates/${templateId}`,
					{
						method: "PUT",
						body: JSON.stringify(request),
					},
				);
				setData(response);
				return response;
			} catch (error: unknown) {
				setError(toApiError(error));
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		updateTemplate,
		loading,
		error,
		data,
	};
};

// ============================================================================
// useDeleteEmailTemplate - Delete a template
// ============================================================================

export const useDeleteEmailTemplate = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);

	const deleteTemplate = useCallback(
		async (campaignId: string, templateId: string): Promise<boolean> => {
			setLoading(true);
			setError(null);
			try {
				await fetcher<void>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/email-templates/${templateId}`,
					{ method: "DELETE" },
				);
				return true;
			} catch (error: unknown) {
				setError(toApiError(error));
				return false;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		deleteTemplate,
		loading,
		error,
	};
};

// ============================================================================
// useSendTestEmail - Send a test email
// ============================================================================

export const useSendTestEmail = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const sendTestEmail = useCallback(
		async (
			campaignId: string,
			templateId: string,
			recipientEmail: string,
			testData?: Record<string, string | number>,
		): Promise<boolean> => {
			setLoading(true);
			setError(null);
			setSuccess(false);
			try {
				await fetcher<void>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/email-templates/${templateId}/send-test`,
					{
						method: "POST",
						body: JSON.stringify({
							recipient_email: recipientEmail,
							test_data: testData,
						} satisfies SendTestEmailRequest),
					},
				);
				setSuccess(true);
				return true;
			} catch (error: unknown) {
				setError(toApiError(error));
				return false;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	const reset = useCallback(() => {
		setSuccess(false);
		setError(null);
	}, []);

	return {
		sendTestEmail,
		loading,
		error,
		success,
		reset,
	};
};
