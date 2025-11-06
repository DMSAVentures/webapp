import React, { HTMLAttributes, memo } from "react";
import styles from "./description.module.scss";

export interface DescriptionProps extends HTMLAttributes<HTMLSpanElement> {
	/** Whether the description is disabled */
	disabled?: boolean;
	/** Additional CSS class name */
	className?: string;
	/** Description content */
	children: React.ReactNode;
}

export const Description = memo(function Description({
	disabled = false,
	className: customClassName,
	children,
	...props
}: DescriptionProps) {
	const classNames = [
		styles.description,
		disabled && styles["description--disabled"],
		customClassName,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<span className={classNames} aria-disabled={disabled} {...props}>
			{children}
		</span>
	);
});
