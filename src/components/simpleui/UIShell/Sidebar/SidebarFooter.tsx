import React from 'react';
import {SidebarItem} from "@/components/simpleui/UIShell/Sidebar/sidebarItem";
import {SidebarGroup} from "@/components/simpleui/UIShell/Sidebar/sidebarGroup";

export const SidebarFooter: React.FC = () => {
    return (
        <div className="sidebar__footer">
            <SidebarGroup label={''}>
                <SidebarItem iconClass="settings-3-line" href={"#"} label={'Settings'}/>
                <SidebarItem iconClass="settings-3-line" href={"#"} label={'Support'}/>
            </SidebarGroup>

        </div>
    );
};
