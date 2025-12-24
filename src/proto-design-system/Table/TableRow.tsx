/**
 * TableRow Component
 * A table row with optional selection and expansion states
 */

import { type HTMLAttributes, memo, useMemo } from "react";
import styles from "./table.module.scss";

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
	/** Whether the row is selected */
	selected?: boolean;
	/** Whether the row is expandable (shows expand indicator) */
	expandable?: boolean;
	/** Whether the row is currently expanded */
	expanded?: boolean;
	/** Additional CSS class name */
	className?: string;
}

/**
 * TableRow represents a row in the table with optional selection and expansion states
 */
export const TableRow = memo<TableRowProps>(function TableRow({
	selected = false,
	expandable = false,
	expanded = false,
	onClick,
	className: customClassName,
	children,
	...props
}) {
	const classNames = useMemo(
		() =>
			[
				styles.row,
				(onClick || expandable) && styles.rowClickable,
				selected && styles.rowSelected,
				expanded && styles.rowExpanded,
				customClassName,
			]
				.filter(Boolean)
				.join(" "),
		[onClick, expandable, selected, expanded, customClassName]
	);

	return (
		<tr className={classNames} onClick={onClick} {...props}>
			{children}
		</tr>
	);
});

TableRow.displayName = "TableRow";
