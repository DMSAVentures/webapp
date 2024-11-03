import React, {FC, ButtonHTMLAttributes, useRef, useState, useEffect} from 'react';
import './button.scss';

// Define the possible variants for the button
type ButtonVariant = 'primary' | 'secondary';

// Interface for Button Props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    disabled?: boolean;
    leftIcon?: string;
}

// Button component
export const Button: FC<ButtonProps> = ({
                                     variant = 'primary',
                                     disabled = false,
                                            leftIcon,
                                     onClick,
                                     children,
                                     ...props
                                 }) => {
    const className = `button ${variant === 'secondary' ? 'button--secondary' : ''}`;

    return (
            <button
                {...props} // Spread any additional props to the button
                className={className}
                disabled={disabled}
                onClick={onClick}
                aria-disabled={disabled}
            >
                {leftIcon && <i className={`ri-${leftIcon}`} aria-hidden="true"></i>}
                {children}
            </button>

    );
};

// export default Button;
