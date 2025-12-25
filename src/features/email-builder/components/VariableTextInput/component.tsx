/**
 * VariableTextInput Component
 * A text input that displays {{variables}} as visual chips
 * Uses contenteditable for rich display with plain text storage
 */

import {
	type HTMLAttributes,
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
		// Add text before the match
		if (match.index > lastIndex) {
			segments.push({
				type: "text",
				content: text.slice(lastIndex, match.index),
			});
		}
		// Add the variable
		segments.push({
			type: "variable",
			content: match[1],
		});
		lastIndex = regex.lastIndex;
		match = regex.exec(text);
	}

	// Add remaining text
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
		const [isFocused, setIsFocused] = useState(false);
		const [showVariableMenu, setShowVariableMenu] = useState(false);

		// Filter variables based on email type
		const availableVariables = TEMPLATE_VARIABLES.filter(
			(v) => emailType === "verification" || v.name !== "verification_link",
		);

		// Parse value into segments for rendering
		const segments = parseTextToSegments(value);

		// Convert editor content to plain text with {{variable}} syntax
		const getPlainText = useCallback(() => {
			if (!editorRef.current) return "";

			let text = "";
			const walker = document.createTreeWalker(
				editorRef.current,
				NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
				{
					acceptNode: (node) => {
						if (node.nodeType === Node.TEXT_NODE) {
							return NodeFilter.FILTER_ACCEPT;
						}
						if (
							node.nodeType === Node.ELEMENT_NODE &&
							(node as HTMLElement).dataset.variable
						) {
							return NodeFilter.FILTER_ACCEPT;
						}
						return NodeFilter.FILTER_SKIP;
					},
				},
			);

			let node = walker.nextNode();
			while (node) {
				if (node.nodeType === Node.TEXT_NODE) {
					text += node.textContent || "";
				} else if ((node as HTMLElement).dataset.variable) {
					text += `{{${(node as HTMLElement).dataset.variable}}}`;
				}
				node = walker.nextNode();
			}

			return text;
		}, []);

		// Handle input changes
		const handleInput = useCallback(() => {
			const newValue = getPlainText();
			onChange(newValue);
		}, [getPlainText, onChange]);

		// Render the content with chips
		useEffect(() => {
			if (!editorRef.current || isFocused) return;

			// Only update DOM when not focused (to preserve cursor)
			const html = segments
				.map((seg) => {
					if (seg.type === "variable") {
						return `<span class="${styles.chip}" contenteditable="false" data-variable="${seg.content}"><i class="ri-braces-line"></i>${seg.content}</span>`;
					}
					return seg.content
						.replace(/&/g, "&amp;")
						.replace(/</g, "&lt;")
						.replace(/>/g, "&gt;");
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

		// Insert variable at cursor
		const insertVariable = useCallback(
			(varName: string) => {
				if (!editorRef.current) return;

				const selection = window.getSelection();
				if (!selection || selection.rangeCount === 0) {
					// No selection, append to end
					onChange(value + `{{${varName}}}`);
				} else {
					// Insert at cursor
					const range = selection.getRangeAt(0);
					const chipHtml = `<span class="${styles.chip}" contenteditable="false" data-variable="${varName}"><i class="ri-braces-line"></i>${varName}</span>`;
					const template = document.createElement("template");
					template.innerHTML = chipHtml;
					const chip = template.content.firstChild;
					if (chip) {
						range.deleteContents();
						range.insertNode(chip);
						range.setStartAfter(chip);
						range.collapse(true);
						selection.removeAllRanges();
						selection.addRange(range);
					}
					handleInput();
				}
				setShowVariableMenu(false);
				editorRef.current?.focus();
			},
			[value, onChange, handleInput],
		);

		// Handle keyboard shortcuts
		const handleKeyDown = useCallback(
			(e: React.KeyboardEvent) => {
				// Ctrl/Cmd + J to open variable menu
				if ((e.ctrlKey || e.metaKey) && e.key === "j") {
					e.preventDefault();
					setShowVariableMenu((prev) => !prev);
				}
				// Escape to close menu
				if (e.key === "Escape") {
					setShowVariableMenu(false);
				}
			},
			[],
		);

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
						<button
							type="button"
							className={styles.variableButton}
							onClick={() => setShowVariableMenu((prev) => !prev)}
							title="Insert variable (Ctrl+J)"
						>
							<i className="ri-braces-line" aria-hidden="true" />
							Insert Variable
						</button>
					</label>
				)}

				<div className={styles.inputWrapper}>
					<div
						ref={editorRef}
						className={editorClassNames}
						contentEditable={!disabled}
						onInput={handleInput}
						onFocus={() => setIsFocused(true)}
						onBlur={() => {
							setIsFocused(false);
							// Re-render chips when blur
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
												.replace(/>/g, "&gt;");
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
						suppressContentEditableWarning
					/>

					{/* Variable menu dropdown */}
					{showVariableMenu && (
						<div className={styles.variableMenu}>
							<div className={styles.variableMenuHeader}>
								<span>Insert Variable</span>
								<button
									type="button"
									onClick={() => setShowVariableMenu(false)}
									aria-label="Close"
								>
									<i className="ri-close-line" aria-hidden="true" />
								</button>
							</div>
							<div className={styles.variableMenuList}>
								{availableVariables.map((v) => (
									<button
										key={v.name}
										type="button"
										className={styles.variableMenuItem}
										onClick={() => insertVariable(v.name)}
									>
										<span className={styles.variableMenuItemName}>
											{v.name}
										</span>
										<span className={styles.variableMenuItemDesc}>
											{v.description}
										</span>
									</button>
								))}
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
