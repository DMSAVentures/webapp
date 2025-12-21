/**
 * SelectField Component
 * Handles: select dropdown field type
 */

import { memo } from "react";
import type { FormField } from "@/types/common.types";
import styles from "./component.module.scss";

export interface SelectFieldProps {
	/** Field configuration */
	field: FormField;
	/** Current value */
	value: string;
	/** Change handler */
	onChange?: (value: string) => void;
	/** Whether the field is disabled (preview mode) */
	disabled?: boolean;
	/** Error message */
	error?: string;
}

/**
 * Renders select dropdown fields
 */
export const SelectField = memo<SelectFieldProps>(function SelectField({
	field,
	value,
	onChange,
	disabled = false,
	error,
}) {
	const inputId = `field-${field.id}`;
	const errorId = `${inputId}-error`;
	const helpTextId = `${inputId}-help`;

	const selectClassName = [
		styles.input,
		styles.select,
		error && styles["input--error"],
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={styles.field}>
			<label htmlFor={inputId} className={styles.label}>
				{field.label}
				{field.required && (
					<span className={styles.required} aria-hidden="true">
						*
					</span>
				)}
			</label>

			<select
				id={inputId}
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				disabled={disabled}
				required={field.required}
				aria-required={field.required}
				aria-invalid={!!error}
				aria-describedby={
					[error && errorId, field.helpText && helpTextId]
						.filter(Boolean)
						.join(" ") || undefined
				}
				className={selectClassName}
			>
				<option value="">{field.placeholder || "Select an option"}</option>
				{field.options?.map((option, idx) => (
					<option key={idx} value={option}>
						{option}
					</option>
				))}
			</select>

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

SelectField.displayName = "SelectField";
