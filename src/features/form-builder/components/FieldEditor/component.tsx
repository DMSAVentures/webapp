/**
 * FieldEditor Component
 * Edit properties of a selected form field
 */

import { Check, Pencil } from "lucide-react";
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
	Checkbox,
	Divider,
	FormField as ProtoFormField,
	Grid,
	Icon,
	Input,
	Stack,
	Text,
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
				<Stack gap="md" align="center" justify="center" className={styles.emptyState}>
					<Icon icon={Pencil} size="xl" color="muted" />
					<Text color="muted">Select a field to edit its properties</Text>
				</Stack>
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
			<Stack direction="row" align="center" gap="sm" className={styles.header}>
				<Text as="h3" size="lg" weight="semibold">Edit Field</Text>
				<Badge variant="secondary" size="sm">{field.type}</Badge>
			</Stack>

			<Stack gap="lg" className={styles.content}>
				{/* Label */}
				<ProtoFormField
					label="Label"
					required
					id="field-label"
					helperText="This is what users will see above the field"
					errorMessage={errors.label}
				>
					<Input
						id="field-label"
						type="text"
						value={formData.label}
						onChange={(e) => handleLabelChange(e.target.value)}
						placeholder="Enter field label"
						required
						isError={!!errors.label}
					/>
				</ProtoFormField>

				{/* Placeholder */}
				{supportsPlaceholder(field.type) && (
					<ProtoFormField
						label="Placeholder"
						id="field-placeholder"
						helperText="Hint text shown inside the field when empty"
					>
						<Input
							id="field-placeholder"
							type="text"
							value={formData.placeholder}
							onChange={(e) => handlePlaceholderChange(e.target.value)}
							placeholder="Enter placeholder text"
						/>
					</ProtoFormField>
				)}

				{/* Help Text */}
				<ProtoFormField
					label="Help Text"
					id="field-help-text"
					helperText="Optional help text shown below the field"
				>
					<TextArea
						id="field-help-text"
						value={formData.helpText || ""}
						onChange={(e) => handleHelpTextChange(e.target.value)}
						placeholder="Additional instructions or context"
						rows={3}
					/>
				</ProtoFormField>

				{/* Options */}
				{supportsOptions(field.type) && (
					<>
						<Divider />
						<ProtoFormField
							label="Options"
							required
							id="field-options"
							helperText="Each line will be a separate option"
						>
							<TextArea
								id="field-options"
								value={formData.optionsText ?? ""}
								onChange={(e) => handleOptionsChange(e.target.value)}
								placeholder="Enter one option per line"
								rows={6}
								required
							/>
						</ProtoFormField>
					</>
				)}

				{/* Text validation */}
				{supportsTextValidation(field.type) && (
					<>
						<Divider />
						<Stack gap="md">
							<Text as="h4" size="md" weight="semibold">Text Validation</Text>
							<Grid columns="2" gap="md">
								<ProtoFormField label="Min Length" id="field-min-length">
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
								</ProtoFormField>
								<ProtoFormField label="Max Length" id="field-max-length">
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
								</ProtoFormField>
							</Grid>
						</Stack>
					</>
				)}

				{/* Number validation */}
				{field.type === "number" && (
					<>
						<Divider />
						<Stack gap="md">
							<Text as="h4" size="md" weight="semibold">Number Validation</Text>
							<Grid columns="2" gap="md">
								<ProtoFormField label="Minimum Value" id="field-min">
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
								</ProtoFormField>
								<ProtoFormField label="Maximum Value" id="field-max">
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
								</ProtoFormField>
							</Grid>
						</Stack>
					</>
				)}

				<Divider />

				{/* Required */}
				<Checkbox
					checked={formData.required}
					onChange={(e) => handleRequiredChange(e.target.checked)}
					label="Required field"
					description="Users must fill this field to submit the form"
				/>
			</Stack>

			<Stack direction="row" justify="end" gap="sm" className={styles.actions}>
				<Button variant="secondary" onClick={handleCancel}>
					Cancel
				</Button>
				<Button
					variant="primary"
					onClick={handleSave}
					disabled={!canSave}
					leftIcon={canSave ? <Check size={16} /> : undefined}
				>
					Save Changes
				</Button>
			</Stack>
		</div>
	);
});

FieldEditor.displayName = "FieldEditor";
