import React, { FC, ButtonHTMLAttributes, KeyboardEvent } from 'react';
import styles from './iconOnlyButton.module.scss';
import 'remixicon/fonts/remixicon.css';

type IconOnlyButtonVariant = 'primary' | 'secondary';

interface IconOnlyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    iconClass: string; // Remix Icon class, e.g., 'search-line', 'send-plane-fill'
    variant?: IconOnlyButtonVariant;
    disabled?: boolean;
    /**
     * Accessible label describing the button's action
     * Required for screen readers to understand the button's purpose
     */
    ariaLabel: string;
}

export const IconOnlyButton: FC<IconOnlyButtonProps> = ({
    iconClass,
    variant = 'primary',
    disabled = false,
    onClick,
    className: propClassName,
    ariaLabel,
    onKeyDown,
    ...props
}) => {
    // Use the appropriate class based on variant
    const baseClassName = variant === 'secondary' 
        ? styles['icon-only-button--secondary']
        : styles['icon-only-button'];
    
    // Combine with any additional classes passed as props
    const className = propClassName ? `${baseClassName} ${propClassName}` : baseClassName;

    // Handle keyboard events for accessibility
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        // Trigger click on Enter or Space key press
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault(); // Prevent page scroll on space
            onClick?.(event as any);
        }
        
        // Call the original onKeyDown handler if provided
        onKeyDown?.(event);
    };

    return (
        <button
            {...props}
            className={className}
            disabled={disabled}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            aria-disabled={disabled}
            aria-label={ariaLabel}
            type={props.type || 'button'} // Explicitly set type to avoid form submission issues
            tabIndex={disabled ? -1 : 0}  // Remove from tab order when disabled
            role="button" // Explicitly define role for clarity
        >
            <i className={`ri-${iconClass}`} aria-hidden="true"></i>
        </button>
    );
};
