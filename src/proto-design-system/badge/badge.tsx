import "remixicon/fonts/remixicon.css";
import React from "react";
import styles from "./badge.module.scss";

interface BadgeProps {
	text: string | number;
	variant:
		| "gray"
		| "blue"
		| "orange"
		| "red"
		| "green"
		| "purple"
		| "yellow"
		| "pink"
		| "sky"
		| "teal";
	styleType?: "filled" | "light" | "lighter" | "stroke";
	size?: "small" | "medium";
	iconClass?: string;
	iconPosition?: "left" | "right";
	disabled?: boolean;
}
export const Badge: React.FC<BadgeProps> = (props) => {
	const num = parseInt(props.text.toString());
	if (num) {
		if (props.disabled) {
			return (
				<div
					className={`${styles.badge} ${styles[`badge--${props.size}`]} ${styles["badge--disabled"]}`}
				>
					{num < 10 ? num : "9+"}
				</div>
			);
		}
		return (
			<div
				className={`${styles.badge} ${styles[`badge--${props.size}`]} ${styles[`badge--${props.variant}`]} ${styles[`badge--${props.styleType}`]}`}
			>
				{num < 10 ? num : "9+"}
			</div>
		);
	} else {
		if (props.disabled) {
			return (
				<div
					className={`${styles.badge} ${styles[`badge--${props.size}`]} ${styles["badge--disabled"]}`}
				>
					{props.iconClass && props.iconPosition === "left" && (
						<i className={`${styles["badge__icon"]} ri-${props.iconClass}`} />
					)}
					{props.text}
					{props.iconClass && props.iconPosition === "right" && (
						<i className={`${styles["badge__icon"]} ri-${props.iconClass}`} />
					)}
				</div>
			);
		} else {
			return (
				<div
					className={`${styles.badge} ${styles[`badge--${props.size}`]} ${styles[`badge--${props.variant}`]} ${styles[`badge--${props.styleType}`]}`}
				>
					{props.iconClass && props.iconPosition === "left" && (
						<i className={`${styles["badge__icon"]} ri-${props.iconClass}`} />
					)}
					<span>{props.text}</span>
					{props.iconClass && props.iconPosition === "right" && (
						<i className={`${styles["badge__icon"]} ri-${props.iconClass}`} />
					)}
				</div>
			);
		}
	}
};
