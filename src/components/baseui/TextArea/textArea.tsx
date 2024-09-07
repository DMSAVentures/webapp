import React from 'react';
import './text-area.scss';
import Label from "@/components/baseui/label/label";
import HintText from "@/components/baseui/hinttext/hinttext";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    hint?: string;
    error?: string;
}
export const TextArea = (props: TextAreaProps) => {
    const [charCount, setCharCount] = React.useState(0);
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const charCount = event.target.value.length;
        setCharCount(charCount);
    }
    let unfullfilledCharacters = Boolean((props.maxLength && charCount > props.maxLength) ||
        (props.minLength && charCount < props.minLength))

    return (
        <div className={`text-area ${props.error ? 'text-area--error' : ''}`}>
            <Label text={props.label} required={props.required} subText={!props.required ? 'Optional' : ''}/>
            <textarea {...props}  onChange={handleChange}/>
            {props.minLength || props.maxLength ? (
                <span className={`text-area__character-count ${unfullfilledCharacters ? 'text-area__character-count--error' : ''}`}>
                    {charCount} of {props.minLength || 0}-{props.maxLength} characters
                </span>
            ) : null}
            {props.hint && <HintText hintText={props.hint} state={props.error ? 'error' : 'default'}/>}
        </div>
    );
}
