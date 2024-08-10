import React from "react";
import "./hinttext.scss";
interface HintTextProps {
    hintText: string;
    state: 'default' | 'error' | 'disabled' | 'hide';
}
const HintText: React.FC<HintTextProps> = (props): JSX.Element => {
    return (
        <div className={`hint-text hint-text--${props.state}`}>
            <i className="hint-text__tooltip ri-information-fill"/>
            <span>{props.hintText}</span>
        </div>)
}

export default HintText;
