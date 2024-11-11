import React from 'react';
import './breadcrumb.scss';
import 'remixicon/fonts/remixicon.css';
import type {BreadcrumbItemProps}  from "@/components/baseui/breadcrumb/breadcrumbitem";

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
    return (
        <nav className={`breadcrumb`}>
            {props.items.map((item, index) => {
                return (
                    <span className={'breadcrumb__item'} key={index}>
                        {item}
                        {index < props.items.length - 1 && <span className={'breadcrumb__separator'}>{separatorIconClass}</span>}
                    </span>

                );
            })}
        </nav>
    );
}

export default Breadcrumb;
