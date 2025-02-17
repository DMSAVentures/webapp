import React, { ButtonHTMLAttributes } from 'react';
import './linkbutton.scss';
import "remixicon/fonts/remixicon.css";

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLElement> {
    variant?: 'gray' | 'primary' | 'neutral' | 'error';
    styleType?: 'lighter';
    size?: 'small' | 'medium'
    underline?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    pickLeft?: boolean;
    pickRight?: boolean;
    href: string;
}

const Linkbutton: React.FC<LinkButtonProps> = ({
                                           variant = 'primary',
                                           styleType = 'lighter',
                                           size = 'medium',
                                           underline = false,
                                           leftIcon,
                                           rightIcon,
                                           pickLeft = false,
                                           pickRight = false,
                                           children,
                                           ...props
                                       }) => {
    return (
        <div
            className={`linkbutton linkbutton--${variant} linkbutton--${styleType} linkbutton--${size} ${pickLeft ? 'linkbutton--pick-left' : ''} ${pickRight ? 'linkbutton--pick-right' : ''} ${props.className || ''}`}
        >
            {leftIcon && <i className={`linkbutton__icon linkbutton__icon--left ri-${leftIcon}`}/>}
            <a href={props.href} className={`linkbutton__text ${
                underline ? 'linkbutton--underline' : ''
            }`}>{children}</a>
            {rightIcon && <i className={`linkbutton__icon linkbutton__icon--left ri-${rightIcon}`}/>}
        </div>
    );
};

export default Linkbutton;
