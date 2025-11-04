import React from "react";
import styles from "./tab-menu-horizontal-item.module.scss";
import "remixicon/fonts/remixicon.css";

/**
 * 📌 State="Default";
 *     🟢 Active="Off";
 *     ⬅️ Left Icon=true;
 *     ⬅️ Pick Left="layout-grid-line";
 *     ➡️ Right Icon=true;
 *     ➡️ Pick Right="arrow-right-s-line";
 *     ⏺️ Number=false;
 *     ✏️ Edit Text="Overview";
 * **/
export interface TabMenuHorizontalItemProps {
	active: boolean;
	leftIcon?: string;
	rightIcon?: string;
	number?: boolean;
	text: string;
	onClick?: () => void;
}
export const TabMenuHorizontalItem: React.FC<TabMenuHorizontalItemProps> = (
	props: TabMenuHorizontalItemProps,
) => {
	return (
		<div
			className={`${styles["tab-menu-horizontal-item"]} ${props.active ? styles["tab-menu-horizontal-item--active"] : ""}`}
		>
			{props.leftIcon && (
				<i
					className={`${styles["tab-menu-horizontal-item__left-icon"]} ${props.leftIcon}`}
				/>
			)}
			<span className={styles["tab-menu-horizontal-item__text"]}>
				{props.text}
			</span>

			{Boolean(props.number) && !props.rightIcon && (
				<span className={styles["tab-menu-horizontal-item__badge"]}>
					{props.number}
				</span>
			)}
			{!props.number && props.rightIcon && (
				<i
					className={`${styles["tab-menu-horizontal-item__right-icon"]} ${props.rightIcon}`}
				/>
			)}
		</div>
	);
};
