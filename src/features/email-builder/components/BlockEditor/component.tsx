/**
 * BlockEditor Component
 * Editor panel for customizing email block properties
 */

import { type HTMLAttributes, memo, useCallback } from "react";
import { TEMPLATE_VARIABLES } from "@/features/campaigns/constants/defaultEmailTemplates";
import { TextArea } from "@/proto-design-system/TextArea/textArea";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
import Dropdown from "@/proto-design-system/dropdown/dropdown";
import { Toggle } from "@/proto-design-system/Toggle/toggle";
import type {
	ButtonBlock,
	DividerBlock,
	EmailBlock,
	HeadingBlock,
	ParagraphBlock,
	SpacerBlock,
} from "../../types/emailBlocks";
import { VariableChip } from "../VariableChip/component";
import styles from "./component.module.scss";

export interface BlockEditorProps extends HTMLAttributes<HTMLDivElement> {
	/** Block being edited */
	block: EmailBlock;
	/** Update handler */
	onUpdate: (block: EmailBlock) => void;
	/** Email type for filtering variables */
	emailType?: "verification" | "welcome";
	/** Additional CSS class name */
	className?: string;
}

/**
 * Get block type label
 */
const getBlockLabel = (type: EmailBlock["type"]): string => {
	const labels: Record<EmailBlock["type"], string> = {
		heading: "Heading",
		paragraph: "Text Block",
		button: "Button",
		divider: "Divider",
		spacer: "Spacer",
		image: "Image",
	};
	return labels[type];
};

/**
 * BlockEditor provides editing controls for email blocks
 */
