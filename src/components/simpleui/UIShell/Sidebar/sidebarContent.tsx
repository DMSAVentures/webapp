import React from "react";
import {SidebarGroup} from "@/components/simpleui/UIShell/Sidebar/sidebarGroup";
import './sidebar-content.scss';

export const SidebarContent: React.FC = () => {
    return (
        <div className="sidebar__content">
            <SidebarGroup label="Main">
                <SidebarGroup.Item label="Dashboard" href="#dashboard" iconClass="ri-dashboard-line" />
                <SidebarGroup.Item label="Reports" href="#reports" iconClass="ri-file-chart-line" />
            </SidebarGroup>
            <SidebarGroup label="Settings">
                <SidebarGroup.Item label="Profile" href="#profile" iconClass="ri-user-line" />
                <SidebarGroup.Item label="Security" href="#security" iconClass="ri-shield-user-line" />
            </SidebarGroup>
        </div>
    );
};
