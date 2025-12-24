/**
 * Table Component
 * A compound component for building flexible data tables
 */

import { type CSSProperties, type HTMLAttributes, memo, useMemo } from "react";
import styles from "./table.module.scss";

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
	/** Whether the table is in a loading state */
	loading?: boolean;
	/** Message to display while loading */
	loadingMessage?: string;
	/** Minimum width for responsive horizontal scroll */
	minWidth?: string;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Table wrapper component that provides styling and loading state
 */
export const Table = memo<TableProps>(function Table({
	loading = false,
	loadingMessage = "Loading...",
	minWidth = "800px",
	className: customClassName,
	children,
	...props
}) {
	const classNames = useMemo(
		() =>
			[styles.wrapper, loading && styles.wrapperLoading, customClassName]
				.filter(Boolean)
				.join(" "),
		[customClassName, loading],
	);

	const tableStyle: CSSProperties = useMemo(() => ({ minWidth }), [minWidth]);

	return (
		<div className={classNames} {...props}>
			{/* Loading overlay */}
			<div
				className={`${styles.loadingOverlay} ${loading ? styles.loadingOverlayVisible : ""}`}
			>
				<div className={styles.loadingSpinner} />
				<p className={styles.loadingMessage}>{loadingMessage}</p>
			</div>

			{/* Table content - always rendered to maintain structure */}
			<table className={styles.table} style={tableStyle}>
				{children}
			</table>
		</div>
	);
});

Table.displayName = "Table";
