/**
 * VariableChip Component
 * Displays template variables as colored pill/chip elements
 */

import { type HTMLAttributes, memo } from "react";
import styles from "./component.module.scss";

export interface VariableChipProps extends HTMLAttributes<HTMLSpanElement> {
	/** Variable name (without braces) */
	name: string;
	/** Whether the chip is interactive (clickable) */
	interactive?: boolean;
	/** Size variant */
	size?: "small" | "medium";
	/** Click handler */
	onChipClick?: (name: string) => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * VariableChip displays a template variable as a visually distinct pill
 */
export const VariableChip = memo<VariableChipProps>(function VariableChip({
	name,
	interactive = false,
	size = "medium",
	onChipClick,
	className: customClassName,
	...props
}) {
	const classNames = [
		styles.root,
		interactive && styles.interactive,
		size !== "medium" && styles[`size_${size}`],
		customClassName,
	]
		.filter(Boolean)
		.join(" ");

	const handleClick = () => {
		if (interactive && onChipClick) {
			onChipClick(name);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (interactive && onChipClick && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault();
			onChipClick(name);
		}
	};

	return (
		<span
			className={classNames}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			role={interactive ? "button" : undefined}
			tabIndex={interactive ? 0 : undefined}
			{...props}
		>
			<i className="ri-braces-line" aria-hidden="true" />
			<span className={styles.name}>{name}</span>
		</span>
	);
});

VariableChip.displayName = "VariableChip";
