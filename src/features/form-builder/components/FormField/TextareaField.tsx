/**
 * TextareaField Component
 * Handles: textarea field type
 */

import { memo } from "react";
import type { FormField } from "@/types/common.types";
import styles from "./component.module.scss";

export interface TextareaFieldProps {
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
 * Renders multi-line textarea fields
 */
export const TextareaField = memo<TextareaFieldProps>(function TextareaField({
	field,
	value,
	onChange,
	disabled = false,
	error,
}) {
	const inputId = `field-${field.id}`;
	const errorId = `${inputId}-error`;
	const helpTextId = `${inputId}-help`;

	const textareaClassName = [
		styles.input,
		styles.textarea,
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

			<textarea
				id={inputId}
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				placeholder={field.placeholder}
				disabled={disabled}
				required={field.required}
				aria-required={field.required}
				aria-invalid={!!error}
				aria-describedby={
					[error && errorId, field.helpText && helpTextId]
						.filter(Boolean)
						.join(" ") || undefined
				}
				className={textareaClassName}
				minLength={field.validation?.minLength}
				maxLength={field.validation?.maxLength}
			/>

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

TextareaField.displayName = "TextareaField";
