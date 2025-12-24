/**
 * Public Embed Form Route
 * Renders the form for embedding in external websites
 */

import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { ErrorState } from "@/components/error/error";
import {
	FormRenderer,
	type FormRendererConfig,
} from "@/features/form-builder/components/FormRenderer/component";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { usePublicCampaign } from "@/hooks/usePublicCampaign";
import { useTrackingData } from "@/hooks/useTrackingData";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
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

	// Fetch campaign and tracking data
	const { campaign, loading, error } = usePublicCampaign(campaignId);
	const tracking = useTrackingData();

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

	// Form submission handler
	const { submit, signupData } = useFormSubmission({
		campaignId,
		fields: campaign?.form_config?.fields || [],
		tracking,
	});

	// Get the current embed URL for referral links
	const embedUrl = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";

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
				onSubmit={submit}
				submitText={formConfig.design.submitButtonText}
				signupData={signupData}
				enabledChannels={campaign.referral_config?.sharing_channels}
				embedUrl={embedUrl}
				className={styles.form}
			/>
		</div>
	);
}
