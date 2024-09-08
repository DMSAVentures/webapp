import React, { ButtonHTMLAttributes } from 'react';
import './button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'neutral' | 'error';
    styleType?: 'filled' | 'stroke' | 'lighter' | 'ghost';
    size?: '2x-small' | 'x-small' | 'small' | 'medium'
    onlyIcon?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    pickLeft?: boolean;
    pickRight?: boolean;
    children: string;
}

const Button: React.FC<ButtonProps> = ({
                                           variant = 'primary',
                                           styleType = 'filled',
                                           size = 'medium',
                                           onlyIcon = false,
                                           leftIcon,
                                           rightIcon,
                                           pickLeft = false,
                                           pickRight = false,
                                           children,
                                           ...props
                                       }) => {
    return (
        <button
            className={`button button--${variant} button--${styleType} button--${size} ${
                onlyIcon ? 'button--icon-only' : ''
            } ${pickLeft ? 'button--pick-left' : ''} ${pickRight ? 'button--pick-right' : ''}`}
            {...props}
        >
            {leftIcon && !onlyIcon && <span className="button__icon button__icon--left">{leftIcon}</span>}
            {!onlyIcon && <span className="button__text">{children}</span>}
            {rightIcon && !onlyIcon && <span className="button__icon button__icon--right">{rightIcon}</span>}
            {onlyIcon && (leftIcon || rightIcon)}
        </button>

    );
};

export default Button;
