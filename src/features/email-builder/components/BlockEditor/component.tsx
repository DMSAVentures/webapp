/**
 * BlockEditor Component
 * Editor panel for customizing email block properties
 */

import { type HTMLAttributes, memo, useCallback } from "react";
import { FormField } from "@/proto-design-system/components/forms/FormField";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Switch } from "@/proto-design-system/components/forms/Switch";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Dropdown } from "@/proto-design-system/components/overlays/Dropdown";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type {
	ButtonBlock,
	DividerBlock,
	EmailBlock,
	EmailTemplateType,
	HeadingBlock,
	ParagraphBlock,
	SpacerBlock,
} from "../../types/emailBlocks";
import { VariableTextArea } from "../VariableTextArea/component";
import { VariableTextInput } from "../VariableTextInput/component";
import styles from "./component.module.scss";

export interface BlockEditorProps extends HTMLAttributes<HTMLDivElement> {
	/** Block being edited */
	block: EmailBlock;
	/** Update handler */
	onUpdate: (block: EmailBlock) => void;
	/** Email type for filtering variables */
	emailType?: EmailTemplateType;
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
	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Helper to update block properties
	const updateBlock = useCallback(
		<T extends EmailBlock>(key: keyof T, value: T[keyof T]) => {
			onUpdate({ ...block, [key]: value } as EmailBlock);
		},
		[block, onUpdate],
	);

	// Render heading editor
	const renderHeadingEditor = (b: HeadingBlock) => (
		<Stack gap="md">
			<VariableTextInput
				value={b.content}
				onChange={(val) => updateBlock<HeadingBlock>("content", val)}
				label="Heading Text"
				placeholder="Enter heading..."
				emailType={emailType}
			/>

			<FormField label="Heading Level">
				<Dropdown
					items={[
						{ id: "1", label: "Heading 1 (Large)" },
						{ id: "2", label: "Heading 2 (Medium)" },
						{ id: "3", label: "Heading 3 (Small)" },
					]}
					value={String(b.level)}
					placeholder="Select level"
					size="md"
					onChange={(id) =>
						updateBlock<HeadingBlock>("level", Number(id) as 1 | 2 | 3)
					}
				/>
			</FormField>

			<FormField label="Alignment">
				<Dropdown
					items={[
						{ id: "left", label: "Left" },
						{ id: "center", label: "Center" },
						{ id: "right", label: "Right" },
					]}
					value={b.align}
					placeholder="Select alignment"
					size="md"
					onChange={(id) =>
						updateBlock<HeadingBlock>(
							"align",
							id as "left" | "center" | "right",
						)
					}
				/>
			</FormField>

			<FormField label="Text Color">
				<Stack direction="row" gap="sm" align="center">
					<input
						type="color"
						id="heading-color"
						value={b.color}
						onChange={(e) => updateBlock<HeadingBlock>("color", e.target.value)}
						className={styles.colorPicker}
					/>
					<Input
						id="heading-color-hex"
						type="text"
						value={b.color}
						onChange={(e) => updateBlock<HeadingBlock>("color", e.target.value)}
						placeholder="#000000"
					/>
				</Stack>
			</FormField>
		</Stack>
	);

	// Render paragraph editor
	const renderParagraphEditor = (b: ParagraphBlock) => (
		<Stack gap="md">
			<VariableTextArea
				value={b.content}
				onChange={(val) => updateBlock<ParagraphBlock>("content", val)}
				label="Text Content"
				placeholder="Enter text..."
				rows={5}
				emailType={emailType}
			/>

			<FormField label="Font Size">
				<Dropdown
					items={[
						{ id: "small", label: "Small (14px)" },
						{ id: "medium", label: "Medium (16px)" },
						{ id: "large", label: "Large (18px)" },
					]}
					value={b.fontSize}
					placeholder="Select size"
					size="md"
					onChange={(id) =>
						updateBlock<ParagraphBlock>(
							"fontSize",
							id as "small" | "medium" | "large",
						)
					}
				/>
			</FormField>

			<FormField label="Alignment">
				<Dropdown
					items={[
						{ id: "left", label: "Left" },
						{ id: "center", label: "Center" },
						{ id: "right", label: "Right" },
					]}
					value={b.align}
					placeholder="Select alignment"
					size="md"
					onChange={(id) =>
						updateBlock<ParagraphBlock>(
							"align",
							id as "left" | "center" | "right",
						)
					}
				/>
			</FormField>

			<FormField label="Text Color">
				<Stack direction="row" gap="sm" align="center">
					<input
						type="color"
						id="paragraph-color"
						value={b.color}
						onChange={(e) =>
							updateBlock<ParagraphBlock>("color", e.target.value)
						}
						className={styles.colorPicker}
					/>
					<Input
						id="paragraph-color-hex"
						type="text"
						value={b.color}
						onChange={(e) =>
							updateBlock<ParagraphBlock>("color", e.target.value)
						}
						placeholder="#000000"
					/>
				</Stack>
			</FormField>
		</Stack>
	);

