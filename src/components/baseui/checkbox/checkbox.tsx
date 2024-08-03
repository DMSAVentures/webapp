import React, {useEffect} from 'react';
import './checkbox.scss';
import 'remixicon/fonts/remixicon.css';
interface CheckboxProps extends React.HTMLAttributes<HTMLInputElement>{
    size: 'small' | 'x-small';
    disabled?: boolean;
    checked?: 'checked' | 'unchecked' | 'indeterminate';
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Checkbox: React.FC<CheckboxProps> = (props): JSX.Element => {
    const [checked, setChecked] = React.useState(props.checked === 'checked');
    const [isIndeterminate, setIsIndeterminate] = React.useState(props.checked === 'indeterminate');

    useEffect(() => {
        setChecked(props.checked === 'checked');
        setIsIndeterminate(props.checked === 'indeterminate');
    }, [props.checked]);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isIndeterminate) {
            return;
        }
        setChecked(event.target.checked);
        if (props.onChange) {
            props.onChange(event);
        }
    }
    return (
        <div className="checkbox-container">
            <input type="checkbox" id="checkbox" className="custom-checkbox-input" disabled={props.disabled} checked={checked} onChange={handleChange}/>
            <label htmlFor="checkbox" className={`custom-checkbox-label ${checked ? 'checked' : ''} ${isIndeterminate ? 'indeterminate' : ''} ${props.disabled ? 'disabled' : ''}`}>
                {checked ? <i className="checkbox__icon ri-check-fill"></i> : null}
                {isIndeterminate ? <i className="checkbox__icon ri-subtract-fill"></i> : null}
            </label>
        </div>

    );
}

export default Checkbox;
