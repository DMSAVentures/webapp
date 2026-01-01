/**
 * Campaign Email Template Hooks
 *
 * Hooks for managing campaign email templates (verification, welcome, etc.)
 */

import { useCallback, useEffect, useState } from "react";
import { type ApiError, fetcher } from "@/api";
import {
	toUiCampaignEmailTemplate,
	toUiCampaignEmailTemplates,
} from "@/api/transforms/campaignEmailTemplate";
import type { ApiCampaignEmailTemplate } from "@/api/types/campaignEmailTemplate";
import type {
	CampaignEmailTemplate,
	CampaignEmailTemplateType,
	CreateCampaignEmailTemplateInput,
	UpdateCampaignEmailTemplateInput,
} from "@/types/campaignEmailTemplate";
import { isAbortError, toApiError } from "@/utils";

// ============================================================================
// useGetCampaignEmailTemplates - Fetch all templates for a campaign
// ============================================================================

export const useGetCampaignEmailTemplates = (
	campaignId: string,
	type?: CampaignEmailTemplateType,
) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [templates, setTemplates] = useState<CampaignEmailTemplate[]>([]);

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

				const response = await fetcher<ApiCampaignEmailTemplate[]>(url, {
					method: "GET",
					signal,
				});
				setTemplates(toUiCampaignEmailTemplates(response || []));
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
// useGetAllCampaignEmailTemplates - Fetch all templates across all campaigns
// ============================================================================

export const useGetAllCampaignEmailTemplates = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [templates, setTemplates] = useState<CampaignEmailTemplate[]>([]);

	const fetchTemplates = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiCampaignEmailTemplate[]>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaign-email-templates`,
					{
						method: "GET",
						signal,
					},
				);
				setTemplates(toUiCampaignEmailTemplates(response || []));
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
		[],
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
// useGetCampaignEmailTemplateById - Fetch a single template by ID
// Fetches all templates and finds the matching one
// ============================================================================

export const useGetCampaignEmailTemplateById = (templateId: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [template, setTemplate] = useState<CampaignEmailTemplate | null>(null);

	const fetchTemplate = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			if (!templateId) {
				setTemplate(null);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				// Fetch all templates and find the one we need
				const response = await fetcher<ApiCampaignEmailTemplate[]>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaign-email-templates`,
					{ method: "GET", signal },
				);
				const found = response?.find((t) => t.id === templateId);
				if (!found) {
					setError({ error: "Template not found" });
					setTemplate(null);
				} else {
					setTemplate(toUiCampaignEmailTemplate(found));
				}
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return;
				}
				setError(toApiError(error));
			} finally {
				setLoading(false);
			}
		},
		[templateId],
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
// useGetCampaignEmailTemplate - Fetch a single template
// ============================================================================

export const useGetCampaignEmailTemplate = (
	campaignId: string,
	templateId: string,
) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [template, setTemplate] = useState<CampaignEmailTemplate | null>(null);

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
				const response = await fetcher<ApiCampaignEmailTemplate>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/email-templates/${templateId}`,
					{ method: "GET", signal },
				);
				setTemplate(toUiCampaignEmailTemplate(response));
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
// useCreateCampaignEmailTemplate - Create a new template
// ============================================================================

export const useCreateCampaignEmailTemplate = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<CampaignEmailTemplate | null>(null);

	const createTemplate = useCallback(
		async (
			campaignId: string,
			input: CreateCampaignEmailTemplateInput,
		): Promise<CampaignEmailTemplate | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiCampaignEmailTemplate>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/email-templates`,
					{
						method: "POST",
						body: JSON.stringify({
							name: input.name,
							type: input.type,
							subject: input.subject,
							html_body: input.htmlBody,
							blocks_json: input.blocksJson,
							enabled: input.enabled,
							send_automatically: input.sendAutomatically,
						}),
					},
				);
				const template = toUiCampaignEmailTemplate(response);
				setData(template);
				return template;
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
// useUpdateCampaignEmailTemplate - Update an existing template
// ============================================================================

export const useUpdateCampaignEmailTemplate = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<CampaignEmailTemplate | null>(null);

	const updateTemplate = useCallback(
		async (
			campaignId: string,
			templateId: string,
			input: UpdateCampaignEmailTemplateInput,
		): Promise<CampaignEmailTemplate | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiCampaignEmailTemplate>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/email-templates/${templateId}`,
					{
						method: "PUT",
						body: JSON.stringify({
							name: input.name,
							subject: input.subject,
							html_body: input.htmlBody,
							blocks_json: input.blocksJson,
							enabled: input.enabled,
							send_automatically: input.sendAutomatically,
						}),
					},
				);
				const template = toUiCampaignEmailTemplate(response);
				setData(template);
				return template;
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
// useDeleteCampaignEmailTemplate - Delete a template
// ============================================================================

export const useDeleteCampaignEmailTemplate = () => {
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
// useSendCampaignTestEmail - Send a test email
// ============================================================================

export const useSendCampaignTestEmail = () => {
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
						}),
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

// ============================================================================
// Re-export types for convenience
// ============================================================================

export type {
	CampaignEmailTemplate,
	CampaignEmailTemplateType,
	CreateCampaignEmailTemplateInput,
	EmailBlocksJson,
	UpdateCampaignEmailTemplateInput,
} from "@/types/campaignEmailTemplate";
