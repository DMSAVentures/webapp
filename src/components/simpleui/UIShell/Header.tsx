import React from 'react';
import HeaderLogo from './HeaderLogo';
import HeaderNav, { NavItem } from './HeaderNav';
import HeaderActions, { ActionItem } from './HeaderActions';
import './Header.scss';
import {IconOnlyButton} from "@/components/simpleui/Button/IconOnlyButton";

interface HeaderProps {
    logo: string;
    navItems: NavItem[];
    actionItems: ActionItem[];
    toggleLeftNav?: () => void;
    isLeftNavOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ logo, navItems, actionItems, toggleLeftNav, isLeftNavOpen }) => {
    return (
        <header className="header">
            {toggleLeftNav && (
                <IconOnlyButton id={'nav-burger'} variant={'secondary'} iconClass={isLeftNavOpen ? 'arrow-left-s-line' : 'menu-line'} onClick={toggleLeftNav} />)
            }
            <HeaderLogo logo={logo} />
            <HeaderNav items={navItems} />
            <HeaderActions items={actionItems} />
        </header>
    );
};

export default Header;
