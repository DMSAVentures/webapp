import React from "react";
import { TabMenuVerticalItemProps } from "@/proto-design-system/TabMenu/Vertical/tabMenuVerticalItem.tsx";
import styles from "./tab-menu-vertical.module.scss";

interface TabMenuVerticalProps {
	items: React.ReactElement<TabMenuVerticalItemProps>[];
	title: string;
	variant: "card" | "default";
	showFooter?: boolean;
}
export const TabMenuVertical: React.FC<TabMenuVerticalProps> = (props) => {
	return (
		<div
			className={`${styles["tab-menu-vertical-sidebar"]} ${styles[`tab-menu-vertical-sidebar--${props.variant}`]}`}
		>
			<small className={styles["tab-menu-vertical-sidebar__title"]}>
				{props.title}
			</small>
			<ul className={styles["tab-menu-vertical-sidebar__container"]}>
				{props.items.map((item) => {
					return item;
				})}
			</ul>
			{props.showFooter ? (
				<span className={styles["tab-menu-vertical-sidebar__footer"]}>
					&copy; {new Date().getFullYear()} Shubhanshu
				</span>
			) : null}
		</div>
	);
};
