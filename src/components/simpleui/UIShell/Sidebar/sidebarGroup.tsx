import React from 'react';
import {SidebarItem} from './sidebarItem';
import './sidebar-group.scss';

interface SidebarGroupProps {
    label: string;
    children: React.ReactNode;
}

export const SidebarGroup: React.FC<SidebarGroupProps> & { Item: typeof SidebarItem } = ({ label, children }) => {
    return (
        <div className="sidebar__group">
            <small className="sidebar__group-label">{label}</small>
            <ul className="sidebar__group-items">
                {children}
            </ul>
        </div>
    );
};

SidebarGroup.Item = SidebarItem;
