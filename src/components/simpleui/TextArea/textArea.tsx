import React from 'react';
import styles from './text-area.module.scss';
import Label from "@/components/simpleui/label/label";
import HintText from "@/components/simpleui/hinttext/hinttext";

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
        props.onChange?.(event);
    }
    let unfullfilledCharacters = Boolean((props.maxLength && charCount > props.maxLength) ||
        (props.minLength && charCount < props.minLength))

    return (
        <div className={`${styles['text-area']} ${props.error ? styles['text-area--error'] : ''}`}>
            {props.label ? <Label text={props.label} required={props.required} subText={!props.required ? 'Optional' : ''}/> : null }
            <textarea {...props}  onChange={handleChange}/>
            {props.minLength || props.maxLength ? (
                <small className={`${styles['text-area__character-count']} ${unfullfilledCharacters ? styles['text-area__character-count--error'] : ''}`}>
                    {charCount} of {props.minLength || 0}-{props.maxLength} characters
                </small>
            ) : null}
            {props.hint && <HintText hintText={props.hint} state={props.error ? 'error' : 'default'}/>}
        </div>
    );
}
