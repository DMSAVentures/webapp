import React from "react";
import './option.scss';

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
    return (
        (<div
            key={props.value}
            className={`dropdown-option ${props.selected ? 'dropdown-option--selected' : ''} ${props.disabled ? 'dropdown-option--disabled' : ''}`}
            onClick={() => props.onClick(props)}
        >
            {props.imgSrc && <img src={props.imgSrc} alt={props.label} className={`dropdown-option__img dropdown-option__img--${props.size}`}/>}
            {props.icon && <i className={`dropdown-option__icon ${props.icon}`}/>}
            <div className={'dropdown-option__text'}>
                <div className={'dropdown-option__text__label'}>
                    <span>{props.label}</span>
                    {props.sublabel && <span className={'dropdown-option__text__sublabel'}>{props.sublabel}</span>}
                </div>
                {props.description &&
                    <span className={`dropdown-option__text__description dropdown-option__text__description--${props.size}`}>{props.description}</span>}
            </div>

      </div>)
    )
}

export default DropdownOption;
