import React, { useRef} from "react";
import './toggle.scss'

export type ToggleProps =  React.InputHTMLAttributes<HTMLInputElement>;

export const Toggle = (props: ToggleProps) => {
    const inputRef = useRef<HTMLInputElement>(null); // Reference to the input element

    const handleDivClick = () => {
        if (inputRef.current) {
            // Programmatically trigger input click event
            inputRef.current.click();
        }
    };

    return (
        <div className="toggle" onClick={handleDivClick}>
            <input ref={inputRef}  type="checkbox" {...props}/>
            <span className="slider"></span>
        </div>
    );
}
