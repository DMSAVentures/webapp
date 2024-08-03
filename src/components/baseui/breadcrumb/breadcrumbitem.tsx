import React from 'react';
import './breadcrumbitem.scss';
import 'remixicon/fonts/remixicon.css';
interface BreadcrumbItemWithTextProps {
    state: 'default' | 'active' | 'disabled';
    text: string;
    onClick?: () => void;
}

interface BreadcrumbItemWithIconProps {
    state: 'default' | 'active' | 'disabled';
    icon: string
    onClick?: () => void;
}

interface BreadcrumbItemWithTextAndIconProps {
    state: 'default' | 'active' | 'disabled';
    text: string;
    icon: string;
    onClick?: () => void;
}

type BreadcrumbItemProps = BreadcrumbItemWithTextProps | BreadcrumbItemWithIconProps | BreadcrumbItemWithTextAndIconProps;
const BreadcrumbItem: React.FC<BreadcrumbItemProps> = (props) => {
    const { state } = props;
    return (
        <div className={`breadcrumb-item breadcrumb-item--${state}`}>
            { 'icon' in props && <i className={`breadcrumb-item__icon ${props.icon}`}/> }
            { 'text' in props && <span className={'breadcrumb-item__text'}>{props.text}</span> }
        </div>
    );
}

export default BreadcrumbItem;
