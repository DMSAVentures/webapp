import React, { KeyboardEvent } from "react";
import styles from "./buttongroup.module.scss";
import "remixicon/fonts/remixicon.css";

export interface ButtonItemProps {
	text: string;
	iconPosition: "left" | "right";
	icon: string;
	iconOnly: boolean;
	onClick: () => void;
	disabled?: boolean;
	/**
	 * Accessible label for the button, especially important for icon-only buttons
	 */
	ariaLabel?: string;
}

//TODO: Implement Dropdown button item
interface ButtonGroupProps {
	items: ButtonItemProps[];
	size: "small" | "x-small" | "2x-small";
	noBorder?: boolean;
	/**
	 * Accessible label for the button group
	 */
	ariaLabel?: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = (props) => {
	const { items, size, noBorder, ariaLabel } = props;

	// Handle keyboard events for accessibility
	const handleKeyDown = (
		event: KeyboardEvent<HTMLButtonElement>,
		onClick?: () => void,
	) => {
		if (!onClick) return;

		// Trigger click on Enter or Space key press
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault(); // Prevent page scroll on space
			onClick();
		}
	};

	// Generate CSS class names using CSS Modules
	const buttonGroupClass = `${styles["button-group"]} ${styles[`button-group--${size}`]} ${noBorder ? styles["button-group--no-border"] : ""}`;

	return (
		<div
			className={buttonGroupClass}
			role="toolbar"
			aria-label={ariaLabel || "Button group"}
		>
			{items.map((item, index) => {
				const buttonLabel =
					item.ariaLabel || item.text || `Button ${index + 1}`;

				// Generate button class names using CSS Modules
				const buttonClass = [
					styles["button-item"],
					styles[`button-item--${size}`],
					styles[`button-item--${item.iconOnly ? "icon-only" : "icon-text"}`],
					styles[`button-item__icon--${item.iconPosition}`],
				].join(" ");

				return (
					<button
						className={buttonClass}
						key={index}
						onClick={item.onClick}
						onKeyDown={(e) => handleKeyDown(e, item.onClick)}
						disabled={item.disabled}
						aria-disabled={item.disabled}
						aria-label={buttonLabel}
						type="button"
						tabIndex={item.disabled ? -1 : 0}
					>
						<i
							className={`${styles["button__icon"]} ${item.icon}`}
							aria-hidden="true"
						/>
						{!item.iconOnly && (
							<span className={styles["button__text"]}>{item.text}</span>
						)}
					</button>
				);
			})}
		</div>
	);
};

export default ButtonGroup;
