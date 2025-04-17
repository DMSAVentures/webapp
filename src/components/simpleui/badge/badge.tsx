import "remixicon/fonts/remixicon.css";
// import "./badge.scss";
import React from "react";
interface BadgeProps {
    text: string | number;
    variant: 'gray' | 'blue' | 'orange' | 'red' | 'green' | 'purple' | 'yellow' | 'pink' | 'sky' | 'teal';
    styleType?: 'filled' | 'light' | 'lighter' | 'stroke';
    size?: 'small' | 'medium';
    iconClass?: string;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
}
export const Badge: React.FC<BadgeProps> = (props) => {
    const num = parseInt(props.text.toString())
    if (num) {
        if (props.disabled) {
            return (
                <div className={`badge badge--${props.size} badge--disabled`}>
                    {
                        num < 10 ? num  : '9+'
                    }
                </div>
            );
        }
        return (
            <div className={`badge badge--${props.size} badge--${props.variant} badge--${props.styleType}`}>
                {
                    num < 10 ? num  : '9+'
                }
            </div>
        );
    } else {
        if (props.disabled) {
            return (
                <div className={`badge badge--${props.size} badge--disabled`}>
                    {props.iconClass && props.iconPosition === 'left' && <i className={`badge__icon ri-${props.iconClass}`}/>}
                    {props.text}
                    {props.iconClass && props.iconPosition === 'right' && <i className={`badge__icon ri-${props.iconClass}`}/>}
                </div>
            );
        } else {
            return (
                <div className={`badge badge--${props.size} badge--${props.variant} badge--${props.styleType}`}>
                    {props.iconClass && props.iconPosition === 'left' && <i className={`badge__icon ri-${props.iconClass}`}/>}
                    <span>{props.text}</span>
                    {props.iconClass && props.iconPosition === 'right' && <i className={`badge__icon ri-${props.iconClass}`}/>}
                </div>
            );
        }
    }
}
