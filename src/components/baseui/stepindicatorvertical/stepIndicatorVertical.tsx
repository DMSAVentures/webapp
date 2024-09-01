import React from 'react';
import './step-indicator-vertical.scss';
import 'remixicon/fonts/remixicon.css';
import type {StepIndicatorVerticalItemProps}  from "@/components/baseui/stepindicatorvertical/stepIndicatorItem";

interface StepIndicatorVerticalProps {
    items: React.ReactElement<StepIndicatorVerticalItemProps>[];
}

const StepIndicatorVertical: React.FC<StepIndicatorVerticalProps> = (props) => {
    return (
        <div className={`step-indicator-vertical`}>
            {props.items.map((item, index) => {
                return (
                    <span className={'step-indicator-vertical__item'} key={index}>
                        {item}
                        {index < props.items.length - 1 && <i className={'step-indicator-vertical__separator ri-arrow-right-s-line'}/>}
                    </span>
                );
            })}
        </div>
    );
}

export default StepIndicatorVertical;
