import React from 'react'
import './text-input.scss'
import 'remixicon/fonts/remixicon.css'
import HintText from "@/components/baseui/hinttext/hinttext";
import Label from "@/components/baseui/label/label";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    hint?: string;
    error?: string;
    leftIcon?: string;
    showLeftIcon?: boolean;
    rightIcon?: string;
    showRightIcon?: boolean;

}

export const TextInput = (props: TextInputProps) => {
    const inputRef = React.createRef<HTMLInputElement>();

    const handleFocus = () => {
        if (inputRef.current !== document.activeElement) {
            inputRef.current?.focus();
        }
    }
    return (
        <div className={`text-input ${props.error ? 'text-input--error' : ''}`}>
            <Label text={props.label} required={props.required} />
            <div className={`text-input__input-container ${props.error ? 'text-input__input-container--error' : ''} ${props.disabled ? 'text-input__input-container--disabled' : ''}`} onClick={handleFocus}>
                {props.showLeftIcon && <i className={`text-input__input-container__icon text-input__input-container__icon--left ${props.leftIcon} `}/>}
                <input ref={inputRef} {...props}/>
                {props.showRightIcon && <i className={`text-input__input-container__icon text-input__input-container__icon--right ${props.rightIcon} `}/>}
            </div>
            <div className={'text-input__hint'}>
                {!props.error && props.hint && <HintText hintText={props.hint} state={props.error ? 'error' : 'default'}/>}
                {props.error && <HintText hintText={props.error} state={props.error ? 'error' : 'default'}/>}
            </div>
        </div>
    );
}
