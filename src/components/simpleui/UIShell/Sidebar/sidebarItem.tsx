import React from 'react';
import 'remixicon/fonts/remixicon.css';
import "./sidebar-item.scss";

interface SidebarItemProps {
    label: string;
    href: string;
    iconClass?: string;
    isActive?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ label, href, iconClass, isActive }) => {
    return (
        <a className={'sidebar__item__link'} href={href} style={{textDecoration: 'none'}}>
        <li className={`sidebar__item ${isActive ? 'active' : ''}`}>
            {iconClass && <i className={`ri-${iconClass}`}></i>}
            {label}
        </li>
        </a>
    )
}
