import React from "react";
import {TabMenuVerticalItemProps} from "@/components/baseui/TabMenu/Vertical/tabMenuVerticalItem";
import './tab-menu-vertical.scss';
interface TabMenuVerticalProps {
    items: React.ReactElement<TabMenuVerticalItemProps>[];
    title: string;
    variant: 'card' | 'default';
    showFooter?: boolean;
}
export const TabMenuVertical : React.FC<TabMenuVerticalProps> = (props) => {
    return (
        <div className={`tab-menu-vertical-sidebar tab-menu-vertical-sidebar--${props.variant}`}>
            <span className={'tab-menu-vertical-sidebar__title'}>{props.title}</span>
            <div className={`tab-menu-vertical-sidebar__container`}>
                {props.items.map((item, index) => {
                    return (
                        <span className={'tab-menu-vertical__item'} key={index}>
                            {item}
                        </span>
                    );
                })}
            </div>
            {props.showFooter ? <span className={'tab-menu-vertical-sidebar__footer'}>&copy; {new Date().getFullYear()} Shubhanshu</span> : null }
        </div>
    );
}
