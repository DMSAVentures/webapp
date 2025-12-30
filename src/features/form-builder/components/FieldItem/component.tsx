/**
 * FieldItem Component
 * Displays a single form field in the canvas
 */

import {
	ArrowLeft,
	ArrowRight,
	Calendar,
	CheckSquare,
	ChevronDown,
	Circle,
	FileText,
	GripVertical,
	Hash,
	Link,
	type LucideIcon,
	Mail,
	Phone,
	Trash2,
	Type,
} from "lucide-react";
import { type DragEvent, type HTMLAttributes, memo } from "react";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { FormField } from "@/types/common.types";
import styles from "./component.module.scss";

export interface FieldItemProps extends HTMLAttributes<HTMLDivElement> {
	/** Field data */
	field: FormField;
	/** Whether this field is selected */
	isSelected: boolean;
	/** Drag start handler */
	onDragStart: (e: DragEvent) => void;
	/** Drag end handler */
	onDragEnd: (e: DragEvent) => void;
	/** Click handler */
	onSelect: () => void;
	/** Delete handler */
	onDelete: () => void;
	/** Whether to show column toggle (two-column layout) */
	showColumnToggle?: boolean;
	/** Column toggle handler */
	onColumnToggle?: () => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Get field type icon
 */
const getFieldIcon = (type: FormField["type"]): LucideIcon => {
	const icons: Record<FormField["type"], LucideIcon> = {
		email: Mail,
		text: Type,
		textarea: FileText,
		select: ChevronDown,
		checkbox: CheckSquare,
		radio: Circle,
		phone: Phone,
		url: Link,
		date: Calendar,
		number: Hash,
	};
	return icons[type];
};

/**
 * FieldItem displays a form field with drag handle and actions
 */
export const FieldItem = memo<FieldItemProps>(function FieldItem({
	field,
	isSelected,
	onDragStart,
	onDragEnd,
	onSelect,
	onDelete,
	showColumnToggle = false,
	onColumnToggle,
	className: customClassName,
	...props
}) {
	const classNames = [
		styles.root,
		isSelected && styles.selected,
		customClassName,
	]
		.filter(Boolean)
		.join(" ");

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete();
	};

	const handleColumnToggleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onColumnToggle?.();
	};

	const currentColumn = field.column || 1;

	return (
		<div
			className={classNames}
			draggable
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			onClick={onSelect}
			role="button"
			tabIndex={0}
			aria-label={`${field.label} field`}
			{...props}
		>
			<div className={styles.dragHandle}>
				<Icon icon={GripVertical} size="sm" color="muted" />
			</div>

			{/* Left side: Type icon and badge */}
			<Stack direction="row" gap="sm" align="center" className={styles.typeInfo}>
				<Icon icon={getFieldIcon(field.type)} size="md" color="secondary" />
				<Badge variant="secondary" size="sm">{field.type}</Badge>
			</Stack>

			{/* Center: Field label and details */}
			<Stack gap="0" className={styles.content}>
				<Text size="sm" weight="medium">
					{field.label}
					{field.required && <span className={styles.required}>*</span>}
				</Text>
				{field.placeholder && (
					<Text size="xs" color="muted">{field.placeholder}</Text>
				)}
				{/* Show options count for select/radio/checkbox fields */}
				{["select", "radio", "checkbox"].includes(field.type) && (
					<Text size="xs" color="muted">
						{field.options?.length || 0} option
						{(field.options?.length || 0) !== 1 ? "s" : ""}
					</Text>
				)}
			</Stack>

			{/* Column indicator (only in two-column mode) */}
			{showColumnToggle && (
				<div className={styles.columnIndicator}>
					<Badge
						variant={currentColumn === 1 ? "primary" : "secondary"}
						size="sm"
					>{currentColumn === 1 ? "Left" : "Right"}</Badge>
				</div>
			)}

			{/* Actions: always visible */}
			<Stack direction="row" gap="xs" className={styles.actions}>
				{/* Column toggle button (only in two-column mode) */}
				{showColumnToggle && (
					<Button
						leftIcon={currentColumn === 1 ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
						variant="secondary"
						aria-label={`Move to ${currentColumn === 1 ? "right" : "left"} column`}
						onClick={handleColumnToggleClick}
						title={`Move to ${currentColumn === 1 ? "right" : "left"} column`}
					/>
				)}
				{/* Delete button - always visible, but not for email field */}
				{field.type !== "email" && (
					<Button
						leftIcon={<Trash2 size={16} />}
						variant="secondary"
						aria-label="Delete field"
						onClick={handleDeleteClick}
					/>
				)}
			</Stack>
		</div>
	);
});

FieldItem.displayName = "FieldItem";
