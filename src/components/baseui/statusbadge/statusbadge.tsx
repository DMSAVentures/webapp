import "remixicon/fonts/remixicon.css";
import "./statusbadge.scss";
import React from "react";
interface StatusBadgeProps {
    text: string;
    variant: 'completed' | 'pending' | 'failed' | 'disabled'
    styleType?: 'light' | 'stroke';
    icon?: string;
}
const StatusBadge: React.FC<StatusBadgeProps> = (props) => {
            return (
                <div className={`statusbadge statusbadge--${props.variant} statusbadge--${props.styleType}`}>
                    {props.icon
                        ?
                        <i className={`statusbadge__icon ${props.icon}`}/>
                        :
                        <i className={`statusbadge__icon ri-circle-fill`}/>
                    }
                    <div>{props.text}</div>
                </div>
            );
}

export default StatusBadge;
