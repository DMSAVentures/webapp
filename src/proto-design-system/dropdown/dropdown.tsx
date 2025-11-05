import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./dropdown.module.scss";
import "remixicon/fonts/remixicon.css";
import DropdownOption, {
	DropdownOptionProps,
} from "@/proto-design-system/dropdown/option.tsx";

interface DropdownProps {
	options: DropdownOptionProps[];
	placeholderText: string;
	size: "medium" | "small" | "x-small";
	optional?: boolean;
	tooltip?: string;
	label?: string;
	hintText?: string;
	badge?: string;
	leftIcon?: string;
	disabled?: boolean;
	error?: string;
	onChange?: (option: DropdownOptionProps) => void;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] =
		useState<DropdownOptionProps | null>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleOpen = () => {
		if (!props.disabled) {
			setIsOpen(!isOpen);
		}
	};

	const handleOptionClick = (option: DropdownOptionProps) => {
		setSelectedOption(option);
		setIsOpen(false);
		props.onChange?.(option);
	};

	const handleClickOutside = useCallback((event: Event) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [handleClickOutside]);

	// Generate CSS class names
	const dropdownClass = `${styles.dropdown} ${styles[`dropdown--${props.size}`]}`;
	const selectContainerClass = `${styles["dropdown__select-container"]} 
        ${isOpen ? styles["dropdown__select-container--open"] : ""} 
        ${props.disabled ? styles["dropdown__select-container--disabled"] : ""} 
        ${props.error ? styles["dropdown__select-container--error"] : ""}`.trim();

	const hintClass = props.error
		? `${styles["dropdown__hint"]} ${styles["dropdown__hint--error"]}`
		: `${styles["dropdown__hint"]} ${isOpen ? styles["dropdown__hint--hide"] : ""}`;

	return (
		<div className={dropdownClass} ref={dropdownRef}>
			<div className={styles["dropdown__label-container"]}>
				{props.label && (
					<label className={styles["dropdown__label"]}>{props.label}</label>
				)}
				{props.optional && (
					<label className={styles["dropdown__optional"]}>(Optional)</label>
				)}
				{props.tooltip && (
					<i className={`${styles["dropdown__tooltip"]} ri-information-line`} />
				)}
			</div>
			<div className={selectContainerClass}>
				<div
					className={styles["dropdown__select"]}
					onClick={toggleOpen}
					role="combobox"
					aria-expanded={isOpen}
					aria-haspopup="listbox"
					aria-controls="dropdown-options"
					aria-disabled={props.disabled}
					tabIndex={props.disabled ? -1 : 0}
				>
					{props.leftIcon && (
						<i className={`${styles["dropdown__icon"]} ${props.leftIcon}`} />
					)}
					<div className={styles["dropdown__select__text"]}>
						{selectedOption ? selectedOption.label : props.placeholderText}
					</div>
					{isOpen ? (
						<i className={`${styles["dropdown__icon"]} ri-arrow-up-s-line`} />
					) : (
						<i className={`${styles["dropdown__icon"]} ri-arrow-down-s-line`} />
					)}
				</div>
				{isOpen && (
					<div
						className={styles["dropdown__options-container"]}
						role="listbox"
						id="dropdown-options"
					>
						{props.options.map((option) => (
							<DropdownOption
								key={option.value}
								label={option.label}
								value={option.value}
								onClick={handleOptionClick}
								size={"small"}
								description={option.description}
								disabled={option.disabled}
								sublabel={option.sublabel}
								icon={option.icon}
								imgSrc={option.imgSrc}
							/>
						))}
					</div>
				)}
			</div>
			{props.hintText && (
				<div className={hintClass}>{props.error || props.hintText}</div>
			)}
		</div>
	);
};

export default Dropdown;
