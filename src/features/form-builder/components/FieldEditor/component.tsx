/**
 * FieldEditor Component
 * Edit properties of a selected form field
 */

import { type HTMLAttributes, memo, useEffect, useState } from "react";
import { Button } from "@/proto-design-system/Button/button";
import { Badge } from "@/proto-design-system/badge/badge";
import CheckboxWithLabel from "@/proto-design-system/checkbox/checkboxWithLabel";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";
import { TextArea } from "@/proto-design-system/TextArea/textArea";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
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
	optionsText?: string; // Raw text value for the options textarea
	validation?: {
		minLength?: number;
		maxLength?: number;
		pattern?: string;
		min?: number;
		max?: number;
	};
}

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
	const [formData, setFormData] = useState<FieldFormData>({
		label: "",
		placeholder: "",
		required: false,
		helpText: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Update form data when field changes
	useEffect(() => {
		if (field) {
			const optionsArray = field.options || [];
			setFormData({
				label: field.label || "",
				placeholder: field.placeholder || "",
				required: field.required || false,
				helpText: field.helpText || "",
				options: optionsArray,
				optionsText: optionsArray.join("\n"),
				validation: field.validation || {},
			});
			setErrors({});
		}
	}, [field]);

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

	const validateLabel = (label: string): string | null => {
		if (!label.trim()) {
			return "Label is required";
		}

		if (label.trim().length < 2) {
			return "Label must be at least 2 characters";
		}

		if (label.trim().length > 100) {
			return "Label must be less than 100 characters";
		}

		// Check for duplicate labels (case-insensitive)
		const isDuplicate = allFields.some(
			(f) =>
				f.id !== field.id &&
				f.label.toLowerCase().trim() === label.toLowerCase().trim(),
		);

		if (isDuplicate) {
			return "Label must be unique. Another field already uses this label";
		}

		return null;
	};

	const handleLabelChange = (value: string) => {
		setFormData((prev) => ({ ...prev, label: value }));

		// Validate on change
		const error = validateLabel(value);
		setErrors((prev) => ({
			...prev,
			label: error || "",
		}));
	};

	const handlePlaceholderChange = (value: string) => {
		setFormData((prev) => ({ ...prev, placeholder: value }));
	};

	const handleRequiredChange = (checked: boolean) => {
		setFormData((prev) => ({ ...prev, required: checked }));
	};

	const handleHelpTextChange = (value: string) => {
		setFormData((prev) => ({ ...prev, helpText: value }));
	};

	const handleOptionsChange = (value: string) => {
		// Store raw text to preserve newlines while typing
		// Parse options only for validation/preview (trim and filter empty)
		const options = value
			.split("\n")
			.map((opt) => opt.trim())
			.filter((opt) => opt.length > 0);
		setFormData((prev) => ({ ...prev, options, optionsText: value }));
	};

	const handleValidationChange = (
		key: string,
		value: string | number | boolean | undefined,
	) => {
		setFormData((prev) => ({
			...prev,
			validation: {
				...prev.validation,
				[key]: value || undefined,
			},
		}));
	};

	const handleSave = () => {
		// Final validation
		const labelError = validateLabel(formData.label);

		if (labelError) {
			setErrors({ label: labelError });
			return;
		}

		// Update field
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
	};

	const handleCancel = () => {
		// Reset form to original values
		const optionsArray = field.options || [];
		setFormData({
			label: field.label || "",
			placeholder: field.placeholder || "",
			required: field.required || false,
			helpText: field.helpText || "",
			options: optionsArray,
			optionsText: optionsArray.join("\n"),
			validation: field.validation || {},
		});
		setErrors({});
		onClose();
	};

	// Compare options arrays
	const optionsChanged =
		JSON.stringify(formData.options || []) !==
		JSON.stringify(field.options || []);

	// Compare validation objects
	const validationChanged =
		JSON.stringify(formData.validation || {}) !==
		JSON.stringify(field.validation || {});

	const hasChanges =
		formData.label !== field.label ||
		formData.placeholder !== (field.placeholder || "") ||
		formData.required !== (field.required || false) ||
		formData.helpText !== (field.helpText || "") ||
		optionsChanged ||
		validationChanged;

	const canSave = hasChanges && !errors.label;

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	return (
		<div className={classNames} {...props}>
			<div className={styles.header}>
				<h3 className={styles.title}>Edit Field</h3>
				<Badge
					text={field.type}
					variant="gray"
					styleType="light"
					size="small"
				/>
			</div>

			<div className={styles.content}>
				{/* Label */}
				<TextInput
					id="field-label"
					label="Label"
					type="text"
					value={formData.label}
					onChange={(e) => handleLabelChange(e.target.value)}
					placeholder="Enter field label"
					required
					error={errors.label}
					hint="This is what users will see above the field"
				/>

				{/* Placeholder - Show for input fields */}
				{[
					"email",
					"text",
					"textarea",
					"phone",
					"url",
					"date",
					"number",
				].includes(field.type) && (
					<TextInput
						id="field-placeholder"
						label="Placeholder"
						type="text"
						value={formData.placeholder}
						onChange={(e) => handlePlaceholderChange(e.target.value)}
						placeholder="Enter placeholder text"
						hint="Hint text shown inside the field when empty"
					/>
				)}

				{/* Help Text */}
				<TextArea
					id="field-help-text"
					label="Help Text"
					value={formData.helpText || ""}
					onChange={(e) => handleHelpTextChange(e.target.value)}
					placeholder="Additional instructions or context"
					rows={3}
					hint="Optional help text shown below the field"
				/>

				{/* Options - Show for select/radio/checkbox */}
				{["select", "radio", "checkbox"].includes(field.type) && (
					<>
						<ContentDivider size="thin" />
						<TextArea
							id="field-options"
							label="Options"
							value={formData.optionsText ?? ""}
							onChange={(e) => handleOptionsChange(e.target.value)}
							placeholder="Enter one option per line"
							rows={6}
							required
							hint="Each line will be a separate option"
						/>
					</>
				)}

				{/* Text validation - Show for text/textarea */}
				{["text", "textarea"].includes(field.type) && (
					<>
						<ContentDivider size="thin" />
						<div className={styles.validationSection}>
							<h4 className={styles.sectionTitle}>Text Validation</h4>
							<div className={styles.validationRow}>
								<TextInput
									id="field-min-length"
									label="Min Length"
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
								<TextInput
									id="field-max-length"
									label="Max Length"
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
					</>
				)}

				{/* Number validation - Show for number */}
				{field.type === "number" && (
					<>
						<ContentDivider size="thin" />
						<div className={styles.validationSection}>
							<h4 className={styles.sectionTitle}>Number Validation</h4>
							<div className={styles.validationRow}>
								<TextInput
									id="field-min"
									label="Minimum Value"
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
								<TextInput
									id="field-max"
									label="Maximum Value"
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
					</>
				)}

				<ContentDivider size="thin" />

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
