/**
 * FieldEditor Component
 * Edit properties of a selected form field
 */

import {
	type HTMLAttributes,
	memo,
	useCallback,
	useEffect,
	useState,
} from "react";
import {
	Badge,
	Button,
	CheckboxWithLabel,
	Divider,
	Input,
	TextArea,
} from "@/proto-design-system";
import type { FormField } from "@/types/common.types";
import styles from "./component.module.scss";

export interface FieldEditorProps extends HTMLAttributes<HTMLDivElement> {
	/** Field being edited */
	field: FormField | null;
	/** All fields (for validation) */
	allFields: FormField[];
	/** Callback when field is updated */
	onFieldUpdate: (field: FormField) => void;
	/** Callback when editor should close */
	onClose: () => void;
	/** Additional CSS class name */
	className?: string;
}

interface FieldFormData {
	label: string;
	placeholder: string;
	required: boolean;
	helpText?: string;
	options?: string[];
	optionsText?: string;
	validation?: {
		minLength?: number;
		maxLength?: number;
		pattern?: string;
		min?: number;
		max?: number;
	};
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Validates a field label and returns an error message or null */
function validateLabel(
	label: string,
	allFields: FormField[],
	currentFieldId: string,
): string | null {
	if (!label.trim()) {
		return "Label is required";
	}

	if (label.trim().length < 2) {
		return "Label must be at least 2 characters";
	}

	if (label.trim().length > 100) {
		return "Label must be less than 100 characters";
	}

	const isDuplicate = allFields.some(
		(f) =>
			f.id !== currentFieldId &&
			f.label.toLowerCase().trim() === label.toLowerCase().trim(),
	);

	if (isDuplicate) {
		return "Label must be unique. Another field already uses this label";
	}

	return null;
}

/** Parse options from text (one per line) */
function parseOptionsFromText(text: string): string[] {
	return text
		.split("\n")
		.map((opt) => opt.trim())
		.filter((opt) => opt.length > 0);
}

/** Create initial form data from a field */
function createFormDataFromField(field: FormField): FieldFormData {
	const optionsArray = field.options || [];
	return {
		label: field.label || "",
		placeholder: field.placeholder || "",
		required: field.required || false,
		helpText: field.helpText || "",
		options: optionsArray,
		optionsText: optionsArray.join("\n"),
		validation: field.validation || {},
	};
}

/** Detect if form data has changed from the original field */
function detectChanges(formData: FieldFormData, field: FormField): boolean {
	const optionsChanged =
		JSON.stringify(formData.options || []) !==
		JSON.stringify(field.options || []);

	const validationChanged =
		JSON.stringify(formData.validation || {}) !==
		JSON.stringify(field.validation || {});

	return (
		formData.label !== field.label ||
		formData.placeholder !== (field.placeholder || "") ||
		formData.required !== (field.required || false) ||
		formData.helpText !== (field.helpText || "") ||
		optionsChanged ||
		validationChanged
	);
}

/** Check if field type supports placeholder */
function supportsPlaceholder(fieldType: string): boolean {
	return [
		"email",
		"text",
		"textarea",
		"phone",
		"url",
		"date",
		"number",
	].includes(fieldType);
}

/** Check if field type supports options */
function supportsOptions(fieldType: string): boolean {
	return ["select", "radio", "checkbox"].includes(fieldType);
}

/** Check if field type supports text validation */
function supportsTextValidation(fieldType: string): boolean {
	return ["text", "textarea"].includes(fieldType);
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing field form state */
function useFieldForm(field: FormField | null, allFields: FormField[]) {
	const [formData, setFormData] = useState<FieldFormData>({
		label: "",
		placeholder: "",
		required: false,
		helpText: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (field) {
			setFormData(createFormDataFromField(field));
			setErrors({});
		}
	}, [field]);

	const handleLabelChange = useCallback(
		(value: string) => {
			setFormData((prev) => ({ ...prev, label: value }));
			if (field) {
				const error = validateLabel(value, allFields, field.id);
				setErrors((prev) => ({ ...prev, label: error || "" }));
			}
		},
		[allFields, field],
	);

	const handlePlaceholderChange = useCallback((value: string) => {
		setFormData((prev) => ({ ...prev, placeholder: value }));
	}, []);

	const handleRequiredChange = useCallback((checked: boolean) => {
		setFormData((prev) => ({ ...prev, required: checked }));
	}, []);

	const handleHelpTextChange = useCallback((value: string) => {
		setFormData((prev) => ({ ...prev, helpText: value }));
	}, []);

	const handleOptionsChange = useCallback((value: string) => {
		const options = parseOptionsFromText(value);
		setFormData((prev) => ({ ...prev, options, optionsText: value }));
	}, []);

	const handleValidationChange = useCallback(
		(key: string, value: string | number | boolean | undefined) => {
			setFormData((prev) => ({
				...prev,
				validation: {
					...prev.validation,
					[key]: value || undefined,
				},
			}));
		},
		[],
	);

	const resetForm = useCallback(() => {
		if (field) {
			setFormData(createFormDataFromField(field));
			setErrors({});
		}
	}, [field]);

	const validateForm = useCallback((): boolean => {
		if (!field) return false;
		const labelError = validateLabel(formData.label, allFields, field.id);
		if (labelError) {
			setErrors({ label: labelError });
			return false;
		}
		return true;
	}, [formData.label, allFields, field]);

	return {
		formData,
		errors,
		handleLabelChange,
		handlePlaceholderChange,
		handleRequiredChange,
		handleHelpTextChange,
		handleOptionsChange,
		handleValidationChange,
		resetForm,
		validateForm,
	};
}

// ============================================================================
// Component
// ============================================================================

/**
 * FieldEditor allows editing field properties
 */
export const FieldEditor = memo<FieldEditorProps>(function FieldEditor({
	field,
	allFields,
	onFieldUpdate,
	onClose,
	className: customClassName,
	...props
}) {
	// Hooks
	const {
		formData,
		errors,
		handleLabelChange,
		handlePlaceholderChange,
		handleRequiredChange,
		handleHelpTextChange,
		handleOptionsChange,
		handleValidationChange,
		resetForm,
		validateForm,
	} = useFieldForm(field, allFields);

	// Handlers
	const handleSave = useCallback(() => {
		if (!field || !validateForm()) return;

		onFieldUpdate({
			...field,
			label: formData.label.trim(),
			placeholder: formData.placeholder.trim(),
			required: formData.required,
			helpText: formData.helpText?.trim(),
			options: formData.options,
			validation: formData.validation,
		});

		onClose();
	}, [field, formData, validateForm, onFieldUpdate, onClose]);

	const handleCancel = useCallback(() => {
		resetForm();
		onClose();
	}, [resetForm, onClose]);

	// Empty state
	if (!field) {
		return (
			<div
				className={`${styles.root} ${styles.empty} ${customClassName || ""}`}
				{...props}
			>
				<div className={styles.emptyState}>
					<i className="ri-edit-line" aria-hidden="true" />
					<p>Select a field to edit its properties</p>
				</div>
			</div>
		);
	}

	// Derived state
	const hasChanges = detectChanges(formData, field);
	const canSave = hasChanges && !errors.label;
	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Render
	return (
		<div className={classNames} {...props}>
			<div className={styles.header}>
				<h3 className={styles.title}>Edit Field</h3>
				<Badge
					variant="secondary"
					size="sm"
				>{field.type}</Badge>
			</div>

			<div className={styles.content}>
				{/* Label */}
				<div className={styles.fieldGroup}>
					<label htmlFor="field-label" className={styles.fieldLabel}>
						Label <span className={styles.required}>*</span>
					</label>
					<Input
						id="field-label"
						type="text"
						value={formData.label}
						onChange={(e) => handleLabelChange(e.target.value)}
						placeholder="Enter field label"
						required
						isError={!!errors.label}
					/>
					{errors.label && <span className={styles.errorText}>{errors.label}</span>}
					<span className={styles.hintText}>This is what users will see above the field</span>
				</div>

				{/* Placeholder */}
				{supportsPlaceholder(field.type) && (
					<div className={styles.fieldGroup}>
						<label htmlFor="field-placeholder" className={styles.fieldLabel}>
							Placeholder
						</label>
						<Input
							id="field-placeholder"
							type="text"
							value={formData.placeholder}
							onChange={(e) => handlePlaceholderChange(e.target.value)}
							placeholder="Enter placeholder text"
						/>
						<span className={styles.hintText}>Hint text shown inside the field when empty</span>
					</div>
				)}

				{/* Help Text */}
				<div className={styles.fieldGroup}>
					<label htmlFor="field-help-text" className={styles.fieldLabel}>
						Help Text
					</label>
					<TextArea
						id="field-help-text"
						value={formData.helpText || ""}
						onChange={(e) => handleHelpTextChange(e.target.value)}
						placeholder="Additional instructions or context"
						rows={3}
					/>
					<span className={styles.hintText}>Optional help text shown below the field</span>
				</div>

				{/* Options */}
				{supportsOptions(field.type) && (
					<>
						<Divider />
						<div className={styles.fieldGroup}>
							<label htmlFor="field-options" className={styles.fieldLabel}>
								Options <span className={styles.required}>*</span>
							</label>
							<TextArea
								id="field-options"
								value={formData.optionsText ?? ""}
								onChange={(e) => handleOptionsChange(e.target.value)}
								placeholder="Enter one option per line"
								rows={6}
								required
							/>
							<span className={styles.hintText}>Each line will be a separate option</span>
						</div>
					</>
				)}

				{/* Text validation */}
				{supportsTextValidation(field.type) && (
					<>
						<Divider />
						<div className={styles.validationSection}>
							<h4 className={styles.sectionTitle}>Text Validation</h4>
							<div className={styles.validationRow}>
								<div className={styles.fieldGroup}>
									<label htmlFor="field-min-length" className={styles.fieldLabel}>
										Min Length
									</label>
									<Input
										id="field-min-length"
										type="number"
										value={formData.validation?.minLength?.toString() || ""}
										onChange={(e) =>
											handleValidationChange(
												"minLength",
												parseInt(e.target.value) || undefined,
											)
										}
										placeholder="0"
										min={0}
									/>
								</div>
								<div className={styles.fieldGroup}>
									<label htmlFor="field-max-length" className={styles.fieldLabel}>
										Max Length
									</label>
									<Input
										id="field-max-length"
										type="number"
										value={formData.validation?.maxLength?.toString() || ""}
										onChange={(e) =>
											handleValidationChange(
												"maxLength",
												parseInt(e.target.value) || undefined,
											)
										}
										placeholder="Unlimited"
										min={0}
									/>
								</div>
							</div>
						</div>
					</>
				)}

				{/* Number validation */}
				{field.type === "number" && (
					<>
						<Divider />
						<div className={styles.validationSection}>
							<h4 className={styles.sectionTitle}>Number Validation</h4>
							<div className={styles.validationRow}>
								<div className={styles.fieldGroup}>
									<label htmlFor="field-min" className={styles.fieldLabel}>
										Minimum Value
									</label>
									<Input
										id="field-min"
										type="number"
										value={formData.validation?.min?.toString() || ""}
										onChange={(e) =>
											handleValidationChange(
												"min",
												parseFloat(e.target.value) || undefined,
											)
										}
										placeholder="No minimum"
									/>
								</div>
								<div className={styles.fieldGroup}>
									<label htmlFor="field-max" className={styles.fieldLabel}>
										Maximum Value
									</label>
									<Input
										id="field-max"
										type="number"
										value={formData.validation?.max?.toString() || ""}
										onChange={(e) =>
											handleValidationChange(
												"max",
												parseFloat(e.target.value) || undefined,
											)
										}
										placeholder="No maximum"
									/>
								</div>
							</div>
						</div>
					</>
				)}

				<Divider />

				{/* Required */}
				<CheckboxWithLabel
					checked={formData.required ? "checked" : "unchecked"}
					onChange={(e) => handleRequiredChange(e.target.checked)}
					flipCheckboxToRight={false}
					text="Required field"
					description="Users must fill this field to submit the form"
				/>
			</div>

			<div className={styles.actions}>
				<Button variant="secondary" onClick={handleCancel}>
					Cancel
				</Button>
				<Button
					variant="primary"
					onClick={handleSave}
					disabled={!canSave}
					leftIcon={canSave ? "ri-check-line" : undefined}
				>
					Save Changes
				</Button>
			</div>
		</div>
	);
});

FieldEditor.displayName = "FieldEditor";
