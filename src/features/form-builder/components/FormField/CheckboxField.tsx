/**
 * CheckboxField Component
 * Handles: checkbox field type (single or multi-option)
 *
 * Value storage:
 * - Single checkbox (no options): "true" or "false"
 * - Multiple checkboxes (with options): comma-separated values, e.g., "opt1,opt2"
 */

import { memo, useCallback } from "react";
import type { FormField } from "@/types/common.types";
import styles from "./component.module.scss";

export interface CheckboxFieldProps {
	/** Field configuration */
	field: FormField;
	/** Current value (comma-separated for multi-option) */
	value: string;
	/** Change handler */
	onChange?: (value: string) => void;
	/** Whether the field is disabled (preview mode) */
	disabled?: boolean;
	/** Error message */
	error?: string;
}

/**
 * Renders checkbox fields (single or multi-option)
 */
export const CheckboxField = memo<CheckboxFieldProps>(function CheckboxField({
	field,
	value,
	onChange,
	disabled = false,
	error,
}) {
	const inputId = `field-${field.id}`;
	const errorId = `${inputId}-error`;
	const helpTextId = `${inputId}-help`;

	// Parse selected values for multi-option
	const selectedValues = value ? value.split(",").filter(Boolean) : [];

	// Handle multi-option checkbox toggle
	const handleMultiChange = useCallback(
		(option: string, checked: boolean) => {
			const newValues = checked
				? [...selectedValues, option]
				: selectedValues.filter((v) => v !== option);
			onChange?.(newValues.join(","));
		},
		[selectedValues, onChange],
	);

	// Handle single checkbox toggle
	const handleSingleChange = useCallback(
		(checked: boolean) => {
			onChange?.(checked ? "true" : "false");
		},
		[onChange],
	);

	const hasOptions = field.options && field.options.length > 0;

	return (
		<div className={styles.field}>
			<label className={styles.label} id={`${inputId}-label`}>
				{field.label}
				{field.required && (
					<span className={styles.required} aria-hidden="true">
						*
					</span>
				)}
			</label>

			{hasOptions ? (
				// Multi-option checkboxes
				<div
					className={styles.optionGroup}
					role="group"
					aria-labelledby={`${inputId}-label`}
					aria-describedby={
						[error && errorId, field.helpText && helpTextId]
							.filter(Boolean)
							.join(" ") || undefined
					}
				>
					{field.options!.map((option, idx) => (
						<label key={idx} className={styles.optionLabel}>
							<input
								type="checkbox"
								name={field.id}
								value={option}
								checked={selectedValues.includes(option)}
								onChange={(e) => handleMultiChange(option, e.target.checked)}
								disabled={disabled}
								className={styles.checkbox}
								aria-invalid={!!error}
							/>
							<span>{option}</span>
						</label>
					))}
				</div>
			) : (
				// Single checkbox
				<label className={styles.optionLabel}>
					<input
						id={inputId}
						type="checkbox"
						checked={value === "true"}
						onChange={(e) => handleSingleChange(e.target.checked)}
						disabled={disabled}
						required={field.required}
						aria-required={field.required}
						aria-invalid={!!error}
						aria-describedby={
							[error && errorId, field.helpText && helpTextId]
								.filter(Boolean)
								.join(" ") || undefined
						}
						className={styles.checkbox}
					/>
					<span>{field.placeholder || "Yes"}</span>
				</label>
			)}

			{error && (
				<span id={errorId} className={styles.error} role="alert">
					{error}
				</span>
			)}

			{field.helpText && !error && (
				<span id={helpTextId} className={styles.helpText}>
					{field.helpText}
				</span>
			)}
		</div>
	);
});

CheckboxField.displayName = "CheckboxField";
