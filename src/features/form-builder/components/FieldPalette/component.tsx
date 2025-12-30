/**
 * FieldPalette Component
 * Displays draggable field types for form builder
 */

import {
	Calendar,
	CheckSquare,
	ChevronDown,
	Circle,
	FileText,
	Hash,
	Link,
	type LucideIcon,
	Mail,
	Phone,
	Plus,
	Type,
} from "lucide-react";
import { type HTMLAttributes, memo } from "react";
import { Icon, Stack, Text } from "@/proto-design-system";
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
	icon: LucideIcon;
	description: string;
}

const FIELD_TYPES: FieldType[] = [
	{
		type: "email",
		label: "Email",
		icon: Mail,
		description: "Email address input",
	},
	{
		type: "text",
		label: "Text",
		icon: Type,
		description: "Single line text input",
	},
	{
		type: "textarea",
		label: "Text Area",
		icon: FileText,
		description: "Multi-line text input",
	},
	{
		type: "select",
		label: "Dropdown",
		icon: ChevronDown,
		description: "Select from options",
	},
	{
		type: "checkbox",
		label: "Checkbox",
		icon: CheckSquare,
		description: "Multiple choice",
	},
	{
		type: "radio",
		label: "Radio",
		icon: Circle,
		description: "Single choice",
	},
	{
		type: "phone",
		label: "Phone",
		icon: Phone,
		description: "Phone number input",
	},
	{
		type: "url",
		label: "URL",
		icon: Link,
		description: "Website URL input",
	},
	{
		type: "date",
		label: "Date",
		icon: Calendar,
		description: "Date picker",
	},
	{
		type: "number",
		label: "Number",
		icon: Hash,
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
		<Stack gap="md" className={classNames} {...props}>
			<Stack gap="xs" className={styles.header}>
				<Text as="h3" size="md" weight="semibold">Field Types</Text>
				<Text size="sm" color="muted">Drag or click to add</Text>
			</Stack>

			<Stack gap="sm" className={styles.fields}>
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
						<Icon icon={field.icon} size="md" color="secondary" className={styles.icon} />
						<Stack gap="0" className={styles.fieldInfo}>
							<Text size="sm" weight="medium">{field.label}</Text>
							<Text size="xs" color="muted">{field.description}</Text>
						</Stack>
						<Icon icon={Plus} size="sm" color="muted" />
					</button>
				))}
			</Stack>
		</Stack>
	);
});

FieldPalette.displayName = "FieldPalette";
