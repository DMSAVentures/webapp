import React from "react";
import HeaderLogo from "@/proto-design-system/UIShell/Header/HeaderLogo.tsx";
import { SidebarFooter } from "@/proto-design-system/UIShell/Sidebar/SidebarFooter.tsx";
import { SidebarContent } from "@/proto-design-system/UIShell/Sidebar/sidebarContent.tsx";
import { SidebarGroup } from "@/proto-design-system/UIShell/Sidebar/sidebarGroup.tsx";
import { SidebarItem } from "@/proto-design-system/UIShell/Sidebar/sidebarItem.tsx";
import UserName from "@/components/user/Username.tsx";
import { useSidebar } from "@/contexts/sidebar.tsx";
import styles from "./sidebar.module.scss";

export interface SidebarProps {
	children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = () => {
	const { isOpen, isMobile } = useSidebar();

	const sidebarClassName = `${styles.sidebar} ${!isOpen ? styles["sidebar--collapsed"] : ""} ${isMobile && isOpen ? styles["sidebar--open"] : ""}`;

	return (
		<aside className={sidebarClassName}>
			<SidebarContent>
				<HeaderLogo logo={"DMSA Ventures"} />
				<SidebarGroup label="Main">
					<SidebarItem
						label="ImageGen"
						href="/image-generation"
						iconClass="image-ai-line"
					/>
					<SidebarItem
						label="Chat"
						href="/conversation"
						iconClass="chat-ai-line"
					/>
				</SidebarGroup>
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
