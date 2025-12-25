import { useMemo } from "react";
import type { Campaign } from "@/types/campaign";
import type {
	FormBehavior,
	FormConfig,
	FormDesign,
} from "@/types/common.types";

/** Default design configuration with type safety */
const DEFAULT_DESIGN = {
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
	customCss: "",
} as const satisfies FormDesign;

/** Default behavior configuration */
const DEFAULT_BEHAVIOR = {
	submitAction: "inline-message",
	successTitle: "Thank you for signing up!",
	successMessage: "We'll be in touch soon.",
	duplicateHandling: "block",
} as const satisfies FormBehavior;

/**
 * Transform campaign formSettings and formFields to FormConfig for preview/editing
 */
export const useFormConfigFromCampaign = (
	campaign: Campaign | null,
): FormConfig | null => {
	return useMemo(() => {
		if (!campaign?.formFields || campaign.formFields.length === 0) {
			return null;
		}

		// Map API fields to UI fields
		const uiFields = campaign.formFields.map((apiField, index) => ({
			id: apiField.name || `field-${index}`,
			type: apiField.fieldType,
			label: apiField.label,
			placeholder: apiField.placeholder || "",
			helpText: "",
			required: apiField.required || false,
			order: apiField.displayOrder ?? index,
			options: apiField.options,
			validation: apiField.validationPattern
				? { pattern: apiField.validationPattern }
				: undefined,
		}));

		// Default design config
		const defaultDesign: FormDesign = { ...DEFAULT_DESIGN };

		// Try to get design from formSettings
		let design = defaultDesign;
		const formSettings = campaign.formSettings;
		if (formSettings?.design) {
			// Design is now stored as a JSONB object
			// Spread defaults first, then override with API values
			design = {
				...defaultDesign,
				...formSettings.design,
			} as FormDesign;
		}

		// Build behavior config with custom success messages if available
		const behavior: FormBehavior = {
			...DEFAULT_BEHAVIOR,
			...(formSettings?.successTitle && {
				successTitle: formSettings.successTitle,
			}),
			...(formSettings?.successMessage && {
				successMessage: formSettings.successMessage,
			}),
		};

		return {
			id: `form-${campaign.id}`,
			campaignId: campaign.id,
			fields: uiFields,
			design,
			behavior,
		};
	}, [campaign]);
};
