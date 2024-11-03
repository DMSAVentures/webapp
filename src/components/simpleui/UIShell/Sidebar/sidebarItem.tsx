import React from 'react';
import 'remixicon/fonts/remixicon.css';
import Link from "next/link";
import "./sidebar-item.scss";

interface SidebarItemProps {
    label: string;
    href: string;
    iconClass?: string;
    isActive?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ label, href, iconClass, isActive }) => {
    return (
        <Link className={'sidebar__item__link'} href={href}>
        <li className={`sidebar__item ${isActive ? 'active' : ''}`}>
            {iconClass && <i className={`${iconClass}`}></i>}
            {label}
        </li>
        </Link>
    )
}
