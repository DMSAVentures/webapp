/**
 * VariableTextInput Component
 * A text input that supports {{variable}} insertion with true atomic behavior
 * Uses contentEditable with non-editable spans for variables
 */

import {
	type HTMLAttributes,
	type KeyboardEvent,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { TEMPLATE_VARIABLES } from "@/features/campaigns/constants/defaultEmailTemplates";
import {
	getTextBeforeCursor,
	parseValue,
	serializeDOMSingleLine,
} from "../VariableEditor/utils";
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
 * VariableTextInput provides a rich editing experience with atomic variable chips
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
		const editorRef = useRef<HTMLDivElement>(null);
		const menuRef = useRef<HTMLDivElement>(null);
		const [isFocused, setIsFocused] = useState(false);

		// @ mention state
		const [mentionQuery, setMentionQuery] = useState<string | null>(null);
		const [mentionStartPosition, setMentionStartPosition] =
			useState<number>(-1);
		const [selectedIndex, setSelectedIndex] = useState(0);

		// Track if we're programmatically updating content
		const isUpdatingRef = useRef(false);

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

		// Parse value into segments for rendering
		const segments = parseValue(value);

		// Create a variable span element
		const createVariableSpan = useCallback(
			(variableName: string): HTMLSpanElement => {
				const span = document.createElement("span");
				span.contentEditable = "false";
				span.dataset.variable = variableName;
				span.className = styles.variable;
				span.textContent = `{{.${variableName}}}`;
				return span;
			},
			[],
		);

		// Check for @ mention trigger
		const checkForMention = useCallback(() => {
			if (!editorRef.current) return;

			const textBefore = getTextBeforeCursor(editorRef.current);
			const mentionMatch = textBefore.match(/@(\w*)$/);

			if (mentionMatch) {
				const query = mentionMatch[1];
				setMentionQuery(query);
				setMentionStartPosition(textBefore.length - mentionMatch[0].length);
				setSelectedIndex(0);
			} else {
				setMentionQuery(null);
				setMentionStartPosition(-1);
			}
		}, []);

		// Insert variable at current cursor position
		const insertVariable = useCallback(
			(varName: string) => {
				if (!editorRef.current) return;

				const selection = window.getSelection();
				if (!selection || selection.rangeCount === 0) return;

				// If we have an @ mention to replace
				if (mentionStartPosition >= 0 && mentionQuery !== null) {
					// Find and delete the @query text
					const textBefore = getTextBeforeCursor(editorRef.current);
					const deleteLength = textBefore.length - mentionStartPosition;

					// Delete backwards from cursor
					for (let i = 0; i < deleteLength; i++) {
						document.execCommand("delete", false);
					}
				}

				// Create and insert the variable span
				const span = createVariableSpan(varName);

				// Get current selection for insertion
				const currentRange = window.getSelection()?.getRangeAt(0);
				if (currentRange) {
					currentRange.deleteContents();

					// Insert the span
					currentRange.insertNode(span);

					// Create a text node with a space after the span
					const spaceNode = document.createTextNode(" ");
					span.parentNode?.insertBefore(spaceNode, span.nextSibling);

					// Move cursor after the space
					const newRange = document.createRange();
					newRange.setStartAfter(spaceNode);
					newRange.collapse(true);
					const sel = window.getSelection();
					sel?.removeAllRanges();
					sel?.addRange(newRange);
				}

				// Close mention menu
				setMentionQuery(null);
				setMentionStartPosition(-1);

				// Sync value
				const newValue = serializeDOMSingleLine(editorRef.current);
				onChange(newValue);

				// Keep focus
				editorRef.current.focus();
			},
			[createVariableSpan, mentionQuery, mentionStartPosition, onChange],
		);

		// Handle input changes
		const handleInput = useCallback(() => {
			if (isUpdatingRef.current || !editorRef.current) return;

			const newValue = serializeDOMSingleLine(editorRef.current);
			onChange(newValue);
			checkForMention();
		}, [onChange, checkForMention]);

		// Handle keyboard navigation in mention menu and atomic variable deletion
		const handleKeyDown = useCallback(
			(e: KeyboardEvent<HTMLDivElement>) => {
				// Prevent Enter from creating new lines (single-line input)
				if (e.key === "Enter" && mentionQuery === null) {
					e.preventDefault();
					return;
				}

				// Handle Backspace to delete atomic variables
				if (e.key === "Backspace") {
					const selection = window.getSelection();
					if (selection && selection.rangeCount > 0) {
						const range = selection.getRangeAt(0);
						if (range.collapsed) {
							const node = range.startContainer;
							// Check if we're right after a variable (after the trailing space)
							if (
								node.nodeType === Node.TEXT_NODE &&
								range.startOffset === 1 &&
								node.textContent?.startsWith(" ")
							) {
								const prevSibling = node.previousSibling as HTMLElement;
								if (prevSibling?.dataset?.variable) {
									e.preventDefault();
									// Delete the space and the variable
									(node as Text).deleteData(0, 1);
									prevSibling.remove();
									const newValue = serializeDOMSingleLine(editorRef.current);
									onChange(newValue);
									return;
								}
							}
							// Check if cursor is at start of a text node right after a variable
							if (node.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
								const prevSibling = node.previousSibling as HTMLElement;
								if (prevSibling?.dataset?.variable) {
									e.preventDefault();
									prevSibling.remove();
									const newValue = serializeDOMSingleLine(editorRef.current);
									onChange(newValue);
									return;
								}
							}
						}
					}
				}

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
						setMentionStartPosition(-1);
						return;
					}
				}
			},
			[
				mentionQuery,
				filteredVariables,
				selectedIndex,
				insertVariable,
				onChange,
			],
		);

		// Handle paste - strip formatting, keep only text
		const handlePaste = useCallback(
			(e: React.ClipboardEvent<HTMLDivElement>) => {
				e.preventDefault();
				const text = e.clipboardData.getData("text/plain");
				// Remove newlines for single-line input
				const cleanText = text.replace(/[\r\n]+/g, " ");
				document.execCommand("insertText", false, cleanText);
			},
			[],
		);

		// Sync DOM with value when value changes externally
		useEffect(() => {
			if (!editorRef.current) return;

			const currentValue = serializeDOMSingleLine(editorRef.current);
			if (currentValue !== value) {
				isUpdatingRef.current = true;

				// Save selection
				const selection = window.getSelection();
				const hadFocus = document.activeElement === editorRef.current;

				// Rebuild content
				editorRef.current.innerHTML = "";
				segments.forEach((seg) => {
					if (seg.type === "variable") {
						const span = createVariableSpan(seg.name);
						editorRef.current!.appendChild(span);
					} else {
						const textNode = document.createTextNode(seg.content);
						editorRef.current!.appendChild(textNode);
					}
				});

				// Restore focus at end if we had it
				if (hadFocus && selection) {
					const range = document.createRange();
					range.selectNodeContents(editorRef.current);
					range.collapse(false);
					selection.removeAllRanges();
					selection.addRange(range);
				}

				isUpdatingRef.current = false;
			}
		}, [value, segments, createVariableSpan]);

		// Close menu when clicking outside
		useEffect(() => {
			const handleClickOutside = (e: MouseEvent) => {
				if (
					menuRef.current &&
					!menuRef.current.contains(e.target as Node) &&
					editorRef.current &&
					!editorRef.current.contains(e.target as Node)
				) {
					setMentionQuery(null);
					setMentionStartPosition(-1);
				}
			};

			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}, []);

		// Scroll selected item into view
		useEffect(() => {
			if (menuRef.current && mentionQuery !== null) {
				const selectedItem = menuRef.current.querySelector(
					'[aria-selected="true"]',
				);
				if (selectedItem) {
					selectedItem.scrollIntoView({ block: "nearest" });
				}
			}
		}, [mentionQuery]);

		// Initial render of content
		// biome-ignore lint/correctness/useExhaustiveDependencies: Initial render only - intentionally empty deps
		useEffect(() => {
			if (!editorRef.current || editorRef.current.childNodes.length > 0) return;

			segments.forEach((seg) => {
				if (seg.type === "variable") {
					const span = createVariableSpan(seg.name);
					editorRef.current!.appendChild(span);
				} else {
					const textNode = document.createTextNode(seg.content);
					editorRef.current!.appendChild(textNode);
				}
			});
		}, []);

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
					<div
						className={containerClassNames}
						onClick={() => editorRef.current?.focus()}
					>
						{/* Placeholder */}
						{!value && placeholder && (
							<div className={styles.placeholder}>{placeholder}</div>
						)}

						{/* ContentEditable editor */}
						<div
							ref={editorRef}
							className={styles.editor}
							contentEditable={!disabled}
							suppressContentEditableWarning
							onInput={handleInput}
							onKeyDown={handleKeyDown}
							onPaste={handlePaste}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							onSelect={checkForMention}
							role="textbox"
							aria-label={label}
							aria-invalid={!!error}
							aria-multiline="false"
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
									<span className={styles.mentionItemDesc}>
										{v.description}
									</span>
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
