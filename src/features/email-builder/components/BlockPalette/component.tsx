/**
 * BlockPalette Component
 * Displays available email block types that can be added
 */

import { type HTMLAttributes, memo } from "react";
import {
	BLOCK_TYPES,
	type EmailBlockType,
} from "../../types/emailBlocks";
import styles from "./component.module.scss";

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
		<div className={classNames} {...props}>
			<div className={styles.header}>
				<h3 className={styles.title}>Add Content</h3>
				<p className={styles.subtitle}>Click to add blocks</p>
			</div>

			<div className={styles.blocks}>
				{BLOCK_TYPES.map((block) => (
					<button
						key={block.type}
						type="button"
						className={styles.blockItem}
						onClick={() => onBlockSelect(block.type)}
						aria-label={`Add ${block.label} block`}
					>
						<i className={`${block.icon} ${styles.icon}`} aria-hidden="true" />
						<div className={styles.blockInfo}>
							<span className={styles.blockLabel}>{block.label}</span>
							<span className={styles.blockDescription}>
								{block.description}
							</span>
						</div>
						<i className="ri-add-line" aria-hidden="true" />
					</button>
				))}
			</div>
		</div>
	);
});

BlockPalette.displayName = "BlockPalette";
