/**
 * FormField Component
 * Unified form field renderer that dispatches to specific field type components
 */

import { memo } from "react";
import type { FormField as FormFieldType } from "@/types/common.types";
import { CheckboxField } from "./CheckboxField";
import { RadioField } from "./RadioField";
import { SelectField } from "./SelectField";
import { TextField } from "./TextField";
import { TextareaField } from "./TextareaField";

export interface FormFieldProps {
	/** Field configuration */
	field: FormFieldType;
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
 * FormField renders the appropriate field component based on field type
 */
export const FormField = memo<FormFieldProps>(function FormField({
	field,
	value,
	onChange,
	disabled = false,
	error,
}) {
	const commonProps = {
		field,
		value,
		onChange,
		disabled,
		error,
	};

	switch (field.type) {
		case "textarea":
			return <TextareaField {...commonProps} />;

		case "select":
			return <SelectField {...commonProps} />;

		case "checkbox":
			return <CheckboxField {...commonProps} />;

		case "radio":
			return <RadioField {...commonProps} />;

		// text, email, phone, url, date, number all use TextField
		default:
			return <TextField {...commonProps} />;
	}
});

FormField.displayName = "FormField";

// Re-export individual field components for direct use if needed
export { CheckboxField } from "./CheckboxField";
export { RadioField } from "./RadioField";
export { SelectField } from "./SelectField";
export { TextField } from "./TextField";
export { TextareaField } from "./TextareaField";
