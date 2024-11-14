import React, {useId} from "react";
import Label from "@/components/simpleui/label/label";
import './slider.scss';
interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    min: number;
    max: number;
    value: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    step: number;
    label: string;
    optional?: boolean;
}
const Slider = (props: SliderProps) => {
    const [value, setValue] = React.useState(props.value);
    const Id = useId()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value));
        props.onChange(event);
    }

    return (
        <div className={`slider`}>
            <div className={'slider__label'}>
                <Label text={props.label} required={!props.optional}/>
                <Label text={value.toString()}/>
            </div>
            <input
                id={Id}
                className={`slider__input`}
                type="range"
                {...props}
                min={props.min}
                max={props.max}
                value={value}
                onChange={handleChange}
                step={props.step}
            />
        </div>
    );
}

export default Slider;
