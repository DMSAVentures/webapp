import React from 'react';
import './circularbar.scss';

interface CircularProgressProps {
    percentage: number;
    size: 'x-small' | 'small' | 'medium' | 'large';
    variant: 'success' | 'warning' | 'error' | 'info';
    showPercentage: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = (props) => {
    const clampedPercentage = Math.min(100, Math.max(0, props.percentage));

    return (
       <div className={`radial-progress radial-progress--${props.size} radial-progress--${props.variant}`}
            style={{ '--progress-percentage': `${clampedPercentage}%` } as React.CSSProperties & { [key: string]: string | number }}>
           <div className={'center-content'}>
               {props.showPercentage ? <span>{clampedPercentage}%</span> : null}
           </div>
       </div>
    );
};

export default CircularProgress;
