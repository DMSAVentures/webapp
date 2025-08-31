import React from "react";
import styles from "./tab-menu-vertical-item.module.scss"

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

        <li className={`${styles['tab-menu-vertical-item']} ${props.active ? styles['tab-menu-vertical-item--active'] : ''}`}>
            {props.leftIcon &&
                <i className={`${styles['tab-menu-vertical-item__left-icon']} ${props.leftIcon}`}/>}
            <span className={styles['tab-menu-vertical-item__text']}>{props.text}</span>

            {Boolean(props.number) && !props.rightIcon && <span className={styles['tab-menu-vertical-item__badge']}>{props.number}</span>}
            {!props.number && props.rightIcon &&
                <i className={`${styles['tab-menu-vertical-item__right-icon']} ${props.rightIcon}`}/>}
        </li>

    )
}
