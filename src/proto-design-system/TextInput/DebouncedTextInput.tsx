/**
 * DebouncedTextInput Component
 * A TextInput wrapper that debounces onChange events
 */

import { memo, useEffect, useState } from "react";
import { TextInput, type TextInputProps } from "./textInput";

export interface DebouncedTextInputProps
	extends Omit<TextInputProps, "onChange"> {
	/** Debounced change handler - called after delay */
	onChange: (value: string) => void;
	/** Debounce delay in milliseconds (default: 300) */
	delay?: number;
}

/**
 * TextInput with built-in debouncing for the onChange handler.
 * Updates the UI immediately but delays the onChange callback.
 */
export const DebouncedTextInput = memo<DebouncedTextInputProps>(
	function DebouncedTextInput({
		value: externalValue,
		onChange,
		delay = 300,
		...props
	}) {
		const [internalValue, setInternalValue] = useState(externalValue ?? "");

		// Sync with external value changes (e.g., on reset)
		useEffect(() => {
			setInternalValue(externalValue ?? "");
		}, [externalValue]);

		// Debounce the onChange callback
		useEffect(() => {
			const timer = setTimeout(() => {
				if (internalValue !== externalValue) {
					onChange(internalValue as string);
				}
			}, delay);

			return () => clearTimeout(timer);
		}, [internalValue, delay, onChange, externalValue]);

		return (
			<TextInput
				{...props}
				value={internalValue}
				onChange={(e) => setInternalValue(e.target.value)}
			/>
		);
	},
);

DebouncedTextInput.displayName = "DebouncedTextInput";
