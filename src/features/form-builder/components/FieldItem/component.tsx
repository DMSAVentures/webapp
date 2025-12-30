/**
 * FieldItem Component
 * Displays a single form field in the canvas
 */

import { type DragEvent, type HTMLAttributes, memo } from "react";
import { Badge, Button } from "@/proto-design-system";
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
const getFieldIcon = (type: FormField["type"]): string => {
	const icons: Record<FormField["type"], string> = {
		email: "ri-mail-line",
		text: "ri-text",
		textarea: "ri-file-text-line",
		select: "ri-arrow-down-s-line",
		checkbox: "ri-checkbox-line",
		radio: "ri-radio-button-line",
		phone: "ri-phone-line",
		url: "ri-link",
		date: "ri-calendar-line",
		number: "ri-hashtag",
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
				<i className="ri-draggable" aria-hidden="true" />
			</div>

			{/* Left side: Type icon and badge */}
			<div className={styles.typeInfo}>
				<i className={getFieldIcon(field.type)} aria-hidden="true" />
				<Badge
					variant="secondary"
					size="sm"
				>{field.type}</Badge>
			</div>

			{/* Center: Field label and details */}
			<div className={styles.content}>
				<span className={styles.label}>
					{field.label}
					{field.required && <span className={styles.required}>*</span>}
				</span>
				{field.placeholder && (
					<span className={styles.placeholder}>{field.placeholder}</span>
				)}
				{/* Show options count for select/radio/checkbox fields */}
				{["select", "radio", "checkbox"].includes(field.type) && (
					<span className={styles.optionsCount}>
						{field.options?.length || 0} option
						{(field.options?.length || 0) !== 1 ? "s" : ""}
					</span>
				)}
			</div>

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
			<div className={styles.actions}>
				{/* Column toggle button (only in two-column mode) */}
				{showColumnToggle && (
					<Button
						leftIcon={
							currentColumn === 1 ? "ri-arrow-right-line" : "ri-arrow-left-line"
						}
						variant="secondary"
						aria-label={`Move to ${currentColumn === 1 ? "right" : "left"} column`}
						onClick={handleColumnToggleClick}
						title={`Move to ${currentColumn === 1 ? "right" : "left"} column`}
					/>
				)}
				{/* Delete button - always visible, but not for email field */}
				{field.type !== "email" && (
					<Button
						leftIcon="ri-delete-bin-line"
						variant="secondary"
						aria-label="Delete field"
						onClick={handleDeleteClick}
					/>
				)}
			</div>
		</div>
	);
});

FieldItem.displayName = "FieldItem";
