import "remixicon/fonts/remixicon.css";
import "./badge.scss";
import React from "react";
interface BadgeProps {
    text: string | number;
    variant: 'gray' | 'blue' | 'orange' | 'red' | 'green' | 'purple' | 'yellow' | 'pink' | 'sky' | 'teal';
    styleType?: 'filled' | 'light' | 'lighter' | 'stroke';
    size?: 'small' | 'medium';
    icon?: string;
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
                    {props.icon && props.iconPosition === 'left' && <i className={`badge__icon ${props.icon}`}/>}
                    {props.text}
                    {props.icon && props.iconPosition === 'right' && <i className={`badge__icon ${props.icon}`}/>}
                </div>
            );
        } else {
            return (
                <div className={`badge badge--${props.size} badge--${props.variant} badge--${props.styleType}`}>
                    {props.icon && props.iconPosition === 'left' && <i className={`badge__icon ${props.icon}`}/>}
                    {props.text}
                    {props.icon && props.iconPosition === 'right' && <i className={`badge__icon ${props.icon}`}/>}
                </div>
            );
        }
    }
}
