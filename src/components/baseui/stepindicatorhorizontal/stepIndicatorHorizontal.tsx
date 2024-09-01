import React from 'react';
import './step-indicator-horizontal.scss';
import 'remixicon/fonts/remixicon.css';
import type {StepIndicatorHorizontalItemProps}  from "@/components/baseui/stepindicatorhorizontal/stepIndicatorItem";

interface StepIndicatorHorizontalProps {
    items: React.ReactElement<StepIndicatorHorizontalItemProps>[];
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

const StepIndicatorHorizontal: React.FC<StepIndicatorHorizontalProps> = (props) => {
    const separatorIconClass = getSeparatorIconClass(props.divider);
    return (
        <nav className={`step-indicator-horizontal`}>
            {props.items.map((item, index) => {
                return (
                    <span className={'step-indicator-horizontal__item'} key={index}>
                        {item}
                        {index < props.items.length - 1 && <span className={'step-indicator-horizontal__separator'}>{separatorIconClass}</span>}
                    </span>
                );
            })}
        </nav>
    );
}

export default StepIndicatorHorizontal;
