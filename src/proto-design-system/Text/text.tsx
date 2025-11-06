import React, { HTMLAttributes, memo } from "react";
import styles from "./text.module.scss";

export interface TextProps extends HTMLAttributes<HTMLElement> {
	/** Visual variant of the text */
	variant?: "label" | "sublabel" | "description" | "caption";
	/** Whether the text is disabled */
	disabled?: boolean;
	/** HTML element to render as */
	as?: "span" | "p" | "small" | "div" | "label";
	/** Additional CSS class name */
	className?: string;
	/** Text content */
	children: React.ReactNode;
}

export const Text = memo(function Text({
	variant = "label",
	disabled = false,
	as: Component = "span",
	className: customClassName,
	children,
	...props
}: TextProps) {
	const classNames = [
		styles.text,
		styles[`text--${variant}`],
		disabled && styles["text--disabled"],
		customClassName,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Component className={classNames} aria-disabled={disabled} {...props}>
			{children}
		</Component>
	);
});

Text.displayName = "Text";
