import React from "react";
import "./hinttext.scss";
import "remixicon/fonts/remixicon.css";

interface HintTextProps {
    hintText: string;
    state: 'default' | 'error' | 'disabled'
    hide?: boolean;
}
const HintText: React.FC<HintTextProps> = (props) => {
    if (props.hide) {
        return null;
    }

    return (
        <div className={`hint-text hint-text--${props.state} ${props.hide ? 'hint-text--hide' : ''}`}>
            <i className="hint-text__tooltip ri-information-fill"/>
            <small>{props.hintText}</small>
        </div>)
}

export default HintText;
