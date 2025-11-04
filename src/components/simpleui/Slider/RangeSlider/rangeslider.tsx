import React, { useId } from "react";
import Label from "@/components/simpleui/label/label";
import styles from "./rangeslider.module.scss";

interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
	min: number;
	max: number;
	minValue: number;
	maxValue: number;
	minRange: number;
	onMinChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onMaxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	step: number;
	label: string;
	optional?: boolean;
}
const RangeSlider = (props: RangeSliderProps) => {
	const [minValue, setMinValue] = React.useState(props.minValue ?? props.min);
	const [maxValue, setMaxValue] = React.useState(props.maxValue ?? props.max);
	const [activeSlider, setActiveSlider] = React.useState<"min" | "max" | null>(
		null,
	);
	const maxId = useId();
	const minId = useId();

	const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newMin = Number(event.target.value);
		if (newMin > maxValue - (props.minRange ?? 1)) {
			return;
		}
		setMinValue(Number(event.target.value));
		props.onMinChange(event);
	};

	const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newMax = Number(event.target.value);
		if (newMax < minValue + (props.minRange ?? 1)) {
			return;
		}
		setMaxValue(Number(event.target.value));
		props.onMaxChange(event);
	};

	const handleMinMouseDown = () => {
		setActiveSlider("min");
	};

	const handleMaxMouseDown = () => {
		setActiveSlider("max");
	};

	return (
		<>
			<div className={styles["rangeslider"]}>
				<div className={styles["rangeslider__label"]}>
					<Label text={props.label} required={!props.optional} />
					<Label text={`${minValue.toString()} - ${maxValue.toString()}`} />
				</div>
				<div className={styles["rangeslider__container"]}>
					<div
						className={styles["rangeslider__range"]}
						style={{
							left: `${minValue}%`,
							right: `${100 - (maxValue / props.max) * 100}%`,
						}}
					></div>
					<input
						id={minId}
						className={`${styles["rangeslider__input"]} ${styles["rangeslider__input--min"]} ${activeSlider === "min" ? styles["rangeslider__input--active"] : ""}`}
						type="range"
						{...props}
						min={props.min}
						max={props.max}
						value={minValue}
						onChange={handleMinChange}
						onMouseDown={handleMinMouseDown}
						onTouchStart={handleMinMouseDown}
						step={props.step}
					/>
					<input
						id={maxId}
						className={`${styles["rangeslider__input"]} ${styles["rangeslider__input--max"]} ${activeSlider === "max" ? styles["rangeslider__input--active"] : ""}`}
						type="range"
						{...props}
						min={props.min}
						max={props.max}
						value={maxValue}
						onChange={handleMaxChange}
						onMouseDown={handleMaxMouseDown}
						onTouchStart={handleMaxMouseDown}
						step={props.step}
					/>
				</div>
			</div>
		</>
	);
};

export default RangeSlider;
