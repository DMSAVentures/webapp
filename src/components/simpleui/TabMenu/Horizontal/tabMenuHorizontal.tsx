import React, {useCallback} from 'react';
import './tab-menu-horizontal.scss';
import {TabMenuHorizontalItemProps} from "@/components/simpleui/TabMenu/Horizontal/tabMenuHorizontalItem";

interface TabMenuHorizontalProps {
    items: React.ReactElement<TabMenuHorizontalItemProps>[];
    activeTab?: number;
    onTabClick: (index: number) => void;
}
export const TabMenuHorizontal: React.FC<TabMenuHorizontalProps> = (props) => {
    const { onTabClick } = props;
    const handleTabClick = useCallback((index: number) => {
        onTabClick(index);
    }, [onTabClick]);
    const itemsMemo = React.useMemo(() => props.items || [], [props.items]);
    let activeTab = props.activeTab || 0;
    return (
        <nav className={`tab-menu-horizontal`}>
            <ul>
            {itemsMemo.map((item, index) => {
                return (
                    <li className={`tab-menu-horizontal__item ${activeTab === index ? 'tab-menu-horizontal__item--active' : ''}`}  onClick={() => handleTabClick(index)} key={index}>
                        {item}
                    </li>
                );
            })}
            </ul>
        </nav>
    );
}
