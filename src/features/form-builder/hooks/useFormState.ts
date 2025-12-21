/**
 * useFormState Hook
 * Manages form state for interactive forms
 */

import { useCallback, useState } from "react";
import type { FormField } from "@/types/common.types";

export interface UseFormStateReturn {
	/** Current form data as key-value pairs */
	formData: Record<string, string>;
	/** Validation errors per field */
	errors: Record<string, string>;
	/** Update a field value */
	handleChange: (fieldName: string, value: string) => void;
	/** Validate all fields, returns true if valid */
	validate: (fields: FormField[]) => boolean;
	/** Reset form to initial state */
	reset: () => void;
	/** Set a specific error */
	setFieldError: (fieldName: string, error: string) => void;
	/** Clear all errors */
	clearErrors: () => void;
}

/**
 * Form state management hook for interactive forms
 */
export const useFormState = (
	initialData: Record<string, string> = {},
): UseFormStateReturn => {
	const [formData, setFormData] = useState<Record<string, string>>(initialData);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = useCallback((fieldName: string, value: string) => {
		setFormData((prev) => ({ ...prev, [fieldName]: value }));
		// Clear error when field is modified
		setErrors((prev) => {
			if (prev[fieldName]) {
				const newErrors = { ...prev };
				delete newErrors[fieldName];
				return newErrors;
			}
			return prev;
		});
	}, []);

	const validate = useCallback(
		(fields: FormField[]): boolean => {
			const newErrors: Record<string, string> = {};

			for (const field of fields) {
				const value = formData[field.id] || "";

				// Required validation
				if (field.required && !value.trim()) {
					newErrors[field.id] = `${field.label} is required`;
					continue;
				}

				// Skip further validation if empty and not required
				if (!value.trim()) continue;

				// Email validation
				if (field.type === "email") {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailRegex.test(value)) {
						newErrors[field.id] = "Please enter a valid email address";
					}
				}

				// URL validation
				if (field.type === "url") {
					try {
						new URL(value);
					} catch {
						newErrors[field.id] = "Please enter a valid URL";
					}
				}

				// Min/max length validation
				if (field.validation?.minLength && value.length < field.validation.minLength) {
					newErrors[field.id] = `Minimum ${field.validation.minLength} characters required`;
				}

				if (field.validation?.maxLength && value.length > field.validation.maxLength) {
					newErrors[field.id] = `Maximum ${field.validation.maxLength} characters allowed`;
				}

				// Number validation
				if (field.type === "number") {
					const numValue = parseFloat(value);
					if (isNaN(numValue)) {
						newErrors[field.id] = "Please enter a valid number";
					} else {
						if (field.validation?.min !== undefined && numValue < field.validation.min) {
							newErrors[field.id] = `Minimum value is ${field.validation.min}`;
						}
						if (field.validation?.max !== undefined && numValue > field.validation.max) {
							newErrors[field.id] = `Maximum value is ${field.validation.max}`;
						}
					}
				}

				// Pattern validation
				if (field.validation?.pattern) {
					const regex = new RegExp(field.validation.pattern);
					if (!regex.test(value)) {
						newErrors[field.id] =
							field.validation.customError || "Invalid format";
					}
				}
			}

			setErrors(newErrors);
			return Object.keys(newErrors).length === 0;
		},
		[formData],
	);

	const reset = useCallback(() => {
		setFormData(initialData);
		setErrors({});
	}, [initialData]);

	const setFieldError = useCallback((fieldName: string, error: string) => {
		setErrors((prev) => ({ ...prev, [fieldName]: error }));
	}, []);

	const clearErrors = useCallback(() => {
		setErrors({});
	}, []);

	return {
		formData,
		errors,
		handleChange,
		validate,
		reset,
		setFieldError,
		clearErrors,
	};
};
