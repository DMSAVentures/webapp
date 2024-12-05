import "remixicon/fonts/remixicon.css";
import "./status-badge.scss";
import React from "react";
interface StatusBadgeProps {
    text: string;
    variant: 'completed' | 'pending' | 'failed' | 'disabled'
    styleType?: 'light' | 'stroke';
    icon?: string;
}
const StatusBadge: React.FC<StatusBadgeProps> = (props) => {
            return (
                <div className={`status-badge status-badge--${props.variant} status-badge--${props.styleType}`}>
                    {props.icon
                        ?
                        <i className={`status-badge__icon ${props.icon}`}/>
                        :
                        <i className={`status-badge__icon ri-circle-fill`}/>
                    }
                    <div>{props.text}</div>
                </div>
            );
}

export default StatusBadge;
