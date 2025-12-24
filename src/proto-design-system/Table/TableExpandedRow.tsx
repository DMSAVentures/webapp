/**
 * TableExpandedRow Component
 * A row for displaying expanded content below a data row
 */

import { type HTMLAttributes, memo, useMemo } from "react";
import styles from "./table.module.scss";

export interface TableExpandedRowProps extends HTMLAttributes<HTMLTableRowElement> {
	/** Number of columns to span */
	colSpan: number;
	/** Whether the row is expanded */
	expanded?: boolean;
	/** Additional CSS class name */
	className?: string;
}

/**
 * TableExpandedRow displays expanded content spanning all columns
 */
export const TableExpandedRow = memo<TableExpandedRowProps>(function TableExpandedRow({
	colSpan,
	expanded = true,
	className: customClassName,
	children,
	...props
}) {
	const rowClassNames = useMemo(
		() => [styles.expandedRow, expanded && styles.expandedRowVisible, customClassName].filter(Boolean).join(" "),
		[expanded, customClassName]
	);

	return (
		<tr className={rowClassNames} {...props}>
			<td colSpan={colSpan} className={styles.expandedCell}>
				<div className={styles.expandedWrapper}>
					<div className={styles.expandedContent}>{children}</div>
				</div>
			</td>
		</tr>
	);
});

TableExpandedRow.displayName = "TableExpandedRow";
