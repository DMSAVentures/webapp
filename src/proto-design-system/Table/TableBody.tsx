/**
 * TableBody Component
 * Wrapper for table body rows
 */

import { type HTMLAttributes, memo, useMemo } from "react";
import styles from "./table.module.scss";

export interface TableBodyProps
	extends HTMLAttributes<HTMLTableSectionElement> {
	/** Additional CSS class name */
	className?: string;
}

/**
 * TableBody wraps the body rows of a table
 */
export const TableBody = memo<TableBodyProps>(function TableBody({
	className: customClassName,
	children,
	...props
}) {
	const classNames = useMemo(
		() => [styles.body, customClassName].filter(Boolean).join(" "),
		[customClassName],
	);

	return (
		<tbody className={classNames} {...props}>
			{children}
		</tbody>
	);
});

TableBody.displayName = "TableBody";
