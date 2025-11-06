import React, { HTMLAttributes, memo } from "react";
import styles from "./sublabel.module.scss";

export interface SublabelProps extends HTMLAttributes<HTMLElement> {
	/** Whether the sublabel is disabled */
	disabled?: boolean;
	/** Additional CSS class name */
	className?: string;
	/** Sublabel content */
	children: React.ReactNode;
}

export const Sublabel = memo(function Sublabel({
	disabled = false,
	className: customClassName,
	children,
	...props
}: SublabelProps) {
	const classNames = [
		styles.sublabel,
		disabled && styles["sublabel--disabled"],
		customClassName,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<small className={classNames} aria-disabled={disabled} {...props}>
			{children}
		</small>
	);
});
