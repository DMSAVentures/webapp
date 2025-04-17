import React, { useRef } from "react";
import styles from './toggle.module.scss';

export type ToggleProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Toggle = (props: ToggleProps) => {
    const inputRef = useRef<HTMLInputElement>(null); // Reference to the input element

    const handleDivClick = () => {
        if (inputRef.current) {
            // Programmatically trigger input click event
            inputRef.current.click();
        }
    };

    return (
        <div className={styles.toggle} onClick={handleDivClick}>
            <input ref={inputRef} type="checkbox" {...props}/>
            <span className={styles.slider}></span>
        </div>
    );
};
