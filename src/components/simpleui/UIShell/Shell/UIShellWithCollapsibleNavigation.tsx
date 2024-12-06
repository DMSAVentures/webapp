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
                {props.children[0]}
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
