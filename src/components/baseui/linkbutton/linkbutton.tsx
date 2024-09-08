import React, { ButtonHTMLAttributes } from 'react';
import './linkbutton.scss';

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLElement> {
    variant?: 'gray' | 'primary' | 'neutral' | 'error';
    styleType?: 'lighter';
    size?: 'small' | 'medium'
    underline?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    pickLeft?: boolean;
    pickRight?: boolean;
    text?: string;
    href?: string;
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
                                           text,
                                           children,
                                           ...props
                                       }) => {
    return (
        <div
            className={`linkbutton linkbutton--${variant} linkbutton--${styleType} linkbutton--${size} ${pickLeft ? 'linkbutton--pick-left' : ''} ${pickRight ? 'linkbutton--pick-right' : ''} ${props.className || ''}`}
        >
            {leftIcon && <span className="linkbutton__icon linkbutton__icon--left">{leftIcon}</span>}
            <a href={props.href} className={`linkbutton__text ${
                underline ? 'linkbutton--underline' : ''
            }`}>{text || children}</a>
            {rightIcon && <span className="linkbutton__icon linkbutton__icon--right">{rightIcon}</span>}
        </div>
    );
};

export default Linkbutton;
