import React from "react";
import { SidebarFooter } from "@/proto-design-system/UIShell/Sidebar/SidebarFooter.tsx";
import { SidebarGroup } from "@/proto-design-system/UIShell/Sidebar/sidebarGroup.tsx";
import styles from "./sidebar-content.module.scss";

interface SidebarContentProps {
	children:
		| [
				...React.ReactElement<typeof SidebarGroup>[],
				React.ReactElement<typeof SidebarFooter>,
		  ]
		| React.ReactElement<typeof SidebarGroup>[];
}
export const SidebarContent: React.FC<SidebarContentProps> = (
	props: SidebarContentProps,
) => {
	return <div className={styles["sidebar__content"]}>{props.children}</div>;
};
