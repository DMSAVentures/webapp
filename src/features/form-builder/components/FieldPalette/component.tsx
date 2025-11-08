/**
 * FieldPalette Component
 * Displays draggable field types for form builder
 */

import { type HTMLAttributes, memo } from "react";
import type { FormField } from "@/types/common.types";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import styles from "./component.module.scss";

export interface FieldPaletteProps extends HTMLAttributes<HTMLDivElement> {
	/** Callback when a field type is selected */
	onFieldSelect: (fieldType: FormField["type"]) => void;
	/** Additional CSS class name */
	className?: string;
}

interface FieldType {
	type: FormField["type"];
	label: string;
	icon: string;
	description: string;
}

const FIELD_TYPES: FieldType[] = [
	{
		type: "email",
		label: "Email",
		icon: "ri-mail-line",
		description: "Email address input",
	},
	{
		type: "text",
		label: "Text",
		icon: "ri-text",
		description: "Single line text input",
	},
	{
		type: "textarea",
		label: "Text Area",
		icon: "ri-file-text-line",
		description: "Multi-line text input",
	},
	{
		type: "select",
		label: "Dropdown",
		icon: "ri-arrow-down-s-line",
		description: "Select from options",
	},
	{
		type: "checkbox",
		label: "Checkbox",
		icon: "ri-checkbox-line",
		description: "Multiple choice",
	},
	{
		type: "radio",
		label: "Radio",
		icon: "ri-radio-button-line",
		description: "Single choice",
	},
	{
		type: "phone",
		label: "Phone",
		icon: "ri-phone-line",
		description: "Phone number input",
	},
	{
		type: "url",
		label: "URL",
		icon: "ri-link",
		description: "Website URL input",
	},
	{
		type: "date",
		label: "Date",
		icon: "ri-calendar-line",
		description: "Date picker",
	},
	{
		type: "number",
		label: "Number",
		icon: "ri-hashtag",
		description: "Numeric input",
	},
];

/**
 * FieldPalette displays available field types that can be added to the form
 */
export const FieldPalette = memo<FieldPaletteProps>(function FieldPalette({
	onFieldSelect,
	className: customClassName,
	...props
}) {
	const { handlePaletteDragStart, handleDragEnd } = useDragAndDrop();
	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	const handleClick = (fieldType: FormField["type"]) => {
		onFieldSelect(fieldType);
	};

	return (
		<div className={classNames} {...props}>
			<div className={styles.header}>
				<h3 className={styles.title}>Field Types</h3>
				<p className={styles.subtitle}>Drag or click to add</p>
			</div>

			<div className={styles.fields}>
				{FIELD_TYPES.map((field) => (
					<button
						key={field.type}
						type="button"
						className={styles.fieldItem}
						draggable
						onDragStart={handlePaletteDragStart(field.type)}
						onDragEnd={handleDragEnd}
						onClick={() => handleClick(field.type)}
						aria-label={`Add ${field.label} field`}
					>
						<i className={`${field.icon} ${styles.icon}`} aria-hidden="true" />
						<div className={styles.fieldInfo}>
							<span className={styles.fieldLabel}>{field.label}</span>
							<span className={styles.fieldDescription}>
								{field.description}
							</span>
						</div>
						<i className="ri-add-line" aria-hidden="true" />
					</button>
				))}
			</div>
		</div>
	);
});

FieldPalette.displayName = "FieldPalette";
