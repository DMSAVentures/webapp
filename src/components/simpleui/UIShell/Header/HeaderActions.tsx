import React, { useState } from 'react';
import {IconOnlyButton} from "@/components/simpleui/Button/IconOnlyButton";
import Link from "next/link";

export interface ActionItem {
    iconClass: string;
    label: string;
    href?: string;
    subItems?: { label: string; href: string }[];
}

interface HeaderActionsProps {
    items: ActionItem[];
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ items }) => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    const toggleDropdown = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <div className="header__actions">
            {items.map((item, index) => (
                item.subItems ? (
                    <div
                        key={index}
                        className="header__action-dropdown"
                        onClick={() => toggleDropdown(index)}
                        onBlur={() => setActiveDropdown(null)}
                        tabIndex={0}
                    >
                        <IconOnlyButton variant={'secondary'} iconClass={item.iconClass} aria-label={item.label} />
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

                        <IconOnlyButton key={index} variant={'secondary'} iconClass={item.iconClass} aria-label={item.label}>
                            <Link href={item.href!}/>
                        </IconOnlyButton>
                )
            ))}
        </div>
    );
};

export default HeaderActions;
