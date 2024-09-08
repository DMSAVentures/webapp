import React, {useId} from "react";
import './toggle.scss'

type ToggleProps =  React.InputHTMLAttributes<HTMLInputElement>;

export const Toggle = (props: ToggleProps) => {
    const [checked, setChecked] = React.useState(Boolean(props.checked))
    const onChange = (e: React.MouseEvent<HTMLDivElement>) => {
        setChecked(!checked)
        // if (props.onChange) {
        //     props.onChange(e)
        // }
    }

    return (
        <div className="toggle" onClick={onChange}>
            <input type="checkbox" checked={checked} {...props}/>
            <span className="slider"></span>
        </div>
    );
}
