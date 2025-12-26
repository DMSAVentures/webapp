import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./dropdown.module.scss";
import "remixicon/fonts/remixicon.css";
import DropdownOption, {
	DropdownOptionProps,
} from "@/proto-design-system/dropdown/option.tsx";

// Simplified option type for external use (without internal props)
export interface DropdownOptionInput {
	value: string;
	label: string;
	sublabel?: string;
	imgSrc?: string;
	icon?: string;
	description?: string;
	selected?: boolean;
	disabled?: boolean;
}

interface DropdownProps {
	options: DropdownOptionInput[];
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
	onChange?: (option: DropdownOptionInput) => void;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] =
		useState<DropdownOptionInput | null>(null);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleOpen = () => {
		if (!props.disabled) {
			setIsOpen(!isOpen);
			if (!isOpen) {
				// Reset highlighted index when opening
				const selectedIdx = props.options.findIndex(
					(opt) => opt.value === selectedOption?.value,
				);
				setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0);
			}
		}
	};

	const handleOptionClick = (option: DropdownOptionProps) => {
		// Convert back to DropdownOptionInput for external callback
		const inputOption: DropdownOptionInput = {
			value: option.value,
			label: option.label,
			sublabel: option.sublabel,
			imgSrc: option.imgSrc,
			icon: option.icon,
			description: option.description,
			selected: option.selected,
			disabled: option.disabled,
		};
		setSelectedOption(inputOption);
		setIsOpen(false);
		props.onChange?.(inputOption);
	};

	// Keyboard navigation handler
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (props.disabled) return;

			if (!isOpen) {
				// Open dropdown on Enter, Space, or Arrow keys
				if (
					e.key === "Enter" ||
					e.key === " " ||
					e.key === "ArrowDown" ||
					e.key === "ArrowUp"
				) {
					e.preventDefault();
					setIsOpen(true);
					const selectedIdx = props.options.findIndex(
						(opt) => opt.value === selectedOption?.value,
					);
					setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0);
				}
				return;
			}

			// Dropdown is open - handle navigation
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					e.stopPropagation();
					setHighlightedIndex((prev) => {
						let next = prev + 1;
						// Skip disabled options
						while (
							next < props.options.length &&
							props.options[next]?.disabled
						) {
							next++;
						}
						return next < props.options.length ? next : prev;
					});
					break;
				case "ArrowUp":
					e.preventDefault();
					e.stopPropagation();
					setHighlightedIndex((prev) => {
						let next = prev - 1;
						// Skip disabled options
						while (next >= 0 && props.options[next]?.disabled) {
							next--;
						}
						return next >= 0 ? next : prev;
					});
					break;
				case "Enter":
				case " ":
					e.preventDefault();
					e.stopPropagation();
					if (
						highlightedIndex >= 0 &&
						highlightedIndex < props.options.length
					) {
						const option = props.options[highlightedIndex];
						if (!option.disabled) {
							handleOptionClick({
								...option,
								size: "small",
								onClick: () => {},
							});
						}
					}
					break;
				case "Escape":
					e.preventDefault();
					e.stopPropagation();
					setIsOpen(false);
					break;
				case "Tab":
					// Allow tab to close dropdown and move focus
					setIsOpen(false);
					break;
				case "Home":
					e.preventDefault();
					// Find first non-disabled option
					for (let i = 0; i < props.options.length; i++) {
						if (!props.options[i].disabled) {
							setHighlightedIndex(i);
							break;
						}
					}
					break;
				case "End":
					e.preventDefault();
					// Find last non-disabled option
					for (let i = props.options.length - 1; i >= 0; i--) {
						if (!props.options[i].disabled) {
							setHighlightedIndex(i);
							break;
						}
					}
					break;
			}
		},
		[
			isOpen,
			props.disabled,
			props.options,
			highlightedIndex,
			selectedOption,
			handleOptionClick,
		],
	);

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

	// Initialize selected option from options with selected: true
	useEffect(() => {
		const preselected = props.options.find((option) => option.selected);
		if (preselected && !selectedOption) {
			setSelectedOption(preselected);
		}
	}, [props.options, selectedOption]);

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
					onKeyDown={handleKeyDown}
					role="combobox"
					aria-expanded={isOpen}
					aria-haspopup="listbox"
					aria-controls="dropdown-options"
					aria-disabled={props.disabled}
					aria-activedescendant={
						isOpen && highlightedIndex >= 0
							? `dropdown-option-${highlightedIndex}`
							: undefined
					}
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
						{props.options.map((option, index) => (
							<DropdownOption
								key={option.value}
								id={`dropdown-option-${index}`}
								label={option.label}
								value={option.value}
								onClick={handleOptionClick}
								size={"small"}
								description={option.description}
								disabled={option.disabled}
								sublabel={option.sublabel}
								icon={option.icon}
								imgSrc={option.imgSrc}
								highlighted={index === highlightedIndex}
								onMouseEnter={() => setHighlightedIndex(index)}
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
