import React from 'react';
import './progressbar.scss';
interface ProgressBarLineProps {
    progress: number;
    size: 'small' | 'medium' | 'large';
    variant: 'success' | 'warning' | 'error' | 'info';
    showPercentage: boolean;
}

const ProgressBarLine: React.FC<ProgressBarLineProps> = (props) => {
    return (
        <div className={`progress-bar progress-bar--${props.size}`}>
            <div className={`progress-bar__line progress-bar__line--${props.variant}`} style={{ width: `${props.progress}%` }}/>
            {props.showPercentage && <span className="progress-bar__percentage">{props.progress}%</span>}
        </div>
    );
}

export default ProgressBarLine;
