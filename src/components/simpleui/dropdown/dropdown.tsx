import React, {MouseEvent, useEffect, useRef, useState} from "react";
import './dropdown.scss';
import 'remixicon/fonts/remixicon.css';
import DropdownOption, {DropdownOptionProps} from "@/components/simpleui/dropdown/option";
import HintText from "@/components/simpleui/hinttext/hinttext";


interface DropdownProps {
    options: DropdownOptionProps[];
    placeholderText: string;
    size: 'medium' | 'small' | 'x-small';
    optional?: boolean;
    tooltip?: string;
    label?: string;
    hintText?: string;
    badge?: string;
    leftIcon?: string;
    disabled?: boolean;
    error?: string
}

const Dropdown: React.FC<DropdownProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<DropdownOptionProps | null>(null);
    const selectRef = useRef<HTMLDivElement>(null);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleOptionClick = (option: DropdownOptionProps) => {
        console.log("Option clicked:", option);
        setSelectedOption(option);
        setIsOpen(false);
    };

    const handleClickOutside = (event: Event) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    return (<div className={`dropdown dropdown--${props.size}`}>
            <div className="dropdown__label-container">
                {props.label && <label className="dropdown__label">{props.label}</label>}
                {props.optional && <label className="dropdown__optional">(Optional)</label>}
                {props.tooltip && <i className="dropdown__tooltip ri-information-line"/>}
            </div>
            <div className={`dropdown__select-container dropdown__select-container--${isOpen ? 'open' : ''} dropdown__select-container--${props.disabled ? 'disabled':''} dropdown__select-container--${props.error ? 'error' : ''}`} ref={selectRef}>
                <div className="dropdown__select" onClick={toggleOpen}>
                    {props.leftIcon && <i className={`dropdown__icon ${props.leftIcon}`}/>}
                    <div className="dropdown__select__text">
                        {selectedOption ? selectedOption.label : props.placeholderText}
                    </div>
                    {isOpen ? <i className="dropdown__icon ri-arrow-up-s-line"/> :
                        <i className="dropdown__icon ri-arrow-down-s-line"/>}
                        </div>
                    {isOpen && (<div className="dropdown__options-container">
                        {props.options.map((option) => {
                            return <DropdownOption key={option.value} label={option.label} value={option.value} onClick={handleOptionClick} size={'small'} description={option.description} disabled={option.disabled} sublabel={option.sublabel} icon={option.icon} imgSrc={option.imgSrc}/>;
                        })}
                    </div>)}
            </div>
            {props.hintText &&
                <HintText hintText={props.hintText} state={ props.error ? 'error' : 'default'} hide={isOpen}/>}
    </div>);
};

export default Dropdown;
