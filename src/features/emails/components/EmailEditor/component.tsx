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
import {
	Bold,
	Italic,
	Underline,
	Link,
	Image,
	Code,
	Monitor,
	Smartphone,
	Eye,
	Pencil,
} from "lucide-react";
import { Button, ButtonGroup } from "@/proto-design-system/components/primitives/Button";
import { DropdownMenu } from "@/proto-design-system/components/overlays/DropdownMenu";
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
		id: variable,
		label: variable,
		onClick: () => insertVariable(variable),
	}));

	return (
		<div className={classNames} {...props}>
			{/* Toolbar */}
			<div className={styles.toolbar}>
				<ButtonGroup aria-label="Text formatting">
					<Button
						variant="secondary"
						size="sm"
						isIconOnly
						leftIcon={<Bold size={16} />}
						onClick={() => execCommand("bold")}
						aria-label="Bold"
					/>
					<Button
						variant="secondary"
						size="sm"
						isIconOnly
						leftIcon={<Italic size={16} />}
						onClick={() => execCommand("italic")}
						aria-label="Italic"
					/>
					<Button
						variant="secondary"
						size="sm"
						isIconOnly
						leftIcon={<Underline size={16} />}
						onClick={() => execCommand("underline")}
						aria-label="Underline"
					/>
				</ButtonGroup>

				<div className={styles.toolbarDivider} />

				<ButtonGroup aria-label="Insert content">
					<Button
						variant="secondary"
						size="sm"
						isIconOnly
						leftIcon={<Link size={16} />}
						onClick={handleInsertLink}
						aria-label="Insert link"
					/>
					<Button
						variant="secondary"
						size="sm"
						isIconOnly
						leftIcon={<Image size={16} />}
						onClick={handleInsertImage}
						aria-label="Insert image"
					/>
				</ButtonGroup>

				<div className={styles.toolbarDivider} />

				<div className={styles.toolbarGroup} ref={variablesMenuRef}>
					<ButtonGroup aria-label="Variable insertion">
						<Button
							variant="secondary"
							size="sm"
							leftIcon={<Code size={16} />}
							onClick={() => setShowVariablesMenu(!showVariablesMenu)}
							aria-label="Insert Variable"
						>
							Insert Variable
						</Button>
					</ButtonGroup>
					{showVariablesMenu && (
						<div className={styles.variablesMenu}>
							<DropdownMenu items={variableMenuItems} />
						</div>
					)}
				</div>

				<div className={styles.toolbarSpacer} />

				<ButtonGroup aria-label="Preview and device options">
					<Button
						variant="secondary"
						size="sm"
						isIconOnly
						leftIcon={
							previewDevice === "desktop" ? (
								<Monitor size={16} />
							) : (
								<Smartphone size={16} />
							)
						}
						onClick={() =>
							setPreviewDevice(
								previewDevice === "desktop" ? "mobile" : "desktop",
							)
						}
						aria-label={`Switch to ${previewDevice === "desktop" ? "mobile" : "desktop"} preview`}
					/>
					<Button
						variant="secondary"
						size="sm"
						leftIcon={showPreview ? <Pencil size={16} /> : <Eye size={16} />}
						onClick={() => setShowPreview(!showPreview)}
						aria-label={
							showPreview ? "Switch to edit mode" : "Switch to preview mode"
						}
					>
						{showPreview ? "Edit" : "Preview"}
					</Button>
				</ButtonGroup>
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
			<p className={styles.helpText}>
				Use the toolbar to format text, insert links, images, and dynamic variables
			</p>
		</div>
	);
});

EmailEditor.displayName = "EmailEditor";
