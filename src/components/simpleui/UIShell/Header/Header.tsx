import React from 'react';
import HeaderLogo from './HeaderLogo';
import HeaderNav, { NavItem } from './HeaderNav';
import HeaderActions, { ActionItem } from './HeaderActions';
import './Header.scss';
import {IconOnlyButton} from "@/components/simpleui/Button/IconOnlyButton";
import {SidebarCollapsible} from "@/components/simpleui/UIShell/Sidebar/SidebarCollapsible";
import {SidebarContent} from "@/components/simpleui/UIShell/Sidebar/sidebarContent";
import {SidebarFooter} from "@/components/simpleui/UIShell/Sidebar/SidebarFooter";

interface HeaderProps {
    logo: string;
    navItems?: NavItem[];
    actionItems?: ActionItem[];
    toggleLeftNav?: () => void;
    isLeftNavOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ logo, navItems, actionItems, toggleLeftNav, isLeftNavOpen }) => {
    return (
        <div className={'header-container'}>
        <header className="header">
            {toggleLeftNav && (
                <IconOnlyButton id={'nav-burger'} variant={'secondary'} iconClass={isLeftNavOpen ? 'arrow-left-s-line' : 'menu-line'} onClick={toggleLeftNav} />)
            }
            <HeaderLogo logo={logo} />
            {navItems && <HeaderNav items={navItems} />}
            {actionItems && <HeaderActions items={actionItems} />}
        </header>
            <SidebarCollapsible isOpen={isLeftNavOpen!} onClose={toggleLeftNav!}>
                <SidebarContent/>
            </SidebarCollapsible>
        </div>
    );
};

export default Header;
