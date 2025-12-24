/**
 * TableExpandedRow Component
 * A row for displaying expanded content below a data row
 */

import { type HTMLAttributes, memo, useMemo } from "react";
import styles from "./table.module.scss";

export interface TableExpandedRowProps extends HTMLAttributes<HTMLTableRowElement> {
	/** Number of columns to span */
	colSpan: number;
	/** Additional CSS class name */
	className?: string;
}

/**
 * TableExpandedRow displays expanded content spanning all columns
 */
export const TableExpandedRow = memo<TableExpandedRowProps>(function TableExpandedRow({
	colSpan,
	className: customClassName,
	children,
	...props
}) {
	const rowClassNames = useMemo(
		() => [styles.expandedRow, customClassName].filter(Boolean).join(" "),
		[customClassName]
	);

	return (
		<tr className={rowClassNames} {...props}>
			<td colSpan={colSpan} className={styles.expandedCell}>
				<div className={styles.expandedContent}>{children}</div>
			</td>
		</tr>
	);
});

TableExpandedRow.displayName = "TableExpandedRow";
