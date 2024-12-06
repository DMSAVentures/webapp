import React from "react";
import {SidebarGroup} from "@/components/simpleui/UIShell/Sidebar/sidebarGroup";
import './sidebar-content.scss';
interface SidebarContentProps {
    children: React.ReactElement<typeof SidebarGroup>[] | React.ReactElement<typeof SidebarGroup>;
}
export const SidebarContent: React.FC<SidebarContentProps> = (props: SidebarContentProps) => {
    return (
        <div className="sidebar__content">
            {props.children}
        </div>
    );
};
