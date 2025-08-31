import React from 'react';
import styles from './breadcrumb.module.scss';
import 'remixicon/fonts/remixicon.css';
import type {BreadcrumbItemProps}  from "@/components/simpleui/breadcrumb/breadcrumbitem";
import {useNavigate} from "@tanstack/react-router";

interface BreadcrumbProps {
    items: React.ReactElement<BreadcrumbItemProps>[];
    divider:  'arrow' | 'dot' | 'slash';
}

function getSeparatorIconClass(divider: string): string {
    switch (divider) {
        case 'arrow':
            return '\u003E'; // Unicode for '>'
        case 'dot':
            return '\u2022'; // Unicode for '•'
        case 'slash':
            return '\u002F'; // Unicode for '/'
        default:
            return '\u2022'; // Default to '•'
    }
}

const Breadcrumb: React.FC<BreadcrumbProps> = (props) => {
    const separatorIconClass = getSeparatorIconClass(props.divider);
    const navigate = useNavigate();
    return (
        <nav className={styles.breadcrumb}>
            {props.items.map((item, index) => {
                const handleClick = () => {
                    if (item.props.state === 'active' || item.props.state === 'disabled') {
                        // Prevent navigation if the item is active
                        return;
                    }
                    navigate({to: item.props.path || '/'});
                }
                return (
                    <span className={styles['breadcrumb__item']} key={index} onClick={() => {handleClick()}}>
                        {item}
                        {index < props.items.length - 1 && <span className={styles['breadcrumb__separator']}>{separatorIconClass}</span>}
                    </span>

                );
            })}
        </nav>
    );
}

export default Breadcrumb;
