/**
 * RadioField Component
 * Handles: radio button field type
 *
 * Value storage: Selected option string
 */

import { memo } from "react";
import type { FormField } from "@/types/common.types";
import styles from "./component.module.scss";

export interface RadioFieldProps {
	/** Field configuration */
	field: FormField;
	/** Current value (selected option) */
	value: string;
	/** Change handler */
	onChange?: (value: string) => void;
	/** Whether the field is disabled (preview mode) */
	disabled?: boolean;
	/** Error message */
	error?: string;
}

/**
 * Renders radio button groups
 */
export const RadioField = memo<RadioFieldProps>(function RadioField({
	field,
	value,
	onChange,
	disabled = false,
	error,
}) {
	const inputId = `field-${field.id}`;
	const errorId = `${inputId}-error`;
	const helpTextId = `${inputId}-help`;

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

			<div
				className={styles.optionGroup}
				role="radiogroup"
				aria-labelledby={`${inputId}-label`}
				aria-required={field.required}
				aria-describedby={
					[error && errorId, field.helpText && helpTextId]
						.filter(Boolean)
						.join(" ") || undefined
				}
			>
				{field.options?.map((option, idx) => (
					<label key={idx} className={styles.optionLabel}>
						<input
							type="radio"
							name={field.id}
							value={option}
							checked={value === option}
							onChange={(e) => onChange?.(e.target.value)}
							disabled={disabled}
							required={field.required && idx === 0}
							className={styles.radio}
							aria-invalid={!!error}
						/>
						<span>{option}</span>
					</label>
				))}
			</div>

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

RadioField.displayName = "RadioField";
