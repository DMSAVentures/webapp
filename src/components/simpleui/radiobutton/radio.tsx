import React from 'react';
import './radio.scss';
import 'remixicon/fonts/remixicon.css';
export type RadioProps = React.HTMLProps<HTMLInputElement>
const Radio: React.FC<RadioProps> = (props): JSX.Element => {
    return (
            <input type="radio" className="custom-radio-input" disabled={props.disabled} checked={props.checked} onChange={props.onChange}/>
    );
}

export default Radio;
