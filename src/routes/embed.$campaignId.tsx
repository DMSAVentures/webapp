/**
 * Public Embed Form Route
 * Renders the form for embedding in external websites
 */

import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorState } from "@/components/error/error";
import {
	FormRenderer,
	type FormRendererConfig,
} from "@/features/form-builder/components/FormRenderer/component";
import { type ApiError, publicFetcher } from "@/hooks/fetcher";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import type { Campaign } from "@/types/campaign";
import type { FormDesign, FormField } from "@/types/common.types";
import styles from "./embed.module.scss";

export const Route = createFileRoute("/embed/$campaignId")({
	component: RouteComponent,
});

// Default design configuration
const DEFAULT_DESIGN: FormDesign = {
	layout: "single-column",
	colors: {
		primary: "#3b82f6",
		background: "#ffffff",
		text: "#1f2937",
		border: "#e5e7eb",
		error: "#ef4444",
		success: "#10b981",
	},
	typography: {
		fontFamily: "Inter, system-ui, sans-serif",
		fontSize: 16,
		fontWeight: 400,
	},
	spacing: {
		padding: 16,
		gap: 16,
	},
	borderRadius: 8,
	submitButtonText: "Submit",
	customCss: "",
};

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const [campaign, setCampaign] = useState<Campaign | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [refCode, setRefCode] = useState<string | null>(null);

	// Fetch campaign data using public API (no auth required)
	const fetchCampaign = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await publicFetcher<Campaign>(
				`${import.meta.env.VITE_API_URL}/api/v1/${campaignId}`,
				{ method: "GET" },
			);
			setCampaign(response);
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to load form";
			setError({ error: message });
		} finally {
			setLoading(false);
		}
	}, [campaignId]);

	// Extract ref code from URL parameters on mount
	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const ref = searchParams.get("ref");
		if (ref) {
			setRefCode(ref);
		}
	}, []);

	// Fetch campaign on mount
	useEffect(() => {
		fetchCampaign();
	}, [fetchCampaign]);

	// Parse design config from custom_css and build FormRendererConfig
	const formConfig = useMemo((): FormRendererConfig | null => {
		if (!campaign?.form_config?.fields) return null;

		let design: FormDesign = { ...DEFAULT_DESIGN };

		if (campaign.form_config.custom_css?.startsWith("__DESIGN__:")) {
			try {
				const designJson = campaign.form_config.custom_css.substring(
					"__DESIGN__:".length,
				);
				design = JSON.parse(designJson);
			} catch (e) {
				console.error("Failed to parse design config:", e);
			}
		}

		// Map campaign fields to FormField format (use name as id for API compatibility)
		const fields: FormField[] = campaign.form_config.fields.map(
			(field, idx) => ({
				id: field.name, // Use name as id so formData keys match API expectations
				type: field.type,
				name: field.name,
				label: field.label,
				placeholder: field.placeholder,
				required: field.required ?? false, // Ensure boolean
				options: field.options,
				order: idx,
			}),
		);

		return { fields, design };
	}, [campaign]);

	// Handle form submission with campaign-specific API logic
	const handleSubmit = useCallback(
		async (formData: Record<string, string>) => {
			if (!campaign?.form_config?.fields) return;

			// Build custom fields (exclude email - it's a required top-level field)
			const customFields: Record<string, string> = {};

			campaign.form_config.fields.forEach((field) => {
				const value = formData[field.name] || "";
				if (field.name !== "email") {
					customFields[field.name] = value;
				}
			});

			// Add ref code to custom fields if present
			if (refCode) {
				customFields.ref_code = refCode;
			}

			// Submit to API
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/users`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: formData.email || "",
						terms_accepted: true,
						custom_fields: customFields,
					}),
				},
			);

			if (!response.ok) {
				let errorMessage = "Failed to submit form";
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorMessage;
				} catch {
					errorMessage = `Failed to submit form (${response.status})`;
				}
				throw new Error(errorMessage);
			}
		},
		[campaign, campaignId, refCode],
	);

	if (loading) {
		return (
			<LoadingSpinner size="large" mode="centered" message="Loading form..." />
		);
	}

	if (error) {
		return <ErrorState message={`Error: ${error.error}`} />;
	}

	if (!campaign) {
		return <ErrorState message="Form not found" />;
	}

	if (!formConfig) {
		return <ErrorState message="This form is not yet configured" />;
	}

	return (
		<div className={styles.root}>
			<FormRenderer
				config={formConfig}
				mode="interactive"
				onSubmit={handleSubmit}
				submitText={formConfig.design.submitButtonText}
				className={styles.form}
			/>
		</div>
	);
}
