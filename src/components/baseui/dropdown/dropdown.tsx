import React, {MouseEvent, useEffect, useRef, useState} from "react";
import './dropdown.scss';
import 'remixicon/fonts/remixicon.css';

interface Option {
    value: string;
    label: string;
}

interface DropdownProps {
    options: Option[];
    placeholderText: string;
    size: 'medium' | 'small' | 'x-small';
    optional?: boolean;
    tooltip?: string;
    label?: string;
    hintText?: string;
    badge?: string;
    leftIcon?: string;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const selectRef = useRef<HTMLDivElement>(null);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleOptionClick = (option: Option) => {
        console.log("Option clicked:", option);
        setSelectedOption(option);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    console.log("Selected Option:", selectedOption);

    return (<div className={`dropdown dropdown--${props.size}`}>
            <div className="dropdown__label-container">
                {props.label && <label className="dropdown__label">{props.label}</label>}
                {props.optional && <label className="dropdown__optional">(Optional)</label>}
                {props.tooltip && <i className="dropdown__tooltip ri-information-line"/>}
            </div>
            <div className={`dropdown__select-container dropdown__select-container--${isOpen ? 'open' : ''}`} ref={selectRef}>
                <div className="dropdown__select" onClick={toggleOpen}>
                    {props.leftIcon && <i className={`dropdown__icon ${props.leftIcon}`}/>}
                    <div className="dropdown__select__text">
                        {selectedOption ? selectedOption.label : props.placeholderText}
                    </div>
                    <i className="dropdown__icon ri-arrow-down-s-line"/>
                </div>
                {isOpen && (<div className="dropdown__options-container">
                        {props.options.map((option) => (<span
                                key={option.value}
                                className={`dropdown-option ${selectedOption && selectedOption.value === option.value ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(option)}
                            >
                {option.label}
              </span>))}
                    </div>)}
            </div>
            {props.hintText &&
                <div className={`dropdown__hint dropdown__hint--${isOpen ? 'hide' : ''}`}>
                    <i className="dropdown__tooltip ri-information-fill"/>
                    <span className={`dropdown__hint__text`}>{props.hintText}</span>
                </div>}
    </div>);
};

export default Dropdown;
