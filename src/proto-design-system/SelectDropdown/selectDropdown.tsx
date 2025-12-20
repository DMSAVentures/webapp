/**
 * SelectDropdown Component
 * A flexible dropdown component supporting single or multi-select with checkboxes
 */

import {
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Checkbox from "@/proto-design-system/checkbox/checkbox";
import styles from "./selectDropdown.module.scss";

export interface SelectOption {
	/** Option value */
	value: string;
	/** Display label */
	label: string;
	/** Whether option is disabled */
	disabled?: boolean;
}

interface BaseSelectDropdownProps {
	/** Available options */
	options: SelectOption[];
	/** Placeholder text when no selection */
	placeholder?: string;
	/** Label for the dropdown */
	label?: string;
	/** Whether the dropdown is disabled */
	disabled?: boolean;
	/** Size variant */
	size?: "small" | "medium" | "large";
	/** Additional CSS class name */
	className?: string;
}

interface SingleSelectProps extends BaseSelectDropdownProps {
	/** Selection mode */
	mode?: "single";
	/** Currently selected value */
	value?: string;
	/** Change handler for single select */
	onChange?: (value: string | undefined) => void;
}

interface MultiSelectProps extends BaseSelectDropdownProps {
	/** Selection mode */
	mode: "multi";
	/** Currently selected values */
	value?: string[];
	/** Change handler for multi select */
	onChange?: (values: string[]) => void;
}

export type SelectDropdownProps = SingleSelectProps | MultiSelectProps;

/**
 * SelectDropdown - A flexible dropdown with single or multi-select support
 */
export const SelectDropdown = memo<SelectDropdownProps>(
	function SelectDropdown(props) {
		const {
			options,
			placeholder = "Select...",
			label,
			disabled = false,
			size = "medium",
			className: customClassName,
			mode = "single",
		} = props;

		const [isOpen, setIsOpen] = useState(false);
		const dropdownRef = useRef<HTMLDivElement>(null);

		// Get selected values as array for unified handling
		const selectedValues: string[] =
			mode === "multi"
				? ((props as MultiSelectProps).value || [])
				: ((props as SingleSelectProps).value ? [(props as SingleSelectProps).value as string] : []);

		const classNames = [
			styles.root,
			size !== "medium" && styles[`size_${size}`],
			disabled && styles.disabled,
			customClassName,
		]
			.filter(Boolean)
			.join(" ");

		// Handle click outside to close
		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					dropdownRef.current &&
					!dropdownRef.current.contains(event.target as Node)
				) {
					setIsOpen(false);
				}
			};

			if (isOpen) {
				document.addEventListener("mousedown", handleClickOutside);
			}

			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [isOpen]);

		// Handle keyboard navigation
		const handleKeyDown = useCallback(
			(e: React.KeyboardEvent) => {
				if (disabled) return;

				switch (e.key) {
					case "Enter":
					case " ":
						e.preventDefault();
						setIsOpen((prev) => !prev);
						break;
					case "Escape":
						setIsOpen(false);
						break;
				}
			},
			[disabled],
		);

		// Handle option toggle
		const handleOptionClick = useCallback(
			(optionValue: string, optionDisabled?: boolean) => {
				if (optionDisabled) return;

				if (mode === "multi") {
					const multiProps = props as MultiSelectProps;
					const currentValues = multiProps.value || [];
					const newValues = currentValues.includes(optionValue)
						? currentValues.filter((v) => v !== optionValue)
						: [...currentValues, optionValue];
					multiProps.onChange?.(newValues);
				} else {
					const singleProps = props as SingleSelectProps;
					const newValue = singleProps.value === optionValue ? undefined : optionValue;
					singleProps.onChange?.(newValue);
					setIsOpen(false);
				}
			},
			[mode, props],
		);

		// Get display text
		const getDisplayText = () => {
			if (selectedValues.length === 0) return placeholder;

			if (mode === "single" || selectedValues.length === 1) {
				const selectedOption = options.find((o) => o.value === selectedValues[0]);
				return selectedOption?.label || selectedValues[0];
			}

			return `${selectedValues.length} selected`;
		};

		const triggerClassNames = [
			styles.trigger,
			isOpen && styles.triggerOpen,
			selectedValues.length > 0 && styles.triggerHasValue,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<div ref={dropdownRef} className={classNames}>
				{label && <label className={styles.label}>{label}</label>}
				<button
					type="button"
					className={triggerClassNames}
					onClick={() => !disabled && setIsOpen(!isOpen)}
					onKeyDown={handleKeyDown}
					aria-expanded={isOpen}
					aria-haspopup="listbox"
					disabled={disabled}
				>
					<span className={styles.triggerText}>{getDisplayText()}</span>
					<i
						className={`ri-arrow-${isOpen ? "up" : "down"}-s-line ${styles.triggerIcon}`}
						aria-hidden="true"
					/>
				</button>

				{isOpen && (
					<div className={styles.menu} role="listbox" aria-multiselectable={mode === "multi"}>
						{options.map((option) => {
							const isSelected = selectedValues.includes(option.value);
							const itemClassNames = [
								styles.menuItem,
								isSelected && styles.menuItemSelected,
								option.disabled && styles.menuItemDisabled,
							]
								.filter(Boolean)
								.join(" ");

							return (
								<div
									key={option.value}
									className={itemClassNames}
									role="option"
									aria-selected={isSelected}
									aria-disabled={option.disabled}
									onClick={() => handleOptionClick(option.value, option.disabled)}
								>
									{mode === "multi" && (
										<Checkbox
											checked={isSelected ? "checked" : "unchecked"}
											onChange={() => {}}
											disabled={option.disabled}
										/>
									)}
									<span className={styles.menuItemLabel}>{option.label}</span>
									{mode === "single" && isSelected && (
										<i className="ri-check-line" aria-hidden="true" />
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		);
	},
);

SelectDropdown.displayName = "SelectDropdown";
