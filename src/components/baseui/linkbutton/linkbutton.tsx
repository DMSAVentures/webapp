import React, { ButtonHTMLAttributes } from 'react';
import './linkbutton.scss';

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'gray' | 'primary' | 'neutral' | 'error';
    styleType?: 'lighter';
    size?: '2x-small' | 'x-small' | 'small' | 'medium'
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
                                           styleType = 'filled',
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
        <button
            className={`linkbutton linkbutton--${variant} linkbutton--${styleType} linkbutton--${size} ${pickLeft ? 'linkbutton--pick-left' : ''} ${pickRight ? 'linkbutton--pick-right' : ''}`}
            {...props}
        >
            {leftIcon && <span className="linkbutton__icon linkbutton__icon--left">{leftIcon}</span>}
            <a href={props.href} className={`linkbutton__text ${
                underline ? 'linkbutton--underline' : ''
            }`}>{text || children}</a>
            {rightIcon && <span className="linkbutton__icon linkbutton__icon--right">{rightIcon}</span>}
        </button>
    );
};

export default Linkbutton;
