import React from "react";
import styles from "./hinttext.module.scss";
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

    const classNames = [
        styles['hint-text'],
        props.state === 'error' && styles['hint-text--error'],
        props.state === 'disabled' && styles['hint-text--disabled'],
        props.hide && styles['hint-text--hide']
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames}>
            <i className={`${styles['hint-text__tooltip']} ri-information-fill`}/>
            <small>{props.hintText}</small>
        </div>)
}

export default HintText;
