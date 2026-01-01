/**
 * OptionsEditor Component
 * Allows editing a list of options with add/remove functionality
 */

import { Plus, Trash2 } from "lucide-react";
import { memo, useCallback, useRef } from "react";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Text } from "@/proto-design-system/components/primitives/Text";
import styles from "./OptionsEditor.module.scss";
import type { OptionsEditorProps } from "./OptionsEditor.types";

/**
 * OptionsEditor allows editing a list of string options
 * with individual input fields, add, and delete functionality.
 */
export const OptionsEditor = memo<OptionsEditorProps>(function OptionsEditor({
	options,
	onChange,
	label = "Options",
	required = false,
	minOptions = 1,
	className,
	...props
}) {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const handleAddOption = useCallback(() => {
		onChange([...options, ""]);
		// Focus the new input after render
		setTimeout(() => {
			const lastIndex = options.length;
			inputRefs.current[lastIndex]?.focus();
		}, 0);
	}, [options, onChange]);

	const handleUpdateOption = useCallback(
		(index: number, value: string) => {
			const newOptions = [...options];
			newOptions[index] = value;
			onChange(newOptions);
		},
		[options, onChange],
	);

	const handleDeleteOption = useCallback(
		(index: number) => {
			if (options.length <= minOptions) return;
			onChange(options.filter((_, i) => i !== index));
		},
		[options, minOptions, onChange],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
			if (e.key === "Enter") {
				e.preventDefault();
				handleAddOption();
			} else if (
				e.key === "Backspace" &&
				options[index] === "" &&
				options.length > minOptions
			) {
				e.preventDefault();
				handleDeleteOption(index);
				// Focus previous input
				setTimeout(() => {
					const prevIndex = Math.max(0, index - 1);
					inputRefs.current[prevIndex]?.focus();
				}, 0);
			}
		},
		[handleAddOption, handleDeleteOption, options, minOptions],
	);

	const canDelete = options.length > minOptions;
	const classNames = [styles.root, className].filter(Boolean).join(" ");

	return (
		<div className={classNames} {...props}>
			<div className={styles.label}>
				<Text as="label" size="sm" weight="medium">
					{label}
				</Text>
				{required && <span className={styles.required}>*</span>}
			</div>

			<div className={styles.optionsList}>
				{options.map((option, index) => (
					<div key={index} className={styles.optionRow}>
						<Input
							ref={(el) => {
								inputRefs.current[index] = el;
							}}
							className={styles.optionInput}
							value={option}
							onChange={(e) => handleUpdateOption(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(e, index)}
							placeholder={`Option ${index + 1}`}
							aria-label={`Option ${index + 1}`}
						/>
						<Button
							variant="ghost"
							size="sm"
							className={styles.deleteButton}
							onClick={() => handleDeleteOption(index)}
							disabled={!canDelete}
							aria-label={`Delete option ${index + 1}`}
						>
							<Trash2 size={16} />
						</Button>
					</div>
				))}
			</div>

			<Button
				variant="secondary"
				size="sm"
				className={styles.addButton}
				onClick={handleAddOption}
				leftIcon={<Plus size={16} />}
			>
				Add Option
			</Button>

			<Text className={styles.helperText} size="sm">
				Press Enter to add a new option
			</Text>
		</div>
	);
});

OptionsEditor.displayName = "OptionsEditor";
