/**
 * VariableTextArea Component
 * A multi-line text area that supports @ mentions for variable insertion
 * Variables are displayed as visual chips
 */

import {
	type HTMLAttributes,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import DropdownOption from "@/proto-design-system/dropdown/option";
import { TEMPLATE_VARIABLES } from "@/features/campaigns/constants/defaultEmailTemplates";
import styles from "./component.module.scss";

export interface VariableTextAreaProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Current value (plain text with {{variable}} syntax) */
	value: string;
	/** Change handler */
	onChange: (value: string) => void;
	/** Label text */
	label?: string;
	/** Placeholder text */
	placeholder?: string;
	/** Number of rows */
	rows?: number;
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
 * Get caret coordinates relative to the editor
 */
function getCaretCoordinates(
	editor: HTMLElement,
): { top: number; left: number } | null {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return null;

	const range = selection.getRangeAt(0).cloneRange();
	range.collapse(true);

	const span = document.createElement("span");
	span.textContent = "\u200B";
	range.insertNode(span);

	const rect = span.getBoundingClientRect();
	const parentRect = editor.getBoundingClientRect();

	span.remove();

	return {
		top: rect.top - parentRect.top + rect.height,
		left: rect.left - parentRect.left,
	};
}

/**
 * VariableTextArea provides a multi-line editing experience with @ mentions
 */
export const VariableTextArea = memo<VariableTextAreaProps>(
	function VariableTextArea({
		value,
		onChange,
		label,
		placeholder,
		rows = 4,
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
		const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
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

		// Parse value into segments for rendering
		const segments = parseTextToSegments(value);

		// Convert editor content to plain text with {{variable}} syntax
		const getPlainText = useCallback(() => {
			if (!editorRef.current) return "";

			let text = "";
			const processNode = (node: Node) => {
				if (node.nodeType === Node.TEXT_NODE) {
					text += node.textContent || "";
				} else if (node.nodeType === Node.ELEMENT_NODE) {
					const el = node as HTMLElement;
					if (el.dataset.variable) {
						text += `{{${el.dataset.variable}}}`;
					} else if (el.tagName === "BR") {
						text += "\n";
					} else if (el.tagName === "DIV" && text.length > 0 && !text.endsWith("\n")) {
						// DIV typically creates a new line in contenteditable
						text += "\n";
						el.childNodes.forEach(processNode);
					} else {
						el.childNodes.forEach(processNode);
					}
				}
			};

			editorRef.current.childNodes.forEach(processNode);
			return text;
		}, []);

		// Check for @ mention trigger
		const checkForMention = useCallback(() => {
			const selection = window.getSelection();
			if (!selection || selection.rangeCount === 0 || !editorRef.current) {
				setMentionQuery(null);
				return;
			}

			const range = selection.getRangeAt(0);
			if (!range.collapsed) {
				setMentionQuery(null);
				return;
			}

			const textNode = range.startContainer;
			if (textNode.nodeType !== Node.TEXT_NODE) {
				setMentionQuery(null);
				return;
			}

			const text = textNode.textContent || "";
			const cursorPos = range.startOffset;
			const textBeforeCursor = text.slice(0, cursorPos);

			const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

			if (mentionMatch) {
				const query = mentionMatch[1];
				setMentionQuery(query);
				setSelectedIndex(0);

				const coords = getCaretCoordinates(editorRef.current);
				if (coords) {
					setMentionPosition(coords);
				}
			} else {
				setMentionQuery(null);
			}
		}, []);

		// Handle input changes
		const handleInput = useCallback(() => {
			const newValue = getPlainText();
			onChange(newValue);
			checkForMention();
		}, [getPlainText, onChange, checkForMention]);

		// Render the content with chips
		useEffect(() => {
			if (!editorRef.current || isFocused) return;

			const html = segments
				.map((seg) => {
					if (seg.type === "variable") {
						return `<span class="${styles.chip}" contenteditable="false" data-variable="${seg.content}"><i class="ri-braces-line"></i>${seg.content}</span>`;
					}
					return seg.content
						.replace(/&/g, "&amp;")
						.replace(/</g, "&lt;")
						.replace(/>/g, "&gt;")
						.replace(/\n/g, "<br>");
				})
				.join("");

			if (editorRef.current.innerHTML !== html) {
				editorRef.current.innerHTML = html || "";
			}
		}, [segments, isFocused]);

		// Handle paste - strip formatting
		const handlePaste = useCallback(
			(e: React.ClipboardEvent) => {
				e.preventDefault();
				const text = e.clipboardData.getData("text/plain");
				document.execCommand("insertText", false, text);
				handleInput();
			},
			[handleInput],
		);

		// Insert variable at cursor, replacing @query if present
		const insertVariable = useCallback(
			(varName: string) => {
				if (!editorRef.current) return;

				const selection = window.getSelection();
				if (!selection || selection.rangeCount === 0) {
					onChange(value + `{{${varName}}}`);
					setMentionQuery(null);
					return;
				}

				const range = selection.getRangeAt(0);
				const textNode = range.startContainer;

				if (mentionQuery !== null && textNode.nodeType === Node.TEXT_NODE) {
					const text = textNode.textContent || "";
					const cursorPos = range.startOffset;
					const textBeforeCursor = text.slice(0, cursorPos);
					const atIndex = textBeforeCursor.lastIndexOf("@");

					if (atIndex !== -1) {
						range.setStart(textNode, atIndex);
						range.deleteContents();
					}
				}

				const chip = document.createElement("span");
				chip.className = styles.chip;
				chip.contentEditable = "false";
				chip.dataset.variable = varName;
				chip.innerHTML = `<i class="ri-braces-line"></i>${varName}`;

				range.insertNode(chip);

				const space = document.createTextNode("\u00A0");
				range.setStartAfter(chip);
				range.insertNode(space);
				range.setStartAfter(space);
				range.collapse(true);
				selection.removeAllRanges();
				selection.addRange(range);

				const newValue = getPlainText();
				onChange(newValue);
				setMentionQuery(null);
				editorRef.current.focus();
			},
			[value, onChange, getPlainText, mentionQuery],
		);

		// Handle keyboard navigation
		const handleKeyDown = useCallback(
			(e: React.KeyboardEvent) => {
				if (mentionQuery !== null && filteredVariables.length > 0) {
					if (e.key === "ArrowDown") {
						e.preventDefault();
						e.stopPropagation();
						setSelectedIndex((prev) =>
							prev < filteredVariables.length - 1 ? prev + 1 : 0,
						);
						return;
					}
					if (e.key === "ArrowUp") {
						e.preventDefault();
						e.stopPropagation();
						setSelectedIndex((prev) =>
							prev > 0 ? prev - 1 : filteredVariables.length - 1,
						);
						return;
					}
					if (e.key === "Enter" || e.key === "Tab") {
						e.preventDefault();
						e.stopPropagation();
						insertVariable(filteredVariables[selectedIndex].name);
						return;
					}
					if (e.key === "Escape") {
						e.preventDefault();
						e.stopPropagation();
						setMentionQuery(null);
						return;
					}
				}

				if (e.key === "Escape") {
					setMentionQuery(null);
				}
			},
			[mentionQuery, filteredVariables, selectedIndex, insertVariable],
		);

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
				}
			};

			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}, []);

		const minHeight = rows * 24; // Approximate line height

		const classNames = [
			styles.root,
			error && styles.hasError,
			disabled && styles.disabled,
			customClassName,
		]
			.filter(Boolean)
			.join(" ");

		const editorClassNames = [
			styles.editor,
			isFocused && styles.focused,
			!value && styles.empty,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<div className={classNames} {...props}>
				{label && (
					<label className={styles.label}>
						{label}
						<span className={styles.labelHint}>Type @ for variables</span>
					</label>
				)}

				<div className={styles.inputWrapper}>
					<div
						ref={editorRef}
						className={editorClassNames}
						style={{ minHeight }}
						contentEditable={!disabled}
						onInput={handleInput}
						onFocus={() => setIsFocused(true)}
						onBlur={() => {
							setIsFocused(false);
							setTimeout(() => {
								if (editorRef.current) {
									const html = parseTextToSegments(value)
										.map((seg) => {
											if (seg.type === "variable") {
												return `<span class="${styles.chip}" contenteditable="false" data-variable="${seg.content}"><i class="ri-braces-line"></i>${seg.content}</span>`;
											}
											return seg.content
												.replace(/&/g, "&amp;")
												.replace(/</g, "&lt;")
												.replace(/>/g, "&gt;")
												.replace(/\n/g, "<br>");
										})
										.join("");
									editorRef.current.innerHTML = html || "";
								}
							}, 0);
						}}
						onPaste={handlePaste}
						onKeyDown={handleKeyDown}
						data-placeholder={placeholder}
						role="textbox"
						aria-label={label}
						aria-invalid={!!error}
						aria-multiline="true"
						suppressContentEditableWarning
					/>

					{/* @ mention dropdown */}
					{mentionQuery !== null && filteredVariables.length > 0 && (
						<div
							ref={menuRef}
							className={styles.mentionMenu}
							style={{ top: mentionPosition.top }}
							role="listbox"
						>
							{filteredVariables.map((v, index) => (
								<DropdownOption
									key={v.name}
									value={v.name}
									label={`@${v.name}`}
									description={v.description}
									size="small"
									icon="ri-braces-line"
									highlighted={index === selectedIndex}
									onClick={() => insertVariable(v.name)}
									onMouseEnter={() => setSelectedIndex(index)}
								/>
							))}
						</div>
					)}

					{mentionQuery !== null && filteredVariables.length === 0 && (
						<div
							className={styles.mentionMenu}
							style={{ top: mentionPosition.top }}
						>
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

VariableTextArea.displayName = "VariableTextArea";
