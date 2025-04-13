import React from 'react';
import './breadcrumb.scss';
import 'remixicon/fonts/remixicon.css';
import type {BreadcrumbItemProps}  from "@/components/simpleui/breadcrumb/breadcrumbitem";
import {useRouter} from "next/navigation";

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
    const router = useRouter();
    return (
        <nav className={`breadcrumb`}>
            {props.items.map((item, index) => {
                const handleClick = () => {
                    if (item.props.state === 'active' || item.props.state === 'disabled') {
                        // Prevent navigation if the item is active
                        return;
                    }
                    router.push(item.props.path || '/');
                }
                return (
                    <span className={'breadcrumb__item'} key={index} onClick={() => {handleClick()}}>
                        {item}
                        {index < props.items.length - 1 && <span className={'breadcrumb__separator'}>{separatorIconClass}</span>}
                    </span>

                );
            })}
        </nav>
    );
}

export default Breadcrumb;
