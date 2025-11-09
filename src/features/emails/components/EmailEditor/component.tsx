/**
 * EmailEditor Component
 * WYSIWYG email editor with rich text editing and variable insertion
 */

import {
	type HTMLAttributes,
	memo,
	useCallback,
	useRef,
	useState,
} from "react";
import ButtonGroup from "@/proto-design-system/buttongroup/buttongroup";
import DropdownMenu from "@/proto-design-system/dropdownmenu/dropdownmenu";
import HintText from "@/proto-design-system/hinttext/hinttext";
import styles from "./component.module.scss";

export interface EmailEditorProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Initial HTML content */
	initialContent?: string;
	/** Available variables for insertion */
	variables: string[];
	/** Callback when content changes */
	onChange: (html: string) => void;
	/** Additional CSS class name */
	className?: string;
}

type PreviewDevice = "mobile" | "desktop";

/**
 * EmailEditor - WYSIWYG editor for email content
 */
export const EmailEditor = memo<EmailEditorProps>(function EmailEditor({
	initialContent = "",
	variables,
	onChange,
	className: customClassName,
	...props
}) {
	const editorRef = useRef<HTMLDivElement>(null);
	const [showPreview, setShowPreview] = useState(false);
	const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
	const [content, setContent] = useState(initialContent);
	const [showVariablesMenu, setShowVariablesMenu] = useState(false);
	const variablesMenuRef = useRef<HTMLDivElement>(null);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Execute formatting command
	const execCommand = useCallback(
		(command: string, value?: string) => {
			document.execCommand(command, false, value);
			if (editorRef.current) {
				const html = editorRef.current.innerHTML;
				setContent(html);
				onChange(html);
			}
		},
		[onChange],
	);

	// Handle content change
	const handleInput = useCallback(() => {
		if (editorRef.current) {
			const html = editorRef.current.innerHTML;
			setContent(html);
			onChange(html);
		}
	}, [onChange]);

	// Insert variable at cursor position
	const insertVariable = useCallback(
		(variable: string) => {
			const variableTag = `{{${variable}}}`;

			// Insert at cursor position
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				range.deleteContents();

				const span = document.createElement("span");
				span.className = styles.variable;
				span.textContent = variableTag;
				span.contentEditable = "false";

				range.insertNode(span);

				// Move cursor after the inserted variable
				range.setStartAfter(span);
				range.setEndAfter(span);
				selection.removeAllRanges();
				selection.addRange(range);

				handleInput();
			}

			setShowVariablesMenu(false);
		},
		[handleInput],
	);

	// Insert link
	const handleInsertLink = useCallback(() => {
		const url = prompt("Enter URL:");
		if (url) {
			execCommand("createLink", url);
		}
	}, [execCommand]);

	// Insert image
	const handleInsertImage = useCallback(() => {
		const url = prompt("Enter image URL:");
		if (url) {
			execCommand("insertImage", url);
		}
	}, [execCommand]);

	// Build variables menu items
	const variableMenuItems = variables.map((variable) => ({
		state: "default" as const,
		size: "medium" as const,
		checkbox: false,
		label: variable,
		badge: false,
		shortcut: false,
		toggle: false,
		button: false,
		iconPosition: "left" as const,
		onClick: () => insertVariable(variable),
	}));

	return (
		<div className={classNames} {...props}>
			{/* Toolbar */}
			<div className={styles.toolbar}>
				<ButtonGroup
					size="small"
					ariaLabel="Text formatting"
					items={[
						{
							text: "",
							iconPosition: "left",
							icon: "ri-bold",
							iconOnly: true,
							onClick: () => execCommand("bold"),
							ariaLabel: "Bold",
						},
						{
							text: "",
							iconPosition: "left",
							icon: "ri-italic",
							iconOnly: true,
							onClick: () => execCommand("italic"),
							ariaLabel: "Italic",
						},
						{
							text: "",
							iconPosition: "left",
							icon: "ri-underline",
							iconOnly: true,
							onClick: () => execCommand("underline"),
							ariaLabel: "Underline",
						},
					]}
				/>

				<div className={styles.toolbarDivider} />

				<ButtonGroup
					size="small"
					ariaLabel="Insert content"
					items={[
						{
							text: "",
							iconPosition: "left",
							icon: "ri-link",
							iconOnly: true,
							onClick: handleInsertLink,
							ariaLabel: "Insert link",
						},
						{
							text: "",
							iconPosition: "left",
							icon: "ri-image-line",
							iconOnly: true,
							onClick: handleInsertImage,
							ariaLabel: "Insert image",
						},
					]}
				/>

				<div className={styles.toolbarDivider} />

				<div className={styles.toolbarGroup} ref={variablesMenuRef}>
					<ButtonGroup
						size="small"
						ariaLabel="Variable insertion"
						items={[
							{
								text: "Insert Variable",
								iconPosition: "left",
								icon: "ri-code-line",
								iconOnly: false,
								onClick: () => setShowVariablesMenu(!showVariablesMenu),
								ariaLabel: "Insert Variable",
							},
						]}
					/>
					{showVariablesMenu && (
						<div className={styles.variablesMenu}>
							<DropdownMenu items={variableMenuItems} />
						</div>
					)}
				</div>

				<div className={styles.toolbarSpacer} />

				<ButtonGroup
					size="small"
					ariaLabel="Preview and device options"
					items={[
						{
							text: "",
							iconPosition: "left",
							icon:
								previewDevice === "desktop"
									? "ri-computer-line"
									: "ri-smartphone-line",
							iconOnly: true,
							onClick: () =>
								setPreviewDevice(
									previewDevice === "desktop" ? "mobile" : "desktop",
								),
							ariaLabel: `Switch to ${previewDevice === "desktop" ? "mobile" : "desktop"} preview`,
						},
						{
							text: showPreview ? "Edit" : "Preview",
							iconPosition: "left",
							icon: showPreview ? "ri-edit-line" : "ri-eye-line",
							iconOnly: false,
							onClick: () => setShowPreview(!showPreview),
							ariaLabel: showPreview
								? "Switch to edit mode"
								: "Switch to preview mode",
						},
					]}
				/>
			</div>

			{/* Editor / Preview */}
			<div className={styles.editorContainer}>
				{showPreview ? (
					<div
						className={`${styles.preview} ${
							previewDevice === "mobile"
								? styles.previewMobile
								: styles.previewDesktop
						}`}
					>
						<div
							className={styles.previewContent}
							dangerouslySetInnerHTML={{ __html: content }}
						/>
					</div>
				) : (
					<div
						ref={editorRef}
						className={styles.editor}
						contentEditable
						onInput={handleInput}
						dangerouslySetInnerHTML={{ __html: initialContent }}
						role="textbox"
						aria-label="Email content editor"
						aria-multiline="true"
					/>
				)}
			</div>

			{/* Help text */}
			<HintText
				hintText="Use the toolbar to format text, insert links, images, and dynamic variables"
				state="default"
			/>
		</div>
	);
});

EmailEditor.displayName = "EmailEditor";
