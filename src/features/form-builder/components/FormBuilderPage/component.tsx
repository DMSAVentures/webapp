/**
 * FormBuilderPage Component
 * Container component for the form builder page
 */

import { memo, useCallback, useEffect, useState } from "react";
import { useFormConfigFromCampaign } from "@/hooks/useFormConfigFromCampaign";
import { useBannerCenter } from "@/proto-design-system/components/feedback/BannerCenter";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { Campaign } from "@/types/campaign";
import type { FormConfig } from "@/types/common.types";
import { FormBuilder } from "../FormBuilder/component";
import styles from "./component.module.scss";

export interface FormBuilderPageProps {
	/** Campaign ID */
	campaignId: string;
	/** Campaign data */
	campaign: Campaign;
}

// ============================================================================
// Types
// ============================================================================

interface FormFieldPayload {
	name: string;
	field_type: string;
	label: string;
	placeholder?: string;
	required: boolean;
	options?: string[];
	validation_pattern?: string;
	display_order: number;
}

interface FormSettingsPayload {
	captcha_enabled: boolean;
	design: FormConfig["design"];
	success_title?: string;
	success_message?: string;
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Convert label to valid field name */
function labelToFieldName(label: string, type: string): string {
	// Email fields must always be named "email"
	if (type === "email") {
		return "email";
	}

	return label
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "_") // Replace spaces with underscores
		.replace(/[^a-z0-9_]/g, ""); // Remove special characters
}

/** Transform UI FormConfig to API payload */
function transformConfigToPayload(config: FormConfig): {
	formFields: FormFieldPayload[];
	formSettings: FormSettingsPayload;
} {
	const formFields = config.fields.map((field, index) => ({
		name: labelToFieldName(field.label, field.type),
		field_type: field.type,
		label: field.label,
		placeholder: field.placeholder || undefined,
		required: field.required,
		options: field.options,
		validation_pattern: field.validation?.pattern || undefined,
		display_order: index,
	}));

	const formSettings = {
		captcha_enabled: false,
		design: config.design,
		success_title: config.behavior.successTitle,
		success_message: config.behavior.successMessage,
	};

	return { formFields, formSettings };
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for saving form configuration */
function useSaveFormConfig(campaignId: string) {
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saveSuccess, setSaveSuccess] = useState(false);
	const { addBanner } = useBannerCenter();

	useEffect(() => {
		if (saveSuccess) {
			addBanner({
				type: "success",
				title: "Form saved successfully!",
				description: "Your waitlist form has been updated.",
				dismissible: true,
			});
		}
	}, [saveSuccess, addBanner]);

	useEffect(() => {
		if (saveError) {
			addBanner({
				type: "error",
				title: "Failed to save form",
				description: saveError,
				dismissible: true,
			});
		}
	}, [saveError, addBanner]);

	const handleSave = useCallback(
		async (config: FormConfig) => {
			setSaveError(null);
			setSaveSuccess(false);

			try {
				const { formFields, formSettings } = transformConfigToPayload(config);

				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify({
							form_fields: formFields,
							form_settings: formSettings,
						}),
					},
				);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.error || "Failed to save form configuration",
					);
				}

				setSaveSuccess(true);
				setTimeout(() => setSaveSuccess(false), 3000);
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Failed to save form configuration";
				setSaveError(errorMessage);
			}
		},
		[campaignId],
	);

	return { handleSave };
}

// ============================================================================
// Component
// ============================================================================

/**
 * FormBuilderPage displays the form builder for a campaign
 */
export const FormBuilderPage = memo(function FormBuilderPage({
	campaignId,
	campaign,
}: FormBuilderPageProps) {
	// Hooks
	const formConfig = useFormConfigFromCampaign(campaign);
	const { handleSave } = useSaveFormConfig(campaignId);

	return (
		<Stack gap="lg" className={styles.formBuilderTab} animate>
			<Stack gap="xs">
				<Text as="h2" size="xl" weight="semibold">
					Form Builder
				</Text>
				<Text color="secondary">
					Design your signup form and customize the success screen
				</Text>
			</Stack>

			<FormBuilder
				campaignId={campaignId}
				initialConfig={formConfig || undefined}
				onSave={handleSave}
				enabledReferralChannels={campaign.referralSettings?.sharingChannels}
			/>
		</Stack>
	);
});

FormBuilderPage.displayName = "FormBuilderPage";
