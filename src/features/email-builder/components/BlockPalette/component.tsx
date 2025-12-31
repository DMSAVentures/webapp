/**
 * BlockPalette Component
 * Displays available email block types that can be added
 */

import {
	FileText,
	Heading,
	Image,
	type LucideIcon,
	Minus,
	MousePointer2,
	Plus,
	Space,
} from "lucide-react";
import { type HTMLAttributes, memo } from "react";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Text } from "@/proto-design-system/components/primitives/Text";
import { BLOCK_TYPES, type EmailBlockType } from "../../types/emailBlocks";
import styles from "./component.module.scss";

/** Map block type to Lucide icon */
const blockIcons: Record<EmailBlockType, LucideIcon> = {
	heading: Heading,
	paragraph: FileText,
	button: MousePointer2,
	divider: Minus,
	spacer: Space,
	image: Image,
};

export interface BlockPaletteProps extends HTMLAttributes<HTMLDivElement> {
	/** Callback when a block type is selected */
	onBlockSelect: (blockType: EmailBlockType) => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * BlockPalette displays available email block types
 */
export const BlockPalette = memo<BlockPaletteProps>(function BlockPalette({
	onBlockSelect,
	className: customClassName,
	...props
}) {
	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	return (
		<Stack gap="md" className={classNames} {...props}>
			<Stack gap="xs" className={styles.header}>
				<Text as="h3" size="md" weight="semibold">
					Add Content
				</Text>
				<Text size="sm" color="muted">
					Click to add blocks
				</Text>
			</Stack>

			<Stack gap="sm" className={styles.blocks}>
				{BLOCK_TYPES.map((block) => (
					<button
						key={block.type}
						type="button"
						className={styles.blockItem}
						onClick={() => onBlockSelect(block.type)}
						aria-label={`Add ${block.label} block`}
					>
						<Icon
							icon={blockIcons[block.type]}
							size="md"
							color="secondary"
							className={styles.icon}
						/>
						<Stack gap="0" className={styles.blockInfo}>
							<Text size="sm" weight="medium">
								{block.label}
							</Text>
							<Text size="xs" color="muted">
								{block.description}
							</Text>
						</Stack>
						<Icon icon={Plus} size="sm" color="muted" />
					</button>
				))}
			</Stack>
		</Stack>
	);
});

BlockPalette.displayName = "BlockPalette";
