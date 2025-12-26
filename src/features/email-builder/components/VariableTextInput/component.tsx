/**
 * VariableTextInput Component
 * A text input that displays {{variables}} as visual chips
 * Uses textarea + highlight overlay approach for native undo/redo support
 */

import {
	type ChangeEvent,
	type HTMLAttributes,
	type KeyboardEvent,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { TEMPLATE_VARIABLES } from "@/features/campaigns/constants/defaultEmailTemplates";
import styles from "./component.module.scss";

export interface VariableTextInputProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Current value (plain text with {{variable}} syntax) */
	value: string;
	/** Change handler */
	onChange: (value: string) => void;
	/** Label text */
	label?: string;
	/** Placeholder text */
	placeholder?: string;
	/** Hint text below input */
	hint?: string;
	/** Error message */
	error?: string;
	/** Whether input is disabled */
	disabled?: boolean;
	/** Email type for filtering variables */
	emailType?: "verification" | "welcome";
	/** Additional CSS class name */
	className?: string;
}

/**
 * Parse text and return segments (text vs variable)
 */
interface Segment {
	type: "text" | "variable";
	content: string;
}

function parseTextToSegments(text: string): Segment[] {
	const segments: Segment[] = [];
	const regex = /\{\{(\w+)\}\}/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null = null;

	match = regex.exec(text);
	while (match !== null) {
		if (match.index > lastIndex) {
			segments.push({
				type: "text",
				content: text.slice(lastIndex, match.index),
			});
		}
		segments.push({
			type: "variable",
			content: match[1],
		});
		lastIndex = regex.lastIndex;
		match = regex.exec(text);
	}

	if (lastIndex < text.length) {
		segments.push({
			type: "text",
			content: text.slice(lastIndex),
		});
	}

	return segments;
}

/**
 * VariableTextInput provides a rich editing experience with variable chips
 * Type @ to insert variables via autocomplete
 */