	// Render button editor
	const renderButtonEditor = (b: ButtonBlock) => (
		<Stack gap="md">
			<VariableTextInput
				value={b.text}
				onChange={(val) => updateBlock<ButtonBlock>("text", val)}
				label="Button Text"
				placeholder="Click Here"
				emailType={emailType}
			/>

			<VariableTextInput
				value={b.url}
				onChange={(val) => updateBlock<ButtonBlock>("url", val)}
				label="Button URL"
				placeholder="https://example.com or @referral_link"
				hint="Type @ to insert dynamic URLs like @referral_link"
				emailType={emailType}
			/>

			<FormField label="Alignment">
				<Dropdown
					items={[
						{ id: "left", label: "Left" },
						{ id: "center", label: "Center" },
						{ id: "right", label: "Right" },
					]}
					value={b.align}
					placeholder="Select alignment"
					size="md"
					onChange={(id) =>
						updateBlock<ButtonBlock>("align", id as "left" | "center" | "right")
					}
				/>
			</FormField>

			<FormField label="Button Color">
				<Stack direction="row" gap="sm" align="center">
					<input
						type="color"
						id="button-bg-color"
						value={b.backgroundColor}
						onChange={(e) =>
							updateBlock<ButtonBlock>("backgroundColor", e.target.value)
						}
						className={styles.colorPicker}
					/>
					<Input
						id="button-bg-color-hex"
						type="text"
						value={b.backgroundColor}
						onChange={(e) =>
							updateBlock<ButtonBlock>("backgroundColor", e.target.value)
						}
						placeholder="#2563EB"
					/>
				</Stack>
			</FormField>

			<FormField label="Text Color">
				<Stack direction="row" gap="sm" align="center">
					<input
						type="color"
						id="button-text-color"
						value={b.textColor}
						onChange={(e) =>
							updateBlock<ButtonBlock>("textColor", e.target.value)
						}
						className={styles.colorPicker}
					/>
					<Input
						id="button-text-color-hex"
						type="text"
						value={b.textColor}
						onChange={(e) =>
							updateBlock<ButtonBlock>("textColor", e.target.value)
						}
						placeholder="#ffffff"
					/>
				</Stack>
			</FormField>

			<Stack
				direction="row"
				gap="md"
				align="center"
				className={styles.toggleField}
			>
				<Switch
					id="button-full-width"
					checked={b.fullWidth}
					onChange={(e) =>
						updateBlock<ButtonBlock>("fullWidth", e.target.checked)
					}
				/>
				<Text as="label" size="sm" weight="medium" htmlFor="button-full-width">
					Full Width
				</Text>
			</Stack>
		</Stack>
	);

	// Render divider editor
	const renderDividerEditor = (b: DividerBlock) => (
		<Stack gap="md">
			<FormField label="Thickness">
				<Dropdown
					items={[
						{ id: "thin", label: "Thin (1px)" },
						{ id: "medium", label: "Medium (2px)" },
						{ id: "thick", label: "Thick (4px)" },
					]}
					value={b.thickness}
					placeholder="Select thickness"
					size="md"
					onChange={(id) =>
						updateBlock<DividerBlock>(
							"thickness",
							id as "thin" | "medium" | "thick",
						)
					}
				/>
			</FormField>

			<FormField label="Style">
				<Dropdown
					items={[
						{ id: "solid", label: "Solid" },
						{ id: "dashed", label: "Dashed" },
						{ id: "dotted", label: "Dotted" },
					]}
					value={b.style}
					placeholder="Select style"
					size="md"
					onChange={(id) =>
						updateBlock<DividerBlock>(
							"style",
							id as "solid" | "dashed" | "dotted",
						)
					}
				/>
			</FormField>

			<FormField label="Color">
				<Stack direction="row" gap="sm" align="center">
					<input
						type="color"
						id="divider-color"
						value={b.color}
						onChange={(e) => updateBlock<DividerBlock>("color", e.target.value)}
						className={styles.colorPicker}
					/>
					<Input
						id="divider-color-hex"
						type="text"
						value={b.color}
						onChange={(e) => updateBlock<DividerBlock>("color", e.target.value)}
						placeholder="#e5e5e5"
					/>
				</Stack>
			</FormField>
		</Stack>
	);

	// Render spacer editor
	const renderSpacerEditor = (b: SpacerBlock) => (
		<FormField label="Height">
			<Dropdown
				items={[
					{ id: "small", label: "Small (16px)" },
					{ id: "medium", label: "Medium (32px)" },
					{ id: "large", label: "Large (48px)" },
				]}
				value={b.height}
				placeholder="Select height"
				size="md"
				onChange={(id) =>
					updateBlock<SpacerBlock>("height", id as "small" | "medium" | "large")
				}
			/>
		</FormField>
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
				return <Text color="muted">Unknown block type</Text>;
		}
	};

	return (
		<div className={classNames} {...props}>
			<Stack gap="xs" className={styles.header}>
				<Text as="h3" size="lg" weight="semibold">
					Edit {getBlockLabel(block.type)}
				</Text>
			</Stack>
			<div className={styles.content}>{renderEditor()}</div>
		</div>
	);
});

BlockEditor.displayName = "BlockEditor";