export const BlockEditor = memo<BlockEditorProps>(function BlockEditor({
	block,
	onUpdate,
	emailType = "verification",
	className: customClassName,
	...props
}) {
	// Filter variables based on email type
	const availableVariables = TEMPLATE_VARIABLES.filter(
		(v) => emailType === "verification" || v.name !== "verification_link",
	);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Helper to update block properties
	const updateBlock = useCallback(
		<T extends EmailBlock>(key: keyof T, value: T[keyof T]) => {
			onUpdate({ ...block, [key]: value } as EmailBlock);
		},
		[block, onUpdate],
	);

	// Insert variable at the end of text content
	const insertVariable = useCallback(
		(varName: string, field: "content" | "text" | "url") => {
			const currentValue = (block as unknown as Record<string, string>)[field] || "";
			onUpdate({ ...block, [field]: currentValue + `{{${varName}}}` } as EmailBlock);
		},
		[block, onUpdate],
	);

	// Render variable insertion helper
	const renderVariableHelper = (field: "content" | "text" | "url") => (
		<div className={styles.variableHelper}>
			<span className={styles.variableHelperLabel}>Insert variable:</span>
			<div className={styles.variableChips}>
				{availableVariables.map((v) => (
					<VariableChip
						key={v.name}
						name={v.name}
						size="small"
						interactive
						onChipClick={() => insertVariable(v.name, field)}
					/>
				))}
			</div>
		</div>
	);

	// Render heading editor
	const renderHeadingEditor = (b: HeadingBlock) => (
		<>
			<TextArea
				id="heading-content"
				label="Heading Text"
				value={b.content}
				onChange={(e) => updateBlock<HeadingBlock>("content", e.target.value)}
				placeholder="Enter heading..."
				rows={2}
			/>
			{renderVariableHelper("content")}

			<Dropdown
				label="Heading Level"
				options={[
					{ value: "1", label: "Heading 1 (Large)", selected: b.level === 1 },
					{ value: "2", label: "Heading 2 (Medium)", selected: b.level === 2 },
					{ value: "3", label: "Heading 3 (Small)", selected: b.level === 3 },
				]}
				placeholderText="Select level"
				size="medium"
				onChange={(option) =>
					updateBlock<HeadingBlock>("level", Number(option.value) as 1 | 2 | 3)
				}
			/>

			<Dropdown
				label="Alignment"
				options={[
					{ value: "left", label: "Left", selected: b.align === "left" },
					{ value: "center", label: "Center", selected: b.align === "center" },
					{ value: "right", label: "Right", selected: b.align === "right" },
				]}
				placeholderText="Select alignment"
				size="medium"
				onChange={(option) =>
					updateBlock<HeadingBlock>("align", option.value as "left" | "center" | "right")
				}
			/>

			<div className={styles.colorField}>
				<label htmlFor="heading-color">Text Color</label>
				<div className={styles.colorInputWrapper}>
					<input
						type="color"
						id="heading-color"
						value={b.color}
						onChange={(e) => updateBlock<HeadingBlock>("color", e.target.value)}
					/>
					<TextInput
						id="heading-color-hex"
						label=""
						type="text"
						value={b.color}
						onChange={(e) => updateBlock<HeadingBlock>("color", e.target.value)}
						placeholder="#000000"
					/>
				</div>
			</div>
		</>
	);

	// Render paragraph editor
	const renderParagraphEditor = (b: ParagraphBlock) => (
		<>
			<TextArea
				id="paragraph-content"
				label="Text Content"
				value={b.content}
				onChange={(e) => updateBlock<ParagraphBlock>("content", e.target.value)}
				placeholder="Enter text..."
				rows={5}
			/>
			{renderVariableHelper("content")}

			<Dropdown
				label="Font Size"
				options={[
					{ value: "small", label: "Small (14px)", selected: b.fontSize === "small" },
					{ value: "medium", label: "Medium (16px)", selected: b.fontSize === "medium" },
					{ value: "large", label: "Large (18px)", selected: b.fontSize === "large" },
				]}
				placeholderText="Select size"
				size="medium"
				onChange={(option) =>
					updateBlock<ParagraphBlock>("fontSize", option.value as "small" | "medium" | "large")
				}
			/>

			<Dropdown
				label="Alignment"
				options={[
					{ value: "left", label: "Left", selected: b.align === "left" },
					{ value: "center", label: "Center", selected: b.align === "center" },
					{ value: "right", label: "Right", selected: b.align === "right" },
				]}
				placeholderText="Select alignment"
				size="medium"
				onChange={(option) =>
					updateBlock<ParagraphBlock>("align", option.value as "left" | "center" | "right")
				}
			/>

			<div className={styles.colorField}>
				<label htmlFor="paragraph-color">Text Color</label>
				<div className={styles.colorInputWrapper}>
					<input
						type="color"
						id="paragraph-color"
						value={b.color}
						onChange={(e) => updateBlock<ParagraphBlock>("color", e.target.value)}
					/>
					<TextInput
						id="paragraph-color-hex"
						label=""
						type="text"
						value={b.color}
						onChange={(e) => updateBlock<ParagraphBlock>("color", e.target.value)}
						placeholder="#000000"
					/>
				</div>
			</div>
		</>
	);

	// Render button editor
	const renderButtonEditor = (b: ButtonBlock) => (
		<>
			<TextInput
				id="button-text"
				label="Button Text"
				type="text"
				value={b.text}
				onChange={(e) => updateBlock<ButtonBlock>("text", e.target.value)}
				placeholder="Click Here"
			/>
			{renderVariableHelper("text")}

			<TextInput
				id="button-url"
				label="Button URL"
				type="text"
				value={b.url}
				onChange={(e) => updateBlock<ButtonBlock>("url", e.target.value)}
				placeholder="https://example.com"
				hint="Use {{referral_link}} or {{verification_link}} for dynamic URLs"
			/>
			{renderVariableHelper("url")}

			<Dropdown
				label="Alignment"
				options={[
					{ value: "left", label: "Left", selected: b.align === "left" },
					{ value: "center", label: "Center", selected: b.align === "center" },
					{ value: "right", label: "Right", selected: b.align === "right" },
				]}
				placeholderText="Select alignment"
				size="medium"
				onChange={(option) =>
					updateBlock<ButtonBlock>("align", option.value as "left" | "center" | "right")
				}
			/>

			<div className={styles.colorField}>
				<label htmlFor="button-bg-color">Button Color</label>
				<div className={styles.colorInputWrapper}>
					<input
						type="color"
						id="button-bg-color"
						value={b.backgroundColor}
						onChange={(e) => updateBlock<ButtonBlock>("backgroundColor", e.target.value)}
					/>
					<TextInput
						id="button-bg-color-hex"
						label=""
						type="text"
						value={b.backgroundColor}
						onChange={(e) => updateBlock<ButtonBlock>("backgroundColor", e.target.value)}
						placeholder="#2563EB"
					/>
				</div>
			</div>

			<div className={styles.colorField}>
				<label htmlFor="button-text-color">Text Color</label>
				<div className={styles.colorInputWrapper}>
					<input
						type="color"
						id="button-text-color"
						value={b.textColor}
						onChange={(e) => updateBlock<ButtonBlock>("textColor", e.target.value)}
					/>
					<TextInput
						id="button-text-color-hex"
						label=""
						type="text"
						value={b.textColor}
						onChange={(e) => updateBlock<ButtonBlock>("textColor", e.target.value)}
						placeholder="#ffffff"
					/>
				</div>
			</div>

			<div className={styles.toggleField}>
				<Toggle
					id="button-full-width"
					checked={b.fullWidth}
					onChange={(e) => updateBlock<ButtonBlock>("fullWidth", e.target.checked)}
				/>
				<label htmlFor="button-full-width">Full Width</label>
			</div>
		</>
	);

	// Render divider editor
	const renderDividerEditor = (b: DividerBlock) => (
		<>
			<Dropdown
				label="Thickness"
				options={[
					{ value: "thin", label: "Thin (1px)", selected: b.thickness === "thin" },
					{ value: "medium", label: "Medium (2px)", selected: b.thickness === "medium" },
					{ value: "thick", label: "Thick (4px)", selected: b.thickness === "thick" },
				]}
				placeholderText="Select thickness"
				size="medium"
				onChange={(option) =>
					updateBlock<DividerBlock>("thickness", option.value as "thin" | "medium" | "thick")
				}
			/>

			<Dropdown
				label="Style"
				options={[
					{ value: "solid", label: "Solid", selected: b.style === "solid" },
					{ value: "dashed", label: "Dashed", selected: b.style === "dashed" },
					{ value: "dotted", label: "Dotted", selected: b.style === "dotted" },
				]}
				placeholderText="Select style"
				size="medium"
				onChange={(option) =>
					updateBlock<DividerBlock>("style", option.value as "solid" | "dashed" | "dotted")
				}
			/>

			<div className={styles.colorField}>
				<label htmlFor="divider-color">Color</label>
				<div className={styles.colorInputWrapper}>
					<input
						type="color"
						id="divider-color"
						value={b.color}
						onChange={(e) => updateBlock<DividerBlock>("color", e.target.value)}
					/>
					<TextInput
						id="divider-color-hex"
						label=""
						type="text"
						value={b.color}
						onChange={(e) => updateBlock<DividerBlock>("color", e.target.value)}
						placeholder="#e5e5e5"
					/>
				</div>
			</div>
		</>
	);

	// Render spacer editor
	const renderSpacerEditor = (b: SpacerBlock) => (
		<Dropdown
			label="Height"
			options={[
				{ value: "small", label: "Small (16px)", selected: b.height === "small" },
				{ value: "medium", label: "Medium (32px)", selected: b.height === "medium" },
				{ value: "large", label: "Large (48px)", selected: b.height === "large" },
			]}
			placeholderText="Select height"
			size="medium"
			onChange={(option) =>
				updateBlock<SpacerBlock>("height", option.value as "small" | "medium" | "large")
			}
		/>
	);

	// Render editor based on block type
	const renderEditor = () => {
		switch (block.type) {
			case "heading":
				return renderHeadingEditor(block);
			case "paragraph":
				return renderParagraphEditor(block);
			case "button":
				return renderButtonEditor(block);
			case "divider":
				return renderDividerEditor(block);
			case "spacer":
				return renderSpacerEditor(block);
			default:
				return <p>Unknown block type</p>;
		}
	};

	return (
		<div className={classNames} {...props}>
			<div className={styles.header}>
				<h3 className={styles.title}>Edit {getBlockLabel(block.type)}</h3>
			</div>
			<div className={styles.content}>{renderEditor()}</div>
		</div>
	);
});

BlockEditor.displayName = "BlockEditor";
