/**
 * FieldItem Component
 * Displays a single form field in the canvas
 */

import { type DragEvent, type HTMLAttributes, memo } from 'react';
import { IconOnlyButton } from '@/proto-design-system/Button/IconOnlyButton';
import { Badge } from '@/proto-design-system/badge/badge';
import type { FormField } from '@/types/common.types';
import styles from './component.module.scss';

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
	/** Additional CSS class name */
	className?: string;
}

/**
 * Get field type icon
 */
const getFieldIcon = (type: FormField['type']): string => {
	const icons: Record<FormField['type'], string> = {
		email: 'ri-mail-line',
		text: 'ri-text',
		textarea: 'ri-file-text-line',
		select: 'ri-arrow-down-s-line',
		checkbox: 'ri-checkbox-line',
		radio: 'ri-radio-button-line',
		phone: 'ri-phone-line',
		url: 'ri-link',
		date: 'ri-calendar-line',
		number: 'ri-hashtag',
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
	className: customClassName,
	...props
}) {
	const classNames = [
		styles.root,
		isSelected && styles.selected,
		customClassName,
	]
		.filter(Boolean)
		.join(' ');

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete();
	};

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

			<div className={styles.content}>
				<div className={styles.header}>
					<i className={getFieldIcon(field.type)} aria-hidden="true" />
					<span className={styles.label}>
						{field.label}
						{field.required && <span className={styles.required}>*</span>}
					</span>
					<Badge
						text={field.type}
						variant="gray"
						styleType="light"
						size="small"
					/>
				</div>
				{field.placeholder && (
					<span className={styles.placeholder}>{field.placeholder}</span>
				)}
			</div>

			<div className={styles.actions}>
				<IconOnlyButton
					iconClass="delete-bin-line"
					variant="secondary"
					ariaLabel="Delete field"
					onClick={handleDeleteClick}
				/>
			</div>
		</div>
	);
});

FieldItem.displayName = 'FieldItem';
