import "./layout.scss";
import React from "react";
import {Providers} from "@/contexts/providers";
import {UIShellWithCollapsibleNavigation} from "@/components/simpleui/UIShell/Shell/UIShellWithCollapsibleNavigation";
import {SidebarContent} from "@/components/simpleui/UIShell/Sidebar/sidebarContent";
import {SidebarGroup} from "@/components/simpleui/UIShell/Sidebar/sidebarGroup";
import {SidebarItem} from "@/components/simpleui/UIShell/Sidebar/sidebarItem";
import {SidebarFooter} from "@/components/simpleui/UIShell/Sidebar/SidebarFooter";

export default function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (<Providers>
            <UIShellWithCollapsibleNavigation logo={"DMSA"}>
                <SidebarContent>
                    <SidebarGroup label="Main">
                        <SidebarItem label="Dashboard" href="#dashboard" iconClass="dashboard-line"/>
                        <SidebarItem label="Reports" href="#reports" iconClass="file-chart-line"/>
                    </SidebarGroup>
                    <SidebarFooter>
                        <SidebarGroup label="Settings">
                            <SidebarItem label="Account" href="#profile" iconClass="user-line"/>
                        </SidebarGroup>
                    </SidebarFooter>
                </SidebarContent>
                {children}
            </UIShellWithCollapsibleNavigation>
        </Providers>);
}
