import React from 'react';
import {SidebarGroup} from "@/components/simpleui/UIShell/Sidebar/sidebarGroup";
import './sidebar-content.scss';

interface SidebarFooterProps {
    children: React.ReactElement<typeof SidebarGroup>[] | React.ReactElement<typeof SidebarGroup>;
}
export const SidebarFooter: React.FC<SidebarFooterProps> = (props: SidebarFooterProps) => {
    return (
        <div className="sidebar__footer">
            {props.children}
        </div>
    );
};
