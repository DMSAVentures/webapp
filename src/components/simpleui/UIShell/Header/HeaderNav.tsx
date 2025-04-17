'use client'
import React, { useState } from 'react';

export interface NavItem {
    label: string;
    href: string;
    subItems?: { label: string; href: string }[];
}

interface HeaderNavProps {
    items: NavItem[];
}

const HeaderNav: React.FC<HeaderNavProps> = ({ items }) => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    const toggleDropdown = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <nav className="header__nav">
            {items.map((item, index) => (
                item.subItems ? (
                    <div
                        key={index}
                        className="header__dropdown"
                        onClick={() => toggleDropdown(index)}
                        onBlur={() => setActiveDropdown(null)}
                        tabIndex={0}
                    >
                        <small>{item.label}</small>
                        <i className="ri-arrow-down-s-line"></i>
                        {activeDropdown === index && (
                            <div className="header__dropdown-menu">
                                {item.subItems.map((subItem, subIndex) => (
                                    <a
                                        key={subIndex}
                                        href={subItem.href}
                                        className="header__dropdown-item"
                                    >
                                        {subItem.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <Link key={index} href={item.href} className="header__link">
                        <small>{item.label}</small>
                    </Link>
                )
            ))}
        </nav>
    );
};

export default HeaderNav;
