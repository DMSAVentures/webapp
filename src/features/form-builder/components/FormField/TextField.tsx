/**
 * TextField Component
 * Handles: text, email, phone, url, date, number field types
 */

import { memo, useCallback } from "react";
import type { FormField } from "@/types/common.types";
import styles from "./component.module.scss";

export interface TextFieldProps {
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
 * Maps field types to HTML input types
 */
const getInputType = (fieldType: FormField["type"]): string => {
	switch (fieldType) {
		case "phone":
			return "tel";
		default:
			return fieldType;
	}
};

/**
 * Filters input value based on field type
 */
const filterInputValue = (
	value: string,
	fieldType: FormField["type"],
): string => {
	switch (fieldType) {
		case "phone":
			// Allow only digits, +, -, (, ), spaces
			return value.replace(/[^\d+\-() ]/g, "");
		default:
			return value;
	}
};

/**
 * Renders text-based input fields
 */
export const TextField = memo<TextFieldProps>(function TextField({
	field,
	value,
	onChange,
	disabled = false,
	error,
}) {
	const inputId = `field-${field.id}`;
	const errorId = `${inputId}-error`;
	const helpTextId = `${inputId}-help`;

	const inputClassName = [styles.input, error && styles["input--error"]]
		.filter(Boolean)
		.join(" ");

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const filteredValue = filterInputValue(e.target.value, field.type);
			onChange?.(filteredValue);
		},
		[field.type, onChange],
	);

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

			<input
				id={inputId}
				type={getInputType(field.type)}
				value={value}
				onChange={handleChange}
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
				className={inputClassName}
				min={field.validation?.min}
				max={field.validation?.max}
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

TextField.displayName = "TextField";
