import React from "react";
import './option.scss';

export interface DropdownOptionProps {
    value: string;
    label: string;
    imgSrc?: string;
    description?: string;
    size: 'small' | 'medium';
    onClick: (props: DropdownOptionProps) => void;
    selected?: boolean;
}

const DropdownOption: React.FC<DropdownOptionProps> = (props) => {
    return (
        (<div
            key={props.value}
            className={`dropdown-option dropdown-option--${props.selected ? 'selected' : ''}`}
            onClick={() => props.onClick(props)}
        >
            {props.imgSrc && <img src={props.imgSrc} alt={props.label} className={`dropdown-option__img dropdown-option__img--${props.size}`}/>}
            <div className={'dropdown-option__text'}>
                <span className={'dropdown-option__text__label'}>{props.label}</span>
                {props.description && <span className={`dropdown-option__text__description dropdown-option__text__description--${props.size}`}>{props.description}</span>}
            </div>

      </div>)
    )
}

export default DropdownOption;
