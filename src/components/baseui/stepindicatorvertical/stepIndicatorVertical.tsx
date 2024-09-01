import React from 'react';
import './step-indicator-vertical.scss';
import 'remixicon/fonts/remixicon.css';
import type {StepIndicatorVerticalItemProps}  from "@/components/baseui/stepindicatorvertical/stepIndicatorItem";

interface StepIndicatorVerticalProps {
    items: React.ReactElement<StepIndicatorVerticalItemProps>[];
    title: string;
}

const StepIndicatorVertical: React.FC<StepIndicatorVerticalProps> = (props) => {
    return (
        <div className={`step-indicator-vertical-sidebar`}>
            <span className={'step-indicator-vertical-sidebar__title'}>{props.title}</span>
            <div className={`step-indicator-vertical__container`}>
                {props.items.map((item, index) => {
                    return (
                        <span className={'step-indicator-vertical__item'} key={index}>
                            {item}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

export default StepIndicatorVertical;
