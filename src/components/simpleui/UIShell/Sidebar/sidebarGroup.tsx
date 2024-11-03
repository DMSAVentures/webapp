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
            <h6 className="sidebar__group-label">{label}</h6>
            <ul className="sidebar__group-items">
                {children}
            </ul>
        </div>
    );
};

SidebarGroup.Item = SidebarItem;
