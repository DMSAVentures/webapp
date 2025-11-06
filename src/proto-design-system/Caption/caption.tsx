import React, { memo, HTMLAttributes } from 'react';
import styles from './caption.module.scss';

export interface CaptionProps extends HTMLAttributes<HTMLElement> {
	/** Whether the caption is disabled */
	disabled?: boolean;
	/** Additional CSS class name */
	className?: string;
	/** Caption content */
	children: React.ReactNode;
}

export const Caption = memo(function Caption({
	disabled = false,
	className: customClassName,
	children,
	...props
}: CaptionProps) {
	const classNames = [
		styles.caption,
		disabled && styles['caption--disabled'],
		customClassName,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<small className={classNames} aria-disabled={disabled} {...props}>
			{children}
		</small>
	);
});
