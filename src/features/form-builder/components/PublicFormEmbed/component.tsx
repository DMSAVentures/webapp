/**
 * PublicFormEmbed Component
 * Container component for public form embedding
 */

import { memo, useCallback, useMemo } from "react";
import { ErrorState } from "@/components/error/error";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { usePublicCampaign } from "@/hooks/usePublicCampaign";
import { useTrackingData } from "@/hooks/useTrackingData";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import type { Campaign, CampaignStatus } from "@/types/campaign";
import type { FormDesign, FormField } from "@/types/common.types";
import {
	type CaptchaConfig,
	FormRenderer,
	type FormRendererConfig,
	type StatusMessage,
} from "../FormRenderer/component";
import styles from "./component.module.scss";

export interface PublicFormEmbedProps {
	/** Campaign ID */
	campaignId: string;
}

// ============================================================================
// Constants
// ============================================================================

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

// ============================================================================
// Pure Functions
// ============================================================================

/** Get status message for non-active campaigns */
function getStatusMessage(status: CampaignStatus): StatusMessage | null {
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
}

/** Build form fields from campaign form fields */
function buildFormFields(formFields: Campaign["formFields"]): FormField[] {
	if (!formFields?.length) return [];

	return formFields.map((field, idx) => ({
		id: field.name, // Use name as id so formData keys match API expectations
		type: field.fieldType,
		name: field.name,
		label: field.label,
		placeholder: field.placeholder,
		required: field.required ?? false,
		options: field.options,
		order: field.displayOrder ?? idx,
	}));
}

/** Build captcha config from form settings */
function buildCaptchaConfig(
	formSettings: Campaign["formSettings"],
): CaptchaConfig | undefined {
	const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

	if (
		formSettings?.captchaEnabled &&
		formSettings?.captchaProvider === "turnstile" &&
		turnstileSiteKey
	) {
		return {
			enabled: true,
			provider: "turnstile",
			siteKey: formSettings.captchaSiteKey || turnstileSiteKey,
		};
	}

	return undefined;
}

/** Build form design from campaign settings */
function buildFormDesign(formSettings: Campaign["formSettings"]): FormDesign {
	if (!formSettings?.design) {
		return { ...DEFAULT_DESIGN };
	}
	return { ...DEFAULT_DESIGN, ...formSettings.design } as FormDesign;
}

/** Get current embed URL for referral links */
function getEmbedUrl(): string {
	if (typeof window === "undefined") return "";
	return window.location.href.split("?")[0];
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for building form configuration */
function useFormConfig(campaign: Campaign | null): FormRendererConfig | null {
	return useMemo(() => {
		if (!campaign?.formFields?.length) return null;

		const fields = buildFormFields(campaign.formFields);
		const design = buildFormDesign(campaign.formSettings);
		const captcha = buildCaptchaConfig(campaign.formSettings);

		return { fields, design, captcha };
	}, [campaign]);
}

/** Hook for form submission with captcha support */
function useEmbedFormSubmission(campaignId: string, campaign: Campaign | null) {
	const tracking = useTrackingData();
	const { submit: submitForm, signupData } = useFormSubmission({
		campaignId,
		fields: campaign?.formFields || [],
		tracking,
	});

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

	return { handleSubmit, signupData };
}

// ============================================================================
// Component
// ============================================================================

/**
 * PublicFormEmbed renders the form for embedding in external websites
 */
export const PublicFormEmbed = memo(function PublicFormEmbed({
	campaignId,
}: PublicFormEmbedProps) {
	// Data fetching
	const { campaign, loading, error } = usePublicCampaign(campaignId);

	// Form configuration
	const formConfig = useFormConfig(campaign);

	// Form submission
	const { handleSubmit, signupData } = useEmbedFormSubmission(
		campaignId,
		campaign,
	);

	// Derived state
	const embedUrl = useMemo(() => getEmbedUrl(), []);

	// Loading state
	if (loading) {
		return <Spinner size="lg" label="Loading form..." />;
	}

	// Error states
	if (error) {
		return <ErrorState message={`Error: ${error.error}`} />;
	}

	if (!campaign) {
		return <ErrorState message="Form not found" />;
	}

	if (!formConfig) {
		return <ErrorState message="This form is not yet configured" />;
	}

	// Campaign status
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
});

PublicFormEmbed.displayName = "PublicFormEmbed";
