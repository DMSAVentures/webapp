import React, {useCallback} from 'react';
import './tab-menu-horizontal.scss';

interface TabMenuHorizontalProps {
    items: string[];
    activeTab?: number;
    onTabClick: (index: number) => void;
}
export const TabMenuHorizontal: React.FC<TabMenuHorizontalProps> = (props) => {
    const { items, onTabClick } = props;
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
                    <li aria-selected={activeTab === index} className={`tab-menu-horizontal__item ${activeTab === index ? 'tab-menu-horizontal__item--active' : ''}`}  onClick={() => handleTabClick(index)} key={index}>
                    <span>
                        {item}
                    </span>
                        {/*{activeTab === index && <div className="tab-menu-horizontal__active-tab-indicator"></div>}*/}
                    </li>
                );
            })}
            </ul>
        </nav>
    );
}
