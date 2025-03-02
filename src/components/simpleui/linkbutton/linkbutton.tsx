import React, { ButtonHTMLAttributes, KeyboardEvent, forwardRef } from 'react';
import styles from './linkbutton.module.scss';
import "remixicon/fonts/remixicon.css";

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLAnchorElement> {
    variant?: 'gray' | 'primary' | 'neutral' | 'error';
    styleType?: 'lighter';
    size?: 'small' | 'medium';
    underline?: boolean;
    leftIcon?: string;
    rightIcon?: string;
    pickLeft?: boolean;
    pickRight?: boolean;
    href: string;
    /**
     * Accessible label for screen readers when the button text is not descriptive enough
     */
    ariaLabel?: string;
    /**
     * External link indicator - adds rel attributes for security and opens in new tab
     */
    isExternal?: boolean;
}

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(({
    variant = 'primary',
    styleType = 'lighter',
    size = 'medium',
    underline = false,
    leftIcon,
    rightIcon,
    pickLeft = false,
    pickRight = false,
    children,
    href,
    ariaLabel,
    isExternal = false,
    disabled = false,
    onClick,
    ...props
}, ref) => {
    // Generate CSS class names
    const buttonClasses = [
        styles.linkbutton,
        styles[`linkbutton--${variant}`],
        styleType ? styles[`linkbutton--${styleType}`] : '',
        styles[`linkbutton--${size}`],
        pickLeft ? styles['linkbutton--pick-left'] : '',
        pickRight ? styles['linkbutton--pick-right'] : '',
        underline ? styles['linkbutton--underline'] : '',
        props.className || ''
    ].filter(Boolean).join(' ');

    // Handle keyboard events for accessibility
    const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
        if (disabled) return;
        
        // Trigger click on Enter or Space key press
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick?.(event as any);
        }
    };

    // External link attributes for security
    const externalProps = isExternal ? {
        target: "_blank",
        rel: "noopener noreferrer",
        'aria-label': `${ariaLabel || children} (opens in a new tab)`
    } : {};

    return (
        <a
            ref={ref}
            href={disabled ? undefined : href}
            className={buttonClasses}
            onClick={disabled ? (e) => e.preventDefault() : onClick}
            onKeyDown={handleKeyDown}
            aria-disabled={disabled}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={ariaLabel}
            {...externalProps}
            {...props}
        >
            {leftIcon && (
                <span className={`${styles['linkbutton__icon']} ${styles['linkbutton__icon--left']}`}>
                    <i className={`ri-${leftIcon}`} aria-hidden="true" />
                </span>
            )}
            <span className={styles['linkbutton__text']}>
                {children}
                {isExternal && (
                    <span className={styles['linkbutton__external-icon']} aria-hidden="true">
                        <i className="ri-external-link-line" />
                    </span>
                )}
            </span>
            {rightIcon && (
                <span className={`${styles['linkbutton__icon']} ${styles['linkbutton__icon--right']}`}>
                    <i className={`ri-${rightIcon}`} aria-hidden="true" />
                </span>
            )}
        </a>
    );
});

LinkButton.displayName = 'LinkButton';

export default LinkButton;
