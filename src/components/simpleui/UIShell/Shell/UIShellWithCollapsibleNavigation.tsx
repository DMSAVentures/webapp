'use client'
import styles from './shell.module.scss';
import Header from "@/components/simpleui/UIShell/Header/Header";
import React, {ReactElement, ReactNode} from "react";
import {SidebarContent} from "@/components/simpleui/UIShell/Sidebar/sidebarContent";
import {SidebarCollapsible} from "@/components/simpleui/UIShell/Sidebar/SidebarCollapsible";

interface UIShellWithCollapsibleNavigationProps {
    children: [ReactElement<typeof SidebarContent>, ...ReactNode[]];
}

export const UIShellWithCollapsibleNavigation: React.FC<UIShellWithCollapsibleNavigationProps> = (props: UIShellWithCollapsibleNavigationProps) => {
    const [isLeftNavOpen, setIsLeftNavOpen] = React.useState(false);
    const toggleLeftNav = () => {
        setIsLeftNavOpen((prevState) => !prevState);
    };
    return (
        <div className={styles.shell}>
             <SidebarCollapsible isOpen={isLeftNavOpen}>
                {props.children[0]}
            </SidebarCollapsible>
            <div className={styles['shell-container']}>
                <Header isLeftNavOpen={isLeftNavOpen} toggleLeftNav={toggleLeftNav} />
                <div className={styles['grid-wide']}>
                {props.children.slice(1)}
                </div>
            </div>
        </div>
    );
}
