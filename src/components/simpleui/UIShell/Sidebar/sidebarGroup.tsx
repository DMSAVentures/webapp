import React from "react";
import styles from "./sidebar-group.module.scss";
import { SidebarItem } from "./sidebarItem";

interface SidebarGroupProps {
	children:
		| React.ReactElement<typeof SidebarItem>[]
		| React.ReactElement<typeof SidebarItem>;
	label: string;
}
export const SidebarGroup: React.FC<SidebarGroupProps> = ({
	label,
	children,
}) => {
	return (
		<div className={styles["sidebar__group"]}>
			<small className={styles["sidebar__group-label"]}>{label}</small>
			<ul className={styles["sidebar__group-items"]}>{children}</ul>
		</div>
	);
};
