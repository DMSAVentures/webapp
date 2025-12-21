/**
 * FormRenderer Component
 * Renders a complete form with fields, layout, and submit functionality
 */

import { memo, useCallback, useState } from "react";
import type {
	FormDesign,
	FormField as FormFieldType,
} from "@/types/common.types";
import { FormField } from "../FormField/component";
import { useFormState } from "../../hooks/useFormState";
import { useFormStyles } from "../../hooks/useFormStyles";
import styles from "./component.module.scss";

/** Minimal config interface - only requires what FormRenderer actually uses */
export interface FormRendererConfig {
	fields: FormFieldType[];
	design: FormDesign;
}

export interface FormRendererProps {
	/** Form configuration (only fields and design are required) */
	config: FormRendererConfig;
	/** Render mode: preview (disabled) or interactive (functional) */
	mode: "preview" | "interactive";
	/** Submit handler for interactive mode */
	onSubmit?: (data: Record<string, string>) => Promise<void>;
	/** Submit button text */
	submitText?: string;
	/** Success message after submission */
	successMessage?: string;
	/** Success title after submission */
	successTitle?: string;
	/** Additional CSS class name */
	className?: string;
}

/**
 * FormRenderer displays a complete form with dynamic styling
 */
export const FormRenderer = memo<FormRendererProps>(function FormRenderer({
	config,
	mode,
	onSubmit,
	submitText = "Submit",
	successMessage = "We'll be in touch soon.",
	successTitle = "Thank you for signing up!",
	className,
}) {
	const { fields, design } = config;
	const formStyles = useFormStyles(design);
	const { formData, errors, handleChange, validate, clearErrors } =
		useFormState();

	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Sort fields by order
	const sortedFields = [...fields].sort((a, b) => a.order - b.order);

	// Handle form submission
	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (mode === "preview") return;

			// Validate all fields
			if (!validate(sortedFields)) {
				return;
			}

			setSubmitting(true);
			setSubmitError(null);
			clearErrors();

			try {
				if (onSubmit) {
					await onSubmit(formData);
				}
				setSubmitted(true);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Failed to submit form";
				setSubmitError(message);
			} finally {
				setSubmitting(false);
			}
		},
		[mode, validate, sortedFields, formData, onSubmit, clearErrors],
	);

	// Handle field change - maps field.id to formData key
	const handleFieldChange = useCallback(
		(field: FormFieldType) => (value: string) => {
			handleChange(field.id, value);
		},
		[handleChange],
	);

	// Get field value - uses field.id as key
	const getFieldValue = useCallback(
		(field: FormFieldType) => {
			return formData[field.id] || "";
		},
		[formData],
	);

	// Get field error
	const getFieldError = useCallback(
		(field: FormFieldType) => {
			return errors[field.id];
		},
		[errors],
	);

	const isDisabled = mode === "preview";
	const isTwoColumn = design.layout === "two-column";
	const isFullWidthButton = design.layout === "single-column";

	const formClassName = [styles.form, className].filter(Boolean).join(" ");

	const buttonClassName = [
		styles.submitButton,
		isFullWidthButton && styles["submitButton--fullWidth"],
	]
		.filter(Boolean)
		.join(" ");

	// Split fields by column for two-column layout
	const leftColumnFields = sortedFields.filter((f) => (f.column || 1) === 1);
	const rightColumnFields = sortedFields.filter((f) => f.column === 2);

	// Show success state
	if (submitted) {
		return (
			<div className={formClassName} style={formStyles}>
				<div className={styles.success}>
					<i
						className={`ri-check-circle-line ${styles.successIcon}`}
						aria-hidden="true"
					/>
					<h2 className={styles.successTitle}>{successTitle}</h2>
					<p className={styles.successMessage}>{successMessage}</p>
				</div>
			</div>
		);
	}

	// Render a field
	const renderField = (field: FormFieldType) => (
		<FormField
			key={field.id}
			field={field}
			value={getFieldValue(field)}
			onChange={handleFieldChange(field)}
			disabled={isDisabled}
			error={getFieldError(field)}
		/>
	);

	return (
		<form
			className={formClassName}
			style={formStyles}
			onSubmit={handleSubmit}
			noValidate
		>
			{/* Submit error */}
			{submitError && (
				<div className={styles.error} role="alert">
					{submitError}
				</div>
			)}

			{/* Form fields */}
			{isTwoColumn ? (
				<div className={styles.fieldsGrid}>
					<div className={styles.column}>
						{leftColumnFields.map(renderField)}
					</div>
					<div className={styles.column}>
						{rightColumnFields.map(renderField)}
					</div>
				</div>
			) : (
				<div className={styles.fields}>
					{sortedFields.map(renderField)}
				</div>
			)}

			{/* Submit button */}
			<button
				type="submit"
				className={buttonClassName}
				disabled={isDisabled || submitting}
			>
				{submitting ? "Submitting..." : submitText}
			</button>

			{/* Custom CSS injection */}
			{design.customCss && !design.customCss.startsWith("__DESIGN__:") && (
				<style>{design.customCss}</style>
			)}
		</form>
	);
});

FormRenderer.displayName = "FormRenderer";
