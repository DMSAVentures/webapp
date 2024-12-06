'use client'
import Header from "@/components/simpleui/UIShell/Header/Header";
import React, {ReactElement, ReactNode} from "react";
import {SidebarContent} from "@/components/simpleui/UIShell/Sidebar/sidebarContent";
import './shell.scss';
import {SidebarGroup} from "@/components/simpleui/UIShell/Sidebar/sidebarGroup";
import {SidebarItem} from "@/components/simpleui/UIShell/Sidebar/sidebarItem";

interface UIShellWithCollapsibleNavigationProps {
    children: [ReactElement<typeof SidebarContent>, ...ReactNode[]];
    logo: string;
}

export const UIShellWithCollapsibleNavigation: React.FC<UIShellWithCollapsibleNavigationProps> = (props: UIShellWithCollapsibleNavigationProps) => {
    const [isLeftNavOpen, setIsLeftNavOpen] = React.useState(false);
    const toggleLeftNav = () => {
        setIsLeftNavOpen((prevState) => !prevState);
    };
    return (
        <div className="shell">
            <Header logo={props.logo} isLeftNavOpen={isLeftNavOpen} toggleLeftNav={toggleLeftNav}>
                <SidebarContent>
                    <SidebarGroup label="Main">
                        <SidebarItem label="Dashboard" href="#dashboard" iconClass="dashboard-line" />
                        <SidebarItem label="Reports" href="#reports" iconClass="file-chart-line" />
                    </SidebarGroup>
                    <SidebarGroup label="Settings">
                        <SidebarItem label="Profile" href="#profile" iconClass="user-line" />
                        <SidebarItem label="Security" href="#security" iconClass="shield-user-line" />
                    </SidebarGroup>
                </SidebarContent>
            </Header>

            <div className={'shell-container'}>
                <div className="grid-wide">
                    {/*<Column sm={{span: 2, start: 7}}>*/}
                    {/*        Titles*/}
                    {/*</Column>*/}
                    {/*<Column sm={{span: 1, start: 4}}>*/}
                    {/*    Content*/}
                    {/*</Column>*/}
                    {props.children.slice(1)}
                </div>
            </div>
        </div>
    );
}
