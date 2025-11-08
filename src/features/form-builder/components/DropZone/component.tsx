/**
 * DropZone Component
 * Visual indicator for where a field can be dropped
 */

import { type DragEvent, type HTMLAttributes, memo } from 'react';
import styles from './component.module.scss';

export interface DropZoneProps extends HTMLAttributes<HTMLDivElement> {
	/** Index where field will be dropped */
	index: number;
	/** Whether this is the active drop target */
	isActive: boolean;
	/** Drag over handler */
	onDragOver: (e: DragEvent) => void;
	/** Drag leave handler */
	onDragLeave: (e: DragEvent) => void;
	/** Drop handler */
	onDrop: (e: DragEvent) => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * DropZone shows where a dragged field will be placed
 */
export const DropZone = memo<DropZoneProps>(function DropZone({
	index,
	isActive,
	onDragOver,
	onDragLeave,
	onDrop,
	className: customClassName,
	...props
}) {
	const classNames = [
		styles.root,
		isActive && styles.active,
		customClassName,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div
			className={classNames}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
			data-drop-index={index}
			{...props}
		/>
	);
});

DropZone.displayName = 'DropZone';
