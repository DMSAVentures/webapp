import React, { forwardRef, memo, ButtonHTMLAttributes } from 'react';
import styles from './button.module.scss';
import 'remixicon/fonts/remixicon.css';

// Define the possible variants for the button
type ButtonVariant = 'primary' | 'secondary';

// Define the possible button types to match HTML semantics
type ButtonType = 'button' | 'submit' | 'reset';

// Define the possible button sizes
type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button Props Interface
 * Follows HTML semantics closely while providing design system specific props
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    /** Visual variant of the button */
    variant?: ButtonVariant;
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Icon to display on the left side of the button text */
    leftIcon?: string;
    /** HTML button type attribute */
    type?: ButtonType;
    /** Size of the button */
    size?: ButtonSize;
}

/**
 * Button Component
 *
 * A semantic button component that follows HTML standards and accessibility best practices.
 * Uses CSS Modules with BEM naming conventions for styling.
 *
 * @example
 * // Primary button
 * <Button onClick={handleClick}>Click me</Button>
 *
 * @example
 * // Secondary button with icon
 * <Button variant="secondary" leftIcon="arrow-right">Next</Button>
 *
 * @example
 * // Submit button for forms
 * <Button type="submit">Submit Form</Button>
 *
 * @example
 * // Accessible button with ARIA attributes
 * <Button
 *   aria-expanded={isExpanded}
 *   aria-controls="dropdown-menu"
 *   onClick={toggleExpanded}
 * >
 *   Menu
 * </Button>
 */
export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
    function Button({
        variant = 'primary',
        disabled = false,
        leftIcon,
        onClick,
        children,
        type = 'button',
        size = 'medium',
        className: customClassName,
        ...props
    }, ref) {
        // Compose CSS classes using CSS Modules with BEM naming
        const classNames = [
            styles.root,
            variant !== 'primary' && styles[`variant_${variant}`],
            size !== 'medium' && styles[`size_${size}`],
            customClassName
        ].filter(Boolean).join(' ');

        return (
            <button
                ref={ref}
                className={classNames}
                disabled={disabled}
                onClick={onClick}
                type={type}
                {...props}
            >
                {leftIcon && (
                    <i className={`${styles.icon} ri-${leftIcon}`} aria-hidden="true"></i>
                )}
                <span className={styles.text}>{children}</span>
            </button>
        );
    }
));

interface SignInButtonProps extends Omit<ButtonHTMLAttributes<HTMLAnchorElement>, 'type'> {
    /** Visual variant of the button */
    variant?: ButtonVariant;
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Icon to display on the left side of the button text */
    leftIcon?: string;
    /** HTML button type attribute */
    type?: ButtonType;
    /** Size of the button */
    size?: ButtonSize;
    href: string;

}

export const SignInButton = memo(forwardRef<HTMLAnchorElement, SignInButtonProps>(
    function SignInButton({
                              variant = 'primary',
                              disabled = false,
                              leftIcon,
                              children,
                              size = 'medium',
                              className: customClassName,
                              href,
                              ...props
                          }, ref) {
        // Compose CSS classes using CSS Modules with BEM naming
        const classNames = [
            styles.root,
            variant !== 'primary' && styles[`variant_${variant}`],
            size !== 'medium' && styles[`size_${size}`],
            customClassName
        ].filter(Boolean).join(' ');

        return (

                <a
                    href={href}
                    ref={ref}
                    className={classNames}
                    style={{ textDecoration: 'none' }}
                    aria-disabled={disabled}
                    {...props}
                >
                    {leftIcon && (
                        <i className={`${styles.icon} ri-${leftIcon}`} aria-hidden="true"></i>
                    )}
                    <span className={styles.text}>{children}</span>
                </a>
        );
    }
));


// Display name for debugging
Button.displayName = 'Button';

export default Button;
