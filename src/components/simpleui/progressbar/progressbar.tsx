import React from 'react';
import styles from './progressbar.module.scss';
interface ProgressBarLineProps {
    progress: number;
    size: 'small' | 'medium' | 'large';
    variant: 'success' | 'warning' | 'error' | 'info';
    showPercentage: boolean;
}

const ProgressBarLine: React.FC<ProgressBarLineProps> = (props) => {
    return (
        <div className={`${styles['progress-bar']} ${styles[`progress-bar--${props.size}`]}`}>
            <div className={`${styles['progress-bar__line']} ${styles[`progress-bar__line--${props.variant}`]}`} style={{ width: `${props.progress}%` }}/>
            {props.showPercentage && <span className={styles['progress-bar__percentage']}>{props.progress}%</span>}
        </div>
    );
}

export default ProgressBarLine;
