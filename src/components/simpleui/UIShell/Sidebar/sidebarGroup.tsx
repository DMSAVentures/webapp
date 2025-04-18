import React from 'react';
import {SidebarItem} from './sidebarItem';
import './sidebar-group.scss';

interface SidebarGroupProps {
    children: React.ReactElement<typeof SidebarItem>[] | React.ReactElement<typeof SidebarItem>;
    label: string;
}
export const SidebarGroup: React.FC<SidebarGroupProps> = ({ label, children }) => {
    return (
        <div className="sidebar__group">
            <small className="sidebar__group-label">{label}</small>
            <ul className="sidebar__group-items">
                {children}
            </ul>
        </div>
    );
};
