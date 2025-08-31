import React from 'react';
import {SidebarItem} from './sidebarItem';
import styles from './sidebar-group.module.scss';

interface SidebarGroupProps {
    children: React.ReactElement<typeof SidebarItem>[] | React.ReactElement<typeof SidebarItem>;
    label: string;
}
export const SidebarGroup: React.FC<SidebarGroupProps> = ({ label, children }) => {
    return (
        <div className={styles['sidebar__group']}>
            <small className={styles['sidebar__group-label']}>{label}</small>
            <ul className={styles['sidebar__group-items']}>
                {children}
            </ul>
        </div>
    );
};
