import React, { JSX, useId } from "react";
import styles from "./checkbox.module.scss";
import "remixicon/fonts/remixicon.css";
export interface CheckboxProps extends React.HTMLAttributes<HTMLInputElement> {
	disabled?: boolean;
	checked?: "checked" | "unchecked";
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const Checkbox: React.FC<CheckboxProps> = (props): JSX.Element => {
	const checkboxId = useId();
	const [checked, setChecked] = React.useState<boolean>(
		props.checked === "checked",
	);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (props.disabled) {
			event.preventDefault();
			return;
		}

		setChecked(() => !checked);

		if (props.onChange) {
			props.onChange(event);
		}
	};
	return (
		<div>
			<input
				type="checkbox"
				id={checkboxId}
				className={styles["custom-checkbox-input"]}
				disabled={props.disabled}
				checked={checked}
				onChange={handleChange}
			/>
			{/*<label htmlFor={checkboxId} className={`custom-checkbox-label ${checked ? 'checked' : ''} ${isIndeterminate ? 'indeterminate' : ''} ${props.disabled ? 'disabled' : ''}`}>*/}
			{/*    /!*{checked ? <i className="checkbox__icon ri-check-fill"></i> : null}*!/*/}
			{/*    {isIndeterminate ? <i className="checkbox__icon ri-subtract-fill"></i> : null}*/}
			{/*</label>*/}
		</div>
	);
};

export default Checkbox;
