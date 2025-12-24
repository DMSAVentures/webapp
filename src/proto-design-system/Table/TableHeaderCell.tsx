/**
 * TableHeaderCell Component
 * A table header cell with optional sorting functionality
 */

import { type HTMLAttributes, memo, useMemo } from "react";
import styles from "./table.module.scss";

export type SortDirection = "asc" | "desc" | null;

export interface TableHeaderCellProps extends HTMLAttributes<HTMLTableCellElement> {
	/** Whether the column is sortable */
	sortable?: boolean;
	/** Current sort direction (null means not sorted) */
	sortDirection?: SortDirection;
	/** Callback when sort is triggered */
	onSort?: () => void;
	/** Whether the column should use narrow width (for checkboxes, icons) */
	narrow?: boolean;
	/** Additional CSS class name */
	className?: string;
}

/**
 * TableHeaderCell represents a header cell with optional sorting
 */
export const TableHeaderCell = memo<TableHeaderCellProps>(function TableHeaderCell({
	sortable = false,
	sortDirection = null,
	onSort,
	narrow = false,
	className: customClassName,
	children,
	...props
}) {
	const classNames = useMemo(
		() =>
			[
				styles.headerCell,
				sortable && styles.headerCellSortable,
				narrow && styles.headerCellNarrow,
				customClassName,
			]
				.filter(Boolean)
				.join(" "),
		[sortable, narrow, customClassName]
	);

	if (sortable) {
		return (
			<th className={classNames} {...props}>
				<button
					type="button"
					className={styles.sortButton}
					onClick={onSort}
					aria-label={`Sort by ${children}`}
				>
					{children}
					{sortDirection && (
						<i
							className={`${styles.sortIcon} ri-arrow-${sortDirection === "asc" ? "up" : "down"}-s-line`}
							aria-hidden="true"
						/>
					)}
				</button>
			</th>
		);
	}

	return (
		<th className={classNames} {...props}>
			{children}
		</th>
	);
});

TableHeaderCell.displayName = "TableHeaderCell";
