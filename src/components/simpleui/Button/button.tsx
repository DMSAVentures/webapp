import React, {FC, ButtonHTMLAttributes, useRef, useState, useEffect} from 'react';
import './button.scss';
import 'remixicon/fonts/remixicon.css';

// Define the possible variants for the button
type ButtonVariant = 'primary' | 'secondary';

// Interface for Button Props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    disabled?: boolean;
    leftIcon?: string;
    href?: string;
}

// Button component
export const Button: FC<ButtonProps> = ({
                                     variant = 'primary',
                                     disabled = false,
                                            leftIcon,
                                     onClick,
                                     children,
    href,
                                     ...props
                                 }) => {
    const className = `button ${variant === 'secondary' ? 'button--secondary' : ''}`;

    if (href) {
        return (
            <a
                style={{textDecoration: 'none'}}
                className={className}
                href={href}
                aria-disabled={disabled}
            >
                {leftIcon && <i className={`ri-${leftIcon}`} aria-hidden="true"></i>}
                {children}
            </a>
        );
    }

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
