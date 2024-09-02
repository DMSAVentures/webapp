import React from "react";
import "./tab-menu-vertical-item.scss"

export interface TabMenuVerticalItemProps {
    active: boolean;
    leftIcon?: string;
    rightIcon?: string;
    number?: boolean;
    text: string;
    onClick?: () => void;
}
export const TabMenuVerticalItem: React.FC<TabMenuVerticalItemProps> = (props) => {
    return (

        <div className={`tab-menu-vertical-item ${props.active ? 'tab-menu-vertical-item--active' : ''}`}>
            {props.leftIcon &&
                <i className={`tab-menu-vertical-item__left-icon ${props.leftIcon}`}/>}
            <span className="tab-menu-vertical-item__text">{props.text}</span>

            {Boolean(props.number) && !props.rightIcon && <span className="tab-menu-vertical-item__badge">{props.number}</span>}
            {!props.number && props.rightIcon &&
                <i className={`tab-menu-vertical-item__right-icon ${props.rightIcon}`}/>}
        </div>

    )
}
