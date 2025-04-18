import "remixicon/fonts/remixicon.css";
import styles from './status-badge.module.scss';
import React from "react";
interface StatusBadgeProps {
    text: string;
    variant: 'completed' | 'pending' | 'failed' | 'disabled'
    styleType?: 'light' | 'stroke';
    icon?: string;
}
const StatusBadge: React.FC<StatusBadgeProps> = (props) => {
            const containerClass = [styles['status-badge'], styles[`status-badge--${props.variant}`], styles[`status-badge--${props.styleType}`]].join(" ")
            const iconClass = props.icon ? [styles['status-badge__icon'], props.icon].join(" ") : [styles['status-badge__icon'], 'ri-circle-fill'].join(" ");
            return (
                <div className={containerClass}>
                    <i className={iconClass}/>
                    <div>{props.text}</div>
                </div>
            );
}

export default StatusBadge;
