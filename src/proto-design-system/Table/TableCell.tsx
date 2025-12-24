/**
 * TableCell Component
 * A table cell with optional fit-content width
 */

import { type HTMLAttributes, memo, useMemo } from "react";
import styles from "./table.module.scss";

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
	/** Whether the cell should fit its content (useful for badges, icons) */
	fitContent?: boolean;
	/** Whether the cell should use narrow width (for checkboxes, icons) */
	narrow?: boolean;
	/** Additional CSS class name */
	className?: string;
}

/**
 * TableCell represents a cell in the table body
 */
export const TableCell = memo<TableCellProps>(function TableCell({
	fitContent = false,
	narrow = false,
	className: customClassName,
	children,
	...props
}) {
	const classNames = useMemo(
		() =>
			[
				styles.cell,
				fitContent && styles.cellFitContent,
				narrow && styles.cellNarrow,
				customClassName,
			]
				.filter(Boolean)
				.join(" "),
		[fitContent, narrow, customClassName]
	);

	return (
		<td className={classNames} {...props}>
			{children}
		</td>
	);
});

TableCell.displayName = "TableCell";
