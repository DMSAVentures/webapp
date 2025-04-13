import React from 'react';
import './breadcrumbitem.scss';
import 'remixicon/fonts/remixicon.css';
import {useNavigate} from "@storybook/core/router";
import {useRouter} from "next/navigation";
interface BreadcrumbItemWithTextProps {
    state: 'default' | 'active' | 'disabled';
    path?: string;
    children: string;
}

// interface BreadcrumbItemWithIconProps {
//     state: 'default' | 'active' | 'disabled';
//     icon: string
//     onClick?: () => void;
// }

interface BreadcrumbItemWithTextAndIconProps {
    state: 'default' | 'active' | 'disabled';
    icon?: string;
    path?: string;
    children: string;
}

export type BreadcrumbItemProps = BreadcrumbItemWithTextProps | BreadcrumbItemWithTextAndIconProps;
const BreadcrumbItem: React.FC<BreadcrumbItemProps> = (props) => {
    const { state } = props;
    return (
        <div className={`breadcrumb-item breadcrumb-item--${state}`}>
            { 'icon' in props && <i className={`breadcrumb-item__icon ${props.icon}`}/> }
            { 'children' in props && <span className={'breadcrumb-item__text'}>{props.children}</span> }
        </div>
    );
}

export default BreadcrumbItem;
