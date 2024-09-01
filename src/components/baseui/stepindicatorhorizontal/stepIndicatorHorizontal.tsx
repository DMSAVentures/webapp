import React from 'react';
import './step-indicator-horizontal.scss';
import 'remixicon/fonts/remixicon.css';
import type {StepIndicatorHorizontalItemProps}  from "@/components/baseui/stepindicatorhorizontal/stepIndicatorItem";

interface StepIndicatorHorizontalProps {
    items: React.ReactElement<StepIndicatorHorizontalItemProps>[];
}

const StepIndicatorHorizontal: React.FC<StepIndicatorHorizontalProps> = (props) => {
    return (
        <div className={`step-indicator-horizontal`}>
            {props.items.map((item, index) => {
                return (
                    <span className={'step-indicator-horizontal__item'} key={index}>
                        {item}
                        {index < props.items.length - 1 && <i className={'step-indicator-horizontal__separator ri-arrow-right-s-line'}/>}
                    </span>
                );
            })}
        </div>
    );
}

export default StepIndicatorHorizontal;
