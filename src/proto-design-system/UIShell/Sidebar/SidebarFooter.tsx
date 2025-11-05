import React from "react";
import { SidebarGroup } from "@/proto-design-system/UIShell/Sidebar/sidebarGroup.tsx";
import styles from "./sidebar-content.module.scss";

interface SidebarFooterProps {
	children:
		| React.ReactElement<typeof SidebarGroup>[]
		| React.ReactElement<typeof SidebarGroup>;
}
export const SidebarFooter: React.FC<SidebarFooterProps> = (
	props: SidebarFooterProps,
) => {
	return <div className={styles["sidebar__footer"]}>{props.children}</div>;
};
