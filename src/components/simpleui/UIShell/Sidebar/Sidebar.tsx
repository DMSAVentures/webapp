import React from 'react'
import "./sidebar.scss"
import {useSidebar} from "@/contexts/sidebar";
import HeaderLogo from "@/components/simpleui/UIShell/Header/HeaderLogo";
import {SidebarGroup} from "@/components/simpleui/UIShell/Sidebar/sidebarGroup";
import {SidebarItem} from "@/components/simpleui/UIShell/Sidebar/sidebarItem";
import {SidebarFooter} from "@/components/simpleui/UIShell/Sidebar/SidebarFooter";
import UserName from "@/components/user/Username";
import {SidebarContent} from "@/components/simpleui/UIShell/Sidebar/sidebarContent";


export interface SidebarProps {
    children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = () => {
    const { isOpen, isMobile } = useSidebar();

    const sidebarClassName = `sidebar ${!isOpen ? "sidebar--collapsed" : ''} ${isMobile && isOpen ? "sidebar--open" : ''}`;

    return (
            <aside className={sidebarClassName}>
                <SidebarContent>
                    <HeaderLogo logo={"DMSA Ventures"} />
                    <SidebarGroup label="Main">
                        <SidebarItem label="ImageGen" href="/image-generation" iconClass="image-ai-line"/>
                        <SidebarItem label="Chat" href="/conversation" iconClass="chat-ai-line"/>
                    </SidebarGroup>
                    <SidebarFooter>
                        <UserName/>
                        <SidebarGroup label="Settings">
                            <SidebarItem label="Account" href="/account" iconClass="user-line"/>
                        </SidebarGroup>
                    </SidebarFooter>
                </SidebarContent>
            </aside>
    )
}
