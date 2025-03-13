import React from "react";
import styles from './option.module.scss';
import Image from 'next/image';

export interface DropdownOptionProps {
    value: string;
    label: string;
    sublabel?: string;
    imgSrc?: string;
    icon?: string;
    description?: string;
    size: 'small' | 'medium';
    onClick: (props: DropdownOptionProps) => void;
    selected?: boolean;
    disabled?: boolean;
}

const DropdownOption: React.FC<DropdownOptionProps> = (props) => {
    const optionClass = `
        ${styles['dropdown-option']} 
        ${props.selected ? styles['dropdown-option--selected'] : ''} 
        ${props.disabled ? styles['dropdown-option--disabled'] : ''}
    `.trim();

    const handleClick = () => {
        if (!props.disabled) {
            props.onClick(props);
        }
    };

    return (
        <div
            key={props.value}
            className={optionClass}
            onClick={handleClick}
            role="option"
            aria-selected={props.selected}
            aria-disabled={props.disabled}
            tabIndex={props.disabled ? -1 : 0}
        >
            {props.imgSrc && (
                <Image 
                    src={props.imgSrc} 
                    alt={props.label} 
                    width={24}
                    height={24}
                    className={`${styles['dropdown-option__img']} ${styles[`dropdown-option__img--${props.size}`]}`}
                />
            )}
            {props.icon && <i className={`${styles['dropdown-option__icon']} ${props.icon}`}/>}
            <div className={styles['dropdown-option__text']}>
                <div className={styles['dropdown-option__text__label']}>
                    <span>{props.label}</span>
                    {props.sublabel && (
                        <span className={styles['dropdown-option__text__sublabel']}>
                            {props.sublabel}
                        </span>
                    )}
                </div>
                {props.description && (
                    <span className={`${styles['dropdown-option__text__description']} ${styles[`dropdown-option__text__description--${props.size}`]}`}>
                        {props.description}
                    </span>
                )}
            </div>
        </div>
    );
};

export default DropdownOption;
