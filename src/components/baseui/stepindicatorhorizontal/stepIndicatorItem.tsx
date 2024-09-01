import React, {ComponentProps} from 'react';
import './step-indicator-horizontal-item.scss';
import 'remixicon/fonts/remixicon.css';
import {ppath} from "@yarnpkg/fslib";
export interface StepIndicatorHorizontalItemProps {
    state: 'default' | 'active' | 'completed' | 'disabled';
    idx: number;
    text: string;
    onClick?: () => void;
}
type StepIndicatorHorizontalItemIconProps = Omit<StepIndicatorHorizontalItemProps, 'text' | 'onClick'>

const StepIndicatorHorizontalItemIcon: React.FC<StepIndicatorHorizontalItemIconProps> = (props) => {
    if (props.state === 'completed') {
        return <i className="step-indicator-horizontal-item__icon step-indicator-horizontal-item__icon--completed ri-check-line"/>
    } else if (props.state === 'active') {
        return <span className="step-indicator-horizontal-item__icon step-indicator-horizontal-item__icon--active">{props.idx}</span>
    }
    return <span className="step-indicator-horizontal-item__icon step-indicator-horizontal-item__icon--default">{props.idx}</span>
}


const StepIndicatorHorizontalItem: React.FC<StepIndicatorHorizontalItemProps> = (props) => {
    const { state } = props;
    return (
        <div className={`step-indicator-horizontal-item step-indicator-horizontal-item--${state}`}>
            <StepIndicatorHorizontalItemIcon {...props} />
            { 'text' in props && <span className={'step-indicator-horizontal-item__text'}>{props.text}</span> }
        </div>
    );
}

export default StepIndicatorHorizontalItem;
