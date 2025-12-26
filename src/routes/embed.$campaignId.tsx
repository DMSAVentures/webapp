/**
 * Public Embed Form Route
 * Renders the form for embedding in external websites
 */

import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { ErrorState } from "@/components/error/error";
import {
	type CaptchaConfig,
	FormRenderer,
	type FormRendererConfig,
	type StatusMessage,
} from "@/features/form-builder/components/FormRenderer/component";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { usePublicCampaign } from "@/hooks/usePublicCampaign";
import { useTrackingData } from "@/hooks/useTrackingData";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import type { CampaignStatus } from "@/types/campaign";
import type { FormDesign, FormField } from "@/types/common.types";
import styles from "./embed.module.scss";

/**
 * Get status message for non-active campaigns
 */
const getStatusMessage = (status: CampaignStatus): StatusMessage | null => {
	switch (status) {
		case "draft":
			return {
				title: "Coming Soon",
				message: "This campaign is not yet live.",
			};
		case "paused":
			return {
				title: "Temporarily Paused",
				message: "This campaign is currently paused. Please check back later.",
			};
		case "completed":
			return {
				title: "Campaign Ended",
				message: "This campaign has ended and is no longer accepting sign-ups.",
			};
		default:
			return null;
	}
};

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

	// Parse design config and build FormRendererConfig
	const formConfig = useMemo((): FormRendererConfig | null => {
		if (!campaign?.formFields?.length) return null;

		// Get design from form_settings or use defaults
		let design: FormDesign = { ...DEFAULT_DESIGN };
		const formSettings = campaign.formSettings;

		if (formSettings?.design) {
			design = { ...DEFAULT_DESIGN, ...formSettings.design } as FormDesign;
		}

		// Map campaign form_fields to FormField format (use name as id for API compatibility)
		const fields: FormField[] = campaign.formFields.map((field, idx) => ({
			id: field.name, // Use name as id so formData keys match API expectations
			type: field.fieldType,
			name: field.name,
			label: field.label,
			placeholder: field.placeholder,
			required: field.required ?? false, // Ensure boolean
			options: field.options,
			order: field.displayOrder ?? idx,
		}));

		// Parse captcha config from form_settings
		// Site key comes from VITE_TURNSTILE_SITE_KEY env variable
		let captcha: CaptchaConfig | undefined;
		const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

		if (
			formSettings?.captchaEnabled &&
			formSettings?.captchaProvider === "turnstile" &&
			turnstileSiteKey
		) {
			captcha = {
				enabled: true,
				provider: "turnstile",
				siteKey: formSettings.captchaSiteKey || turnstileSiteKey,
			};
		}

		return { fields, design, captcha };
	}, [campaign]);

	// Form submission handler
	const { submit: submitForm, signupData } = useFormSubmission({
		campaignId,
		fields: campaign?.formFields || [],
		tracking,
	});

	// Wrap submit to pass captcha token from FormRenderer options
	const handleSubmit = useCallback(
		async (
			formData: Record<string, string>,
			options?: { captchaToken?: string },
		) => {
			return submitForm(formData, {
				captchaToken: options?.captchaToken,
			});
		},
		[submitForm],
	);

	// Get the current embed URL for referral links
	const embedUrl =
		typeof window !== "undefined" ? window.location.href.split("?")[0] : "";

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

	// Determine if campaign is accepting signups and get status message
	const isAcceptingSignups = campaign.status === "active";
	const statusMessage = getStatusMessage(campaign.status);

	return (
		<div className={styles.root}>
			<FormRenderer
				config={formConfig}
				mode={isAcceptingSignups ? "interactive" : "preview"}
				onSubmit={isAcceptingSignups ? handleSubmit : undefined}
				submitText={formConfig.design.submitButtonText}
				successTitle={campaign.formSettings?.successTitle}
				successMessage={campaign.formSettings?.successMessage}
				signupData={signupData}
				enabledChannels={campaign.referralSettings?.sharingChannels}
				embedUrl={embedUrl}
				trackingIntegrations={campaign.trackingIntegrations}
				statusMessage={statusMessage}
				className={styles.form}
			/>
		</div>
	);
}
