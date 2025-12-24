/**
 * TableHeader Component
 * Wrapper for table header rows
 */

import { type HTMLAttributes, memo, useMemo } from "react";
import styles from "./table.module.scss";

export interface TableHeaderProps
	extends HTMLAttributes<HTMLTableSectionElement> {
	/** Additional CSS class name */
	className?: string;
}

/**
 * TableHeader wraps the header row(s) of a table
 */
export const TableHeader = memo<TableHeaderProps>(function TableHeader({
	className: customClassName,
	children,
	...props
}) {
	const classNames = useMemo(
		() => [styles.header, customClassName].filter(Boolean).join(" "),
		[customClassName],
	);

	return (
		<thead className={classNames} {...props}>
			{children}
		</thead>
	);
});

TableHeader.displayName = "TableHeader";
