import React from "react";
import "remixicon/fonts/remixicon.css";
import { Link } from "@tanstack/react-router";
import { useSidebar } from "@/contexts/sidebar.tsx";
import { Badge } from "@/proto-design-system/badge/badge";
import styles from "./sidebar-item.module.scss";

interface SidebarItemProps {
	label: string;
	href: string;
	iconClass?: string;
	isActive?: boolean;
	/** Whether the item is disabled */
	disabled?: boolean;
	/** Optional badge text (e.g., "Pro") */
	badge?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
	label,
	href,
	iconClass,
	isActive,
	disabled = false,
	badge,
}) => {
	const { isOpen, isMobile, toggleSidebar } = useSidebar();
	const handleClick = (e: React.MouseEvent) => {
		if (disabled) {
			e.preventDefault();
			return;
		}
		if (isMobile && isOpen) {
			toggleSidebar();
		}
	};

	const itemClassName = [
		styles["sidebar__item"],
		isActive && styles.active,
		disabled && styles.disabled,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Link
			to={disabled ? "#" : href}
			className={styles["sidebar__item__link"]}
			href={disabled ? "#" : href}
			style={{ textDecoration: "none" }}
			onClick={handleClick}
			aria-disabled={disabled}
		>
			<li className={itemClassName}>
				{iconClass && <i className={`ri-${iconClass}`} aria-hidden="true" />}
				<span className={styles["sidebar__item__label"]}>{label}</span>
				{badge && (
					<Badge text={badge} variant="blue" styleType="filled" size="small" />
				)}
			</li>
		</Link>
	);
};
