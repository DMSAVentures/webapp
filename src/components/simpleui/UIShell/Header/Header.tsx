import React from "react";
import { IconOnlyButton } from "@/components/simpleui/Button/IconOnlyButton";
import { SidebarContent } from "@/components/simpleui/UIShell/Sidebar/sidebarContent";
import styles from "./Header.module.scss";
import HeaderActions, { ActionItem } from "./HeaderActions";
import HeaderNav, { NavItem } from "./HeaderNav";

interface HeaderProps {
	navItems?: NavItem[];
	actionItems?: ActionItem[];
	toggleLeftNav?: () => void;
	isLeftNavOpen?: boolean;
	children?: React.ReactElement<typeof SidebarContent>;
}

const Header: React.FC<HeaderProps> = ({
	navItems,
	actionItems,
	toggleLeftNav,
	isLeftNavOpen,
}) => {
	return (
		<div className={styles["header-container"]}>
			<header className={styles.header}>
				<IconOnlyButton
					ariaLabel={"navbar-toggle"}
					id={"nav-burger"}
					variant={"secondary"}
					iconClass={isLeftNavOpen ? "arrow-right-s-line" : "menu-line"}
					onClick={toggleLeftNav}
				/>
				{navItems && <HeaderNav items={navItems} />}
				{actionItems && <HeaderActions items={actionItems} />}
			</header>
		</div>
	);
};

export default Header;
