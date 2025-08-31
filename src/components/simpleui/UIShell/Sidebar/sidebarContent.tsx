import React from "react";
import {SidebarGroup} from "@/components/simpleui/UIShell/Sidebar/sidebarGroup";
import styles from './sidebar-content.module.scss';
import {SidebarFooter} from "@/components/simpleui/UIShell/Sidebar/SidebarFooter";
interface SidebarContentProps {
    children: [...React.ReactElement<typeof SidebarGroup>[], React.ReactElement<typeof SidebarFooter>] | React.ReactElement<typeof SidebarGroup>[];
}
export const SidebarContent: React.FC<SidebarContentProps> = (props: SidebarContentProps) => {
    return (
        <div className={styles['sidebar__content']}>
            {props.children}
        </div>
    );
};
