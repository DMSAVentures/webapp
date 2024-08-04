import React, {useEffect} from 'react';
import './radio.scss';
import 'remixicon/fonts/remixicon.css';
export interface RadioProps extends React.HTMLAttributes<HTMLInputElement>{
    disabled?: boolean;
    checked?: 'checked' | 'unchecked';
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Radio: React.FC<RadioProps> = (props): JSX.Element => {
    const [checked, setChecked] = React.useState(props.checked === 'checked');

    useEffect(() => {
        setChecked(props.checked === 'checked');
    }, [props.checked]);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        if (props.onChange) {
            props.onChange(event);
        }
    }
    return (
        <div className={`radio-container radio-container--small`}>
            <input type="radio" id="radio" className="custom-radio-input" disabled={props.disabled} checked={checked} onChange={handleChange}/>
            <label htmlFor="radio" className={`custom-radio-label ${checked ? 'checked' : ''} ${props.disabled ? 'disabled' : ''}`}>
                {checked ? <i className="radio__icon ri-circle-fill"></i> : null}
            </label>
        </div>

    );
}

export default Radio;
