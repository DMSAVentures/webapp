import React from 'react';
import styles from './step-indicator-horizontal.module.scss';
import 'remixicon/fonts/remixicon.css';
import type {StepIndicatorHorizontalItemProps}  from "@/components/simpleui/StepIndicator/Horizontal/stepIndicatorItem";

interface StepIndicatorHorizontalProps {
    items: React.ReactElement<StepIndicatorHorizontalItemProps>[];
}

const StepIndicatorHorizontal: React.FC<StepIndicatorHorizontalProps> = (props) => {
    return (
        <div className={styles["step-indicator-horizontal"]}>
            {props.items.map((item, index) => {
                return (
                    <span className={styles["step-indicator-horizontal__item"]} key={index}>
                        {item}
                        {index < props.items.length - 1 && <i className={`ri-arrow-right-s-line ${styles["step-indicator-horizontal__separator"]}`}/>}
                    </span>
                );
            })}
        </div>
    );
}

export default StepIndicatorHorizontal;
