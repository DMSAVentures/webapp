import React, {JSX} from "react";
import './label.scss';
import {Badge} from "@/components/simpleui/badge/badge";

export interface LabelProps {
    text: string;
    subText?: string;
    badgeString?: string;
    badgeColour?: "gray" | "blue" | "orange" | "red" | "green" | "purple" | "yellow" | "pink" | "sky" | "teal";
    disabled?: boolean;
    required?: boolean;
}
const Label: React.FC<LabelProps> = (props): JSX.Element => {
    return (
        <div className={`label__container label__container--${props.disabled ? 'disabled' :''}`}>
            <span className={'label__string'}>
                {props.text}
                {props.required && <sup>*</sup>}
            </span>

            {props.subText && <small className={'label__sublabel__string'}>({props.subText})</small>}
            {props.badgeString && <Badge text={props.badgeString} variant={props.badgeColour!} styleType={'lighter'} size={'small'}
                                   disabled={props.disabled}/>}
        </div>
    )
}

export default Label;
