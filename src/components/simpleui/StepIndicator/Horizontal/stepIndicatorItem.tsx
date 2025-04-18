import React from 'react';
import styles from './step-indicator-horizontal-item.module.scss';
import 'remixicon/fonts/remixicon.css';

export interface StepIndicatorHorizontalItemProps {
    state: 'default' | 'active' | 'completed' | 'disabled';
    idx: number;
    text: string;
    onClick?: () => void;
}
type StepIndicatorHorizontalItemIconProps = Omit<StepIndicatorHorizontalItemProps, 'text' | 'onClick'>

const StepIndicatorHorizontalItemIcon: React.FC<StepIndicatorHorizontalItemIconProps> = (props) => {
    if (props.state === 'completed') {
        return <i className={`ri-check-line ${styles["step-indicator-horizontal-item__icon"]} ${styles['step-indicator-horizontal-item__icon--completed']}`}/>;
    } else if (props.state === 'active') {
        return <small className={`${styles["step-indicator-horizontal-item__icon"]} ${styles['step-indicator-horizontal-item__icon--active']}`}>{props.idx}</small>;
    }
    return <small className={`${styles["step-indicator-horizontal-item__icon"]} ${styles['step-indicator-horizontal-item__icon--default']}`}>{props.idx}</small>;
}


const StepIndicatorHorizontalItem: React.FC<StepIndicatorHorizontalItemProps> = (props) => {
    const { state } = props;
    return (
        <div className={`${styles["step-indicator-horizontal-item"]} ${styles[`step-indicator-horizontal-item--${state}`]}`}>
            <StepIndicatorHorizontalItemIcon {...props} />
            { 'text' in props && <span className={styles['step-indicator-horizontal-item__text']}>{props.text}</span> }
        </div>
    );
}

export default StepIndicatorHorizontalItem;
