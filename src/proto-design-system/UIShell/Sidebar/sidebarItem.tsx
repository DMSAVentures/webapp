import React from "react";
import "remixicon/fonts/remixicon.css";
import { Link } from "@tanstack/react-router";
import { useSidebar } from "@/contexts/sidebar.tsx";
import styles from "./sidebar-item.module.scss";

interface SidebarItemProps {
	label: string;
	href: string;
	iconClass?: string;
	isActive?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
	label,
	href,
	iconClass,
	isActive,
}) => {
	const { isOpen, isMobile, toggleSidebar } = useSidebar();
	const handleClick = () => {
		if (isMobile && isOpen) {
			toggleSidebar();
		}
	};
	return (
		<Link
			to={href}
			className={styles["sidebar__item__link"]}
			href={href}
			style={{ textDecoration: "none" }}
			onClick={handleClick}
		>
			<li
				className={`${styles["sidebar__item"]} ${isActive ? styles.active : ""}`}
			>
				{iconClass && <i className={`ri-${iconClass}`}></i>}
				{label}
			</li>
		</Link>
	);
};
