import { memo, type ReactNode } from 'react';
import { Button } from '@/proto-design-system/Button/button';
import styles from './EmptyState.module.scss';

export interface EmptyStateProps {
	/** Icon to display (RemixIcon name without 'ri-' prefix) */
	icon?: string;
	/** Title of the empty state */
	title: string;
	/** Description text */
	description?: string;
	/** Optional action button */
	action?: {
		label: string;
		onClick: () => void;
	};
	/** Additional CSS class name */
	className?: string;
	/** Custom children to render instead of default layout */
	children?: ReactNode;
}

export const EmptyState = memo(
	function EmptyState({
		icon,
		title,
		description,
		action,
		className: customClassName,
		children,
	}: EmptyStateProps) {
		const classNames = [
			styles.root,
			customClassName
		].filter(Boolean).join(' ');

		if (children) {
			return (
				<div className={classNames} role="status">
					{children}
				</div>
			);
		}

		return (
			<div className={classNames} role="status">
				{icon && (
					<div className={styles['icon-container']}>
						<i className={`${styles.icon} ri-${icon}`} aria-hidden="true" />
					</div>
				)}
				<h3 className={styles.title}>{title}</h3>
				{description && (
					<p className={styles.description}>{description}</p>
				)}
				{action && (
					<div className={styles.action}>
						<Button
							variant="primary"
							size="medium"
							onClick={action.onClick}
						>
							{action.label}
						</Button>
					</div>
				)}
			</div>
		);
	}
);

EmptyState.displayName = 'EmptyState';
