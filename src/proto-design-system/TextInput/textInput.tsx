import React from "react";
import styles from "./text-input.module.scss";
import "remixicon/fonts/remixicon.css";
import HintText from "@/proto-design-system/hinttext/hinttext.tsx";
import Label from "@/proto-design-system/label/label.tsx";

export interface TextInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	hint?: string;
	error?: string;
	leftIcon?: string;
	showLeftIcon?: boolean;
	rightIcon?: string;
	showRightIcon?: boolean;
}

export const TextInput = (props: TextInputProps) => {
	const inputRef = React.createRef<HTMLInputElement>();

	const handleFocus = () => {
		if (inputRef.current !== document.activeElement) {
			inputRef.current?.focus();
		}
	};

	// Destructure custom props to avoid passing them to DOM element
	const {
		label,
		hint,
		error,
		leftIcon,
		showLeftIcon,
		rightIcon,
		showRightIcon,
		...inputProps
	} = props;

	return (
		<div
			className={`${styles["text-input"]} ${error ? styles["text-input--error"] : ""}`}
		>
			{label && <Label text={label} required={inputProps.required} />}
			<div
				className={`${styles["text-input__input-container"]} ${error ? styles["text-input__input-container--error"] : ""} ${inputProps.disabled ? styles["text-input__input-container--disabled"] : ""}`}
				onClick={handleFocus}
			>
				{showLeftIcon && (
					<i
						className={`${styles["text-input__input-container__icon"]} ${styles["text-input__input-container__icon--left"]} ${leftIcon} `}
					/>
				)}
				<input ref={inputRef} {...inputProps} />
				{showRightIcon && (
					<i
						className={`${styles["text-input__input-container__icon"]} ${styles["text-input__input-container__icon--right"]} ${rightIcon} `}
					/>
				)}
			</div>
			{(hint || error) && (
				<div className={styles["text-input__hint"]}>
					<HintText
						hintText={error || hint || ""}
						state={error ? "error" : "default"}
					/>
				</div>
			)}
		</div>
	);
};
