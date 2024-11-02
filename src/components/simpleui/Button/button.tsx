import React, {FC, ButtonHTMLAttributes, useRef, useState, useEffect} from 'react';
import './button.scss';

// Define the possible variants for the button
type ButtonVariant = 'primary' | 'secondary';

// Interface for Button Props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    disabled?: boolean;
}

// Button component
export const Button: FC<ButtonProps> = ({
                                     variant = 'primary',
                                     disabled = false,
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
                {children}
            </button>

    );
};

// export default Button;
