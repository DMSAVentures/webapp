import React, {ComponentProps} from 'react';
import './step-indicator-vertical-item.scss';
import 'remixicon/fonts/remixicon.css';
import {ppath} from "@yarnpkg/fslib";
export interface StepIndicatorVerticalItemProps {
    state: 'default' | 'active' | 'completed' | 'disabled';
    idx: number;
    text: string;
    onClick?: () => void;
}
type StepIndicatorVerticalItemIconProps = Omit<StepIndicatorVerticalItemProps, 'text' | 'onClick'>

const StepIndicatorVerticalItemIcon: React.FC<StepIndicatorVerticalItemIconProps> = (props) => {
    if (props.state === 'completed') {
        return <i className="step-indicator-vertical-item__icon step-indicator-vertical-item__icon--completed ri-check-line"/>
    } else if (props.state === 'active') {
        return <span className="step-indicator-vertical-item__icon step-indicator-vertical-item__icon--active">{props.idx}</span>
    }
    return <span className="step-indicator-vertical-item__icon step-indicator-vertical-item__icon--default">{props.idx}</span>
}


const StepIndicatorVerticalItem: React.FC<StepIndicatorVerticalItemProps> = (props) => {
    const { state } = props;
    return (
        <div className={`step-indicator-vertical-item step-indicator-vertical-item--${state}`}>
            <StepIndicatorVerticalItemIcon {...props} />
            { 'text' in props && <span className={'step-indicator-vertical-item__text'}>{props.text}</span> }
        </div>
    );
}

export default StepIndicatorVerticalItem;
