import { useMemo } from "react";
import type { Campaign } from "@/types/campaign";
import type { FormConfig } from "@/types/common.types";

/**
 * Transform campaign form_config to FormConfig for preview/editing
 */
export const useFormConfigFromCampaign = (
	campaign: Campaign | null,
): FormConfig | null => {
	return useMemo(() => {
		if (
			!campaign?.form_config ||
			!campaign.form_config.fields ||
			campaign.form_config.fields.length === 0
		) {
			return null;
		}

		// Map API fields to UI fields
		const uiFields = campaign.form_config.fields.map((apiField, index) => ({
			id: apiField.name || `field-${index}`,
			type: apiField.type,
			label: apiField.label,
			placeholder: apiField.placeholder || "",
			helpText: "",
			required: apiField.required || false,
			order: index,
			options: apiField.options,
			validation: apiField.validation
				? JSON.parse(apiField.validation)
				: undefined,
		}));

		// Default design config
		const defaultDesign = {
			layout: "single-column" as const,
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
		};

		// Try to parse design from custom_css
		let design = defaultDesign;
		if (campaign.form_config.custom_css) {
			try {
				if (campaign.form_config.custom_css.startsWith("__DESIGN__:")) {
					const designJson = campaign.form_config.custom_css.substring(
						"__DESIGN__:".length,
					);
					design = JSON.parse(designJson);
				} else {
					// Legacy: just custom CSS without design config
					design = {
						...defaultDesign,
						customCss: campaign.form_config.custom_css,
					};
				}
			} catch (_e) {
				// If parsing fails, use default with the CSS as-is
				design = {
					...defaultDesign,
					customCss: campaign.form_config.custom_css,
				};
			}
		}

		return {
			id: `form-${campaign.id}`,
			campaignId: campaign.id,
			fields: uiFields,
			design,
			behavior: {
				submitAction: "inline-message",
				successMessage: "Thank you for signing up!",
				duplicateHandling: "block",
			},
		};
	}, [campaign]);
};
