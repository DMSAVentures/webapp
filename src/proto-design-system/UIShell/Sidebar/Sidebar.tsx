import React from "react";
import UserName from "@/components/user/Username.tsx";
import { useSidebar } from "@/contexts/sidebar.tsx";
import { usePersona } from "@/contexts/persona.tsx";
import HeaderLogo from "@/proto-design-system/UIShell/Header/HeaderLogo.tsx";
import { SidebarFooter } from "@/proto-design-system/UIShell/Sidebar/SidebarFooter.tsx";
import { SidebarContent } from "@/proto-design-system/UIShell/Sidebar/sidebarContent.tsx";
import { SidebarGroup } from "@/proto-design-system/UIShell/Sidebar/sidebarGroup.tsx";
import { SidebarItem } from "@/proto-design-system/UIShell/Sidebar/sidebarItem.tsx";
import styles from "./sidebar.module.scss";

export interface SidebarProps {
	children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = () => {
	const { isOpen, isMobile } = useSidebar();
	const { getNavigationGroups } = usePersona();

	const sidebarClassName = `${styles.sidebar} ${!isOpen ? styles["sidebar--collapsed"] : ""} ${isMobile && isOpen ? styles["sidebar--open"] : ""}`;

	// Get navigation groups based on user's persona
	const navigationGroups = getNavigationGroups();

	return (
		<aside className={sidebarClassName}>
			<SidebarContent>
				<HeaderLogo logo={"DMSA Ventures"} />

				{/* Render persona-based navigation groups */}
				{navigationGroups.map((group) => (
					<SidebarGroup key={group.label} label={group.label}>
						{group.items.map((item) => (
							<SidebarItem
								key={item.href}
								label={item.label}
								href={item.href}
								iconClass={item.iconClass}
							/>
						))}
					</SidebarGroup>
				))}

				<SidebarFooter>
					<UserName />
					<SidebarGroup label="Settings">
						<SidebarItem
							label="Account"
							href="/account"
							iconClass="user-line"
						/>
					</SidebarGroup>
				</SidebarFooter>
			</SidebarContent>
		</aside>
	);
};
