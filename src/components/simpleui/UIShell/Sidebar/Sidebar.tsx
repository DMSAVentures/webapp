import React from "react";
import HeaderLogo from "@/components/simpleui/UIShell/Header/HeaderLogo";
import { SidebarFooter } from "@/components/simpleui/UIShell/Sidebar/SidebarFooter";
import { SidebarContent } from "@/components/simpleui/UIShell/Sidebar/sidebarContent";
import { SidebarGroup } from "@/components/simpleui/UIShell/Sidebar/sidebarGroup";
import { SidebarItem } from "@/components/simpleui/UIShell/Sidebar/sidebarItem";
import UserName from "@/components/user/Username";
import { useSidebar } from "@/contexts/sidebar";
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
