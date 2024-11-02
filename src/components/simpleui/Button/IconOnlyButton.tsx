import React, { FC, ButtonHTMLAttributes } from 'react';
import './iconOnlyButton.scss';
import 'remixicon/fonts/remixicon.css';

type IconOnlyButtonVariant = 'primary' | 'secondary';

interface IconOnlyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    iconClass: string; // Remix Icon class, e.g., 'search-line', 'send-plane-fill'
    variant?: IconOnlyButtonVariant;
    disabled?: boolean;
}

export const IconOnlyButton: FC<IconOnlyButtonProps> = ({
                                                     iconClass,
                                                     variant = 'primary',
                                                     disabled = false,
                                                     onClick,
                                                     ...props
                                                 }) => {
    const className = `icon-only-button ${variant === 'secondary' ? 'icon-only-button--secondary' : ''}`;

    return (
        <button
            {...props}
            className={className}
            disabled={disabled}
            onClick={onClick}
            aria-disabled={disabled}
            aria-label="icon-only button"
        >
            <i className={`ri-${iconClass}`}></i>
        </button>
    );
};
