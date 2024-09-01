import React from 'react';
import './step-indicator-horizontal-item.scss';
import 'remixicon/fonts/remixicon.css';
interface StepIndicatorHorizontalItemWithTextProps {
    state: 'default' | 'active' | 'disabled';
    text: string;
    onClick?: () => void;
}

interface StepIndicatorHorizontalItemWithIconProps {
    state: 'default' | 'active' | 'disabled';
    icon: string
    onClick?: () => void;
}

interface StepIndicatorHorizontalItemWithTextAndIconProps {
    state: 'default' | 'active' | 'disabled';
    text: string;
    icon: string;
    onClick?: () => void;
}

export type StepIndicatorHorizontalItemProps = StepIndicatorHorizontalItemWithTextProps | StepIndicatorHorizontalItemWithIconProps | StepIndicatorHorizontalItemWithTextAndIconProps;
const StepIndicatorHorizontalItem: React.FC<StepIndicatorHorizontalItemProps> = (props) => {
    const { state } = props;
    return (
        <div className={`step-indicator-horizontal-item step-indicator-horizontal-item--${state}`}>
            { 'icon' in props && <i className={`step-indicator-horizontal-item__icon ${props.icon}`}/> }
            { 'text' in props && <span className={'step-indicator-horizontal-item__text'}>{props.text}</span> }
        </div>
    );
}

export default StepIndicatorHorizontalItem;
