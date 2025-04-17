import React from 'react';
import 'remixicon/fonts/remixicon.css';
import "./sidebar-item.scss";
import {Link} from "@tanstack/react-router";
import {useSidebar} from "@/contexts/sidebar.tsx";

interface SidebarItemProps {
    label: string;
    href: string;
    iconClass?: string;
    isActive?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ label, href, iconClass, isActive }) => {
    const {isOpen, isMobile, toggleSidebar} = useSidebar();
    const handleClick = () => {
        if (isMobile && isOpen) {
            toggleSidebar();
        }
    }
    return (
        <Link to={href} className={'sidebar__item__link'} href={href} style={{textDecoration: 'none'}} onClick={handleClick}>
        <li className={`sidebar__item ${isActive ? 'active' : ''}`}>
            {iconClass && <i className={`ri-${iconClass}`}></i>}
            {label}
        </li>
        </Link>
    )
}
