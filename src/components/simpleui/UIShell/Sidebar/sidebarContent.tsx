import React from "react";
import {SidebarGroup} from "@/components/simpleui/UIShell/Sidebar/sidebarGroup";
import './sidebar-content.scss';

export const SidebarContent: React.FC = () => {
    return (
        <div className="sidebar__content">
            <SidebarGroup label="Main">
                <SidebarGroup.Item label="Dashboard" href="#dashboard" iconClass="dashboard-line" />
                <SidebarGroup.Item label="Reports" href="#reports" iconClass="file-chart-line" />
            </SidebarGroup>
            <SidebarGroup label="Settings">
                <SidebarGroup.Item label="Profile" href="#profile" iconClass="user-line" />
                <SidebarGroup.Item label="Security" href="#security" iconClass="shield-user-line" />
            </SidebarGroup>
        </div>
    );
};
