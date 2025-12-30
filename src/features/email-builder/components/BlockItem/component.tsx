/**
 * BlockItem Component
 * Displays a single email block in the canvas with edit/delete controls
 */

import { type HTMLAttributes, memo } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Badge, Button } from "@/proto-design-system";
import type { EmailBlock } from "../../types/emailBlocks";
import styles from "./component.module.scss";

export interface BlockItemProps extends HTMLAttributes<HTMLDivElement> {
	/** Block data */
	block: EmailBlock;
	/** Whether this block is selected */
	isSelected: boolean;
	/** Click handler */
	onSelect: () => void;
	/** Delete handler */
	onDelete: () => void;
	/** Move up handler */
	onMoveUp?: () => void;
	/** Move down handler */
	onMoveDown?: () => void;
	/** Whether can move up */
	canMoveUp?: boolean;
	/** Whether can move down */
	canMoveDown?: boolean;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Get block type icon
 */
const getBlockIcon = (type: EmailBlock["type"]): string => {
	const icons: Record<EmailBlock["type"], string> = {
		heading: "ri-heading",
		paragraph: "ri-text",
		button: "ri-cursor-line",
		divider: "ri-separator",
		spacer: "ri-space",
		image: "ri-image-line",
	};
	return icons[type];
};

/**
 * Get block type label
 */
const getBlockLabel = (type: EmailBlock["type"]): string => {
	const labels: Record<EmailBlock["type"], string> = {
		heading: "Heading",
		paragraph: "Text",
		button: "Button",
		divider: "Divider",
		spacer: "Spacer",
		image: "Image",
	};
	return labels[type];
};

/**
 * Render text with variable chips
 * Matches Go template syntax: {{.variable_name}}
 */
function renderTextWithVariables(text: string): React.ReactNode[] {
	const parts: React.ReactNode[] = [];
	const regex = /\{\{\.(\w+)\}\}/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null = null;
	let key = 0;

	match = regex.exec(text);
	while (match !== null) {
		// Add text before the match
		if (match.index > lastIndex) {
			parts.push(
				<span key={`text-${key++}`}>{text.slice(lastIndex, match.index)}</span>,
			);
		}
		// Add the variable chip
		parts.push(
			<Badge
				key={`var-${key++}`}
				variant="primary"
				size="sm"
			>
				{match[1]}
			</Badge>,
		);
		lastIndex = regex.lastIndex;
		match = regex.exec(text);
	}

	// Add remaining text
	if (lastIndex < text.length) {
		parts.push(<span key={`text-${key++}`}>{text.slice(lastIndex)}</span>);
	}

	return parts;
}

/**
 * Get block preview content
 */
function getBlockPreview(block: EmailBlock): React.ReactNode {
	switch (block.type) {
		case "heading":
			return renderTextWithVariables(block.content);
		case "paragraph":
			return renderTextWithVariables(
				block.content.length > 80
					? block.content.slice(0, 80) + "..."
					: block.content,
			);
		case "button":
			return (
				<span className={styles.buttonPreview}>
					{renderTextWithVariables(block.text)}
				</span>
			);
		case "divider":
			return <span className={styles.dividerPreview} />;
		case "spacer":
			return (
				<span className={styles.spacerPreview}>{block.height} spacing</span>
			);
		case "image":
			return block.src ? "Image added" : "No image";
		default:
			return null;
	}
}

/**
 * BlockItem displays an email block with controls
 */
export const BlockItem = memo<BlockItemProps>(function BlockItem({
	block,
	isSelected,
	onSelect,
	onDelete,
	onMoveUp,
	onMoveDown,
	canMoveUp = true,
	canMoveDown = true,
	className: customClassName,
	...props
}) {
	const classNames = [
		styles.root,
		isSelected && styles.selected,
		customClassName,
	]
		.filter(Boolean)
		.join(" ");

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete();
	};

	const handleMoveUpClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onMoveUp?.();
	};

	const handleMoveDownClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onMoveDown?.();
	};

	return (
		<div
			className={classNames}
			onClick={onSelect}
			role="button"
			tabIndex={0}
			aria-label={`${getBlockLabel(block.type)} block`}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect();
				}
			}}
			{...props}
		>
			{/* Left: Type icon and badge */}
			<div className={styles.typeInfo}>
				<i className={getBlockIcon(block.type)} aria-hidden="true" />
				<Badge
					variant="secondary"
					size="sm"
				>
					{getBlockLabel(block.type)}
				</Badge>
			</div>

			{/* Center: Block preview */}
			<div className={styles.content}>{getBlockPreview(block)}</div>

			{/* Right: Actions */}
			<div className={styles.actions}>
				{onMoveUp && (
					<Button
						isIconOnly
						leftIcon={<ArrowUp size={16} />}
						variant="secondary"
						aria-label="Move up"
						onClick={handleMoveUpClick}
						disabled={!canMoveUp}
					/>
				)}
				{onMoveDown && (
					<Button
						isIconOnly
						leftIcon={<ArrowDown size={16} />}
						variant="secondary"
						aria-label="Move down"
						onClick={handleMoveDownClick}
						disabled={!canMoveDown}
					/>
				)}
				<Button
					isIconOnly
					leftIcon={<Trash2 size={16} />}
					variant="secondary"
					aria-label="Delete block"
					onClick={handleDeleteClick}
				/>
			</div>
		</div>
	);
});

BlockItem.displayName = "BlockItem";