export const VariableTextInput = memo<VariableTextInputProps>(
	function VariableTextInput({
		value,
		onChange,
		label,
		placeholder,
		hint,
		error,
		disabled = false,
		emailType = "verification",
		className: customClassName,
		...props
	}) {
		const inputRef = useRef<HTMLInputElement>(null);
		const menuRef = useRef<HTMLDivElement>(null);
		const [isFocused, setIsFocused] = useState(false);

		// @ mention state
		const [mentionQuery, setMentionQuery] = useState<string | null>(null);
		const [mentionStartIndex, setMentionStartIndex] = useState<number>(-1);
		const [selectedIndex, setSelectedIndex] = useState(0);

		// Filter variables based on email type
		const availableVariables = TEMPLATE_VARIABLES.filter(
			(v) => emailType === "verification" || v.name !== "verification_link",
		);

		// Filter variables based on mention query
		const filteredVariables =
			mentionQuery !== null
				? availableVariables.filter((v) =>
						v.name.toLowerCase().includes(mentionQuery.toLowerCase()),
					)
				: availableVariables;

		// Parse value into segments for rendering the highlight layer
		const segments = parseTextToSegments(value);

		// Check for @ mention trigger based on current input value and cursor position
		const checkForMention = useCallback(
			(text: string, cursorPos: number) => {
				const textBeforeCursor = text.slice(0, cursorPos);

				// Find the last @ that could be a mention trigger
				// Match @ followed by word characters (the query)
				const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

				if (mentionMatch) {
					const query = mentionMatch[1];
					const atIndex = cursorPos - mentionMatch[0].length;
					setMentionQuery(query);
					setMentionStartIndex(atIndex);
					setSelectedIndex(0);
				} else {
					setMentionQuery(null);
					setMentionStartIndex(-1);
				}
			},
			[],
		);

		// Handle input changes
		const handleChange = useCallback(
			(e: ChangeEvent<HTMLInputElement>) => {
				const newValue = e.target.value;
				const cursorPos = e.target.selectionStart || 0;
				onChange(newValue);
				checkForMention(newValue, cursorPos);
			},
			[onChange, checkForMention],
		);

		// Insert variable, replacing @query if present
		const insertVariable = useCallback(
			(varName: string) => {
				if (!inputRef.current) return;

				const input = inputRef.current;
				const cursorPos = input.selectionStart || 0;

				let newValue: string;
				let newCursorPos: number;

				if (mentionStartIndex >= 0) {
					// Replace @query with {{variable}}
					const before = value.slice(0, mentionStartIndex);
					const after = value.slice(cursorPos);
					const insertion = `{{${varName}}} `;
					newValue = before + insertion + after;
					newCursorPos = mentionStartIndex + insertion.length;
				} else {
					// Just insert at cursor
					const before = value.slice(0, cursorPos);
					const after = value.slice(cursorPos);
					const insertion = `{{${varName}}} `;
					newValue = before + insertion + after;
					newCursorPos = cursorPos + insertion.length;
				}

				onChange(newValue);
				setMentionQuery(null);
				setMentionStartIndex(-1);

				// Restore focus and cursor position
				requestAnimationFrame(() => {
					input.focus();
					input.setSelectionRange(newCursorPos, newCursorPos);
				});
			},
			[value, onChange, mentionStartIndex],
		);

		// Handle keyboard navigation in mention menu + atomic variable deletion
		const handleKeyDown = useCallback(
			(e: KeyboardEvent<HTMLInputElement>) => {
				// Handle mention menu navigation
				if (mentionQuery !== null && filteredVariables.length > 0) {
					if (e.key === "ArrowDown") {
						e.preventDefault();
						setSelectedIndex((prev) =>
							prev < filteredVariables.length - 1 ? prev + 1 : 0,
						);
						return;
					}
					if (e.key === "ArrowUp") {
						e.preventDefault();
						setSelectedIndex((prev) =>
							prev > 0 ? prev - 1 : filteredVariables.length - 1,
						);
						return;
					}
					if (e.key === "Enter" || e.key === "Tab") {
						e.preventDefault();
						insertVariable(filteredVariables[selectedIndex].name);
						return;
					}
					if (e.key === "Escape") {
						e.preventDefault();
						setMentionQuery(null);
						setMentionStartIndex(-1);
						return;
					}
				}

				// Handle atomic variable deletion (Backspace)
				if (e.key === "Backspace" && inputRef.current) {
					const cursorPos = inputRef.current.selectionStart || 0;
					const selectionEnd = inputRef.current.selectionEnd || 0;

					// Only handle if no text is selected (cursor is collapsed)
					if (cursorPos === selectionEnd && cursorPos > 0) {
						// Check if cursor is right after }} (with optional trailing space) or inside a variable
						const textBefore = value.slice(0, cursorPos);
						// Match variable with optional trailing space
						const varEndMatch = textBefore.match(/\{\{(\w+)\}\}\s?$/);

						if (varEndMatch) {
							// Cursor is right after a complete variable (or its trailing space) - delete the whole thing
							e.preventDefault();
							const varStart = cursorPos - varEndMatch[0].length;
							const newValue = value.slice(0, varStart) + value.slice(cursorPos);
							onChange(newValue);
							requestAnimationFrame(() => {
								inputRef.current?.setSelectionRange(varStart, varStart);
							});
							return;
						}

						// Check if cursor is inside a variable
						const varPattern = /\{\{(\w+)\}\}/g;
						let match;
						while ((match = varPattern.exec(value)) !== null) {
							const varStart = match.index;
							const varEnd = match.index + match[0].length;
							if (cursorPos > varStart && cursorPos <= varEnd) {
								// Cursor is inside this variable - delete the whole thing
								e.preventDefault();
								const newValue = value.slice(0, varStart) + value.slice(varEnd);
								onChange(newValue);
								requestAnimationFrame(() => {
									inputRef.current?.setSelectionRange(varStart, varStart);
								});
								return;
							}
						}
					}
				}

				// Handle atomic variable deletion (Delete key)
				if (e.key === "Delete" && inputRef.current) {
					const cursorPos = inputRef.current.selectionStart || 0;
					const selectionEnd = inputRef.current.selectionEnd || 0;

					// Only handle if no text is selected
					if (cursorPos === selectionEnd && cursorPos < value.length) {
						// Check if cursor is right before {{ or inside a variable
						const textAfter = value.slice(cursorPos);
						const varStartMatch = textAfter.match(/^\{\{(\w+)\}\}/);

						if (varStartMatch) {
							// Cursor is right before a variable - delete the whole thing
							e.preventDefault();
							const varEnd = cursorPos + varStartMatch[0].length;
							const newValue = value.slice(0, cursorPos) + value.slice(varEnd);
							onChange(newValue);
							return;
						}

						// Check if cursor is inside a variable
						const varPattern = /\{\{(\w+)\}\}/g;
						let match;
						while ((match = varPattern.exec(value)) !== null) {
							const varStart = match.index;
							const varEnd = match.index + match[0].length;
							if (cursorPos >= varStart && cursorPos < varEnd) {
								// Cursor is inside this variable - delete the whole thing
								e.preventDefault();
								const newValue = value.slice(0, varStart) + value.slice(varEnd);
								onChange(newValue);
								requestAnimationFrame(() => {
									inputRef.current?.setSelectionRange(varStart, varStart);
								});
								return;
							}
						}
					}
				}
			},
			[mentionQuery, filteredVariables, selectedIndex, insertVariable, value, onChange],
		);

		// Also check mention on cursor position change (click, arrow keys)
		const handleSelect = useCallback(() => {
			if (!inputRef.current) return;
			const cursorPos = inputRef.current.selectionStart || 0;
			checkForMention(value, cursorPos);
		}, [value, checkForMention]);

		// Close menu when clicking outside
		useEffect(() => {
			const handleClickOutside = (e: MouseEvent) => {
				if (
					menuRef.current &&
					!menuRef.current.contains(e.target as Node) &&
					inputRef.current &&
					!inputRef.current.contains(e.target as Node)
				) {
					setMentionQuery(null);
					setMentionStartIndex(-1);
				}
			};

			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}, []);

		// Scroll selected item into view when navigating with keyboard
		useEffect(() => {
			if (menuRef.current && mentionQuery !== null) {
				const selectedItem = menuRef.current.querySelector('[aria-selected="true"]');
				if (selectedItem) {
					selectedItem.scrollIntoView({ block: "nearest" });
				}
			}
		}, [selectedIndex, mentionQuery]);

		// Render the highlight layer content
		const renderHighlight = () => {
			return segments.map((seg, index) => {
				if (seg.type === "variable") {
					// Render the full {{variable}} text with styling to maintain cursor alignment
					return (
						<span key={index} className={styles.variable}>
							{`{{${seg.content}}}`}
						</span>
					);
				}
				// Preserve spaces - use non-breaking space for trailing spaces
				return <span key={index}>{seg.content}</span>;
			});
		};

		const classNames = [
			styles.root,
			error && styles.hasError,
			disabled && styles.disabled,
			customClassName,
		]
			.filter(Boolean)
			.join(" ");

		const containerClassNames = [
			styles.inputContainer,
			isFocused && styles.focused,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<div className={classNames} {...props}>
				{label && (
					<label className={styles.label}>
						{label}
						<span className={styles.labelHint}>Type @ to insert variables</span>
					</label>
				)}

				<div className={styles.inputWrapper}>
					<div className={containerClassNames}>
						{/* Highlight layer - shows styled content */}
						<div className={styles.highlighter} aria-hidden="true">
							{renderHighlight()}
							{/* Add placeholder if empty */}
							{!value && placeholder && (
								<span className={styles.placeholder}>{placeholder}</span>
							)}
						</div>

						{/* Actual input - transparent text, user types here */}
						<input
							ref={inputRef}
							type="text"
							className={styles.input}
							value={value}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							onSelect={handleSelect}
							disabled={disabled}
							aria-label={label}
							aria-invalid={!!error}
							spellCheck={false}
							autoComplete="off"
						/>
					</div>

					{/* @ mention dropdown */}
					{mentionQuery !== null && filteredVariables.length > 0 && (
						<div ref={menuRef} className={styles.mentionMenu} role="listbox">
							{filteredVariables.map((v, index) => (
								<button
									key={v.name}
									type="button"
									className={`${styles.mentionMenuItem} ${index === selectedIndex ? styles.selected : ""}`}
									onClick={() => insertVariable(v.name)}
									onMouseEnter={() => setSelectedIndex(index)}
									role="option"
									aria-selected={index === selectedIndex}
								>
									<span className={styles.mentionItemName}>@{v.name}</span>
									<span className={styles.mentionItemDesc}>{v.description}</span>
								</button>
							))}
						</div>
					)}

					{/* No results message */}
					{mentionQuery !== null && filteredVariables.length === 0 && (
						<div className={styles.mentionMenu}>
							<div className={styles.mentionNoResults}>
								No variables match "{mentionQuery}"
							</div>
						</div>
					)}
				</div>

				{(hint || error) && (
					<span className={error ? styles.error : styles.hint}>
						{error || hint}
					</span>
				)}
			</div>
		);
	},
);

VariableTextInput.displayName = "VariableTextInput";
