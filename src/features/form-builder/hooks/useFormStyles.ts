/**
 * useFormStyles Hook
 * Converts FormDesign configuration to CSS custom properties
 * for dynamic form styling
 */

import { useMemo } from "react";
import type { FormDesign } from "@/types/common.types";

/**
 * CSS custom properties for form styling
 */
export interface FormStyleProperties {
	"--form-font-family": string;
	"--form-font-size": string;
	"--form-font-weight": number;
	"--form-text-color": string;
	"--form-bg-color": string;
	"--form-border-color": string;
	"--form-primary-color": string;
	"--form-error-color": string;
	"--form-success-color": string;
	"--form-padding": string;
	"--form-gap": string;
	"--form-border-radius": string;
}

/**
 * Converts FormDesign to CSS custom properties object
 * Use this to set inline style on form container
 */
export const useFormStyles = (
	design: FormDesign,
): React.CSSProperties & FormStyleProperties => {
	return useMemo(
		() =>
			({
				"--form-font-family": design.typography.fontFamily,
				"--form-font-size": `${design.typography.fontSize}px`,
				"--form-font-weight": design.typography.fontWeight,
				"--form-text-color": design.colors.text,
				"--form-bg-color": design.colors.background,
				"--form-border-color": design.colors.border,
				"--form-primary-color": design.colors.primary,
				"--form-error-color": design.colors.error,
				"--form-success-color": design.colors.success,
				"--form-padding": `${design.spacing.padding}px`,
				"--form-gap": `${design.spacing.gap}px`,
				"--form-border-radius": `${design.borderRadius}px`,
			}) as React.CSSProperties & FormStyleProperties,
		[design],
	);
};
