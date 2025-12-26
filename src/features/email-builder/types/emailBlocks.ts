/**
 * Email Block Types
 * Defines the structure and types for email content blocks
 */

export type EmailBlockType =
	| "heading"
	| "paragraph"
	| "button"
	| "divider"
	| "spacer"
	| "image";

export interface BaseEmailBlock {
	id: string;
	type: EmailBlockType;
}

export interface HeadingBlock extends BaseEmailBlock {
	type: "heading";
	content: string;
	level: 1 | 2 | 3;
	align: "left" | "center" | "right";
	color: string;
}

export interface ParagraphBlock extends BaseEmailBlock {
	type: "paragraph";
	content: string;
	align: "left" | "center" | "right";
	color: string;
	fontSize: "small" | "medium" | "large";
}

export interface ButtonBlock extends BaseEmailBlock {
	type: "button";
	text: string;
	url: string;
	align: "left" | "center" | "right";
	backgroundColor: string;
	textColor: string;
	fullWidth: boolean;
}

export interface DividerBlock extends BaseEmailBlock {
	type: "divider";
	color: string;
	thickness: "thin" | "medium" | "thick";
	style: "solid" | "dashed" | "dotted";
}

export interface SpacerBlock extends BaseEmailBlock {
	type: "spacer";
	height: "small" | "medium" | "large";
}

export interface ImageBlock extends BaseEmailBlock {
	type: "image";
	src: string;
	alt: string;
	align: "left" | "center" | "right";
	width: "auto" | "full" | "half";
}

export type EmailBlock =
	| HeadingBlock
	| ParagraphBlock
	| ButtonBlock
	| DividerBlock
	| SpacerBlock
	| ImageBlock;

/**
 * Block type metadata for the palette
 */
export interface BlockTypeInfo {
	type: EmailBlockType;
	label: string;
	icon: string;
	description: string;
}

export const BLOCK_TYPES: BlockTypeInfo[] = [
	{
		type: "heading",
		label: "Heading",
		icon: "ri-heading",
		description: "Add a title or heading",
	},
	{
		type: "paragraph",
		label: "Text",
		icon: "ri-text",
		description: "Add body text content",
	},
	{
		type: "button",
		label: "Button",
		icon: "ri-cursor-line",
		description: "Add a call-to-action button",
	},
	{
		type: "divider",
		label: "Divider",
		icon: "ri-separator",
		description: "Add a horizontal line",
	},
	{
		type: "spacer",
		label: "Spacer",
		icon: "ri-space",
		description: "Add vertical spacing",
	},
];

/**
 * Create a new block with default values
 */
export function createBlock(type: EmailBlockType): EmailBlock {
	const id = `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

	switch (type) {
		case "heading":
			return {
				id,
				type: "heading",
				content: "Your Heading Here",
				level: 1,
				align: "left",
				color: "#1a1a1a",
			};
		case "paragraph":
			return {
				id,
				type: "paragraph",
				content:
					"Enter your text here. You can use {{variables}} to personalize the content.",
				align: "left",
				color: "#4a4a4a",
				fontSize: "medium",
			};
		case "button":
			return {
				id,
				type: "button",
				text: "Click Here",
				url: "{{referral_link}}",
				align: "center",
				backgroundColor: "#2563EB",
				textColor: "#ffffff",
				fullWidth: false,
			};
		case "divider":
			return {
				id,
				type: "divider",
				color: "#e5e5e5",
				thickness: "thin",
				style: "solid",
			};
		case "spacer":
			return {
				id,
				type: "spacer",
				height: "medium",
			};
		case "image":
			return {
				id,
				type: "image",
				src: "",
				alt: "",
				align: "center",
				width: "auto",
			};
		default:
			throw new Error(`Unknown block type: ${type}`);
	}
}

/**
 * Default email structure for different email types
 */
export function getDefaultBlocks(
	emailType: "verification" | "welcome",
): EmailBlock[] {
	if (emailType === "verification") {
		return [
			{
				id: "block-1",
				type: "heading",
				content: "Verify Your Email",
				level: 1,
				align: "left",
				color: "#1a1a1a",
			},
			{
				id: "block-2",
				type: "paragraph",
				content:
					"Hi {{first_name}},\n\nThank you for joining the {{campaign_name}} waitlist! You're currently at position #{{position}}.",
				align: "left",
				color: "#4a4a4a",
				fontSize: "medium",
			},
			{
				id: "block-3",
				type: "paragraph",
				content: "Please verify your email address to secure your spot:",
				align: "left",
				color: "#4a4a4a",
				fontSize: "medium",
			},
			{
				id: "block-4",
				type: "button",
				text: "Verify Email",
				url: "{{verification_link}}",
				align: "center",
				backgroundColor: "#2563EB",
				textColor: "#ffffff",
				fullWidth: false,
			},
			{
				id: "block-5",
				type: "divider",
				color: "#e5e5e5",
				thickness: "thin",
				style: "solid",
			},
			{
				id: "block-6",
				type: "paragraph",
				content: "Share to move up the waitlist:\n{{referral_link}}",
				align: "left",
				color: "#6b6b6b",
				fontSize: "small",
			},
		];
	}

	// Welcome email
	return [
		{
			id: "block-1",
			type: "heading",
			content: "Welcome to the Waitlist!",
			level: 1,
			align: "left",
			color: "#1a1a1a",
		},
		{
			id: "block-2",
			type: "paragraph",
			content:
				"Hi {{first_name}},\n\nYou've successfully joined the {{campaign_name}} waitlist!",
			align: "left",
			color: "#4a4a4a",
			fontSize: "medium",
		},
		{
			id: "block-3",
			type: "heading",
			content: "#{{position}}",
			level: 2,
			align: "center",
			color: "#1a1a1a",
		},
		{
			id: "block-4",
			type: "paragraph",
			content: "Your current position",
			align: "center",
			color: "#6b6b6b",
			fontSize: "small",
		},
		{
			id: "block-5",
			type: "spacer",
			height: "medium",
		},
		{
			id: "block-6",
			type: "paragraph",
			content: "Want to move up? Share your unique referral link with friends:",
			align: "left",
			color: "#4a4a4a",
			fontSize: "medium",
		},
		{
			id: "block-7",
			type: "button",
			text: "Share Your Link",
			url: "{{referral_link}}",
			align: "center",
			backgroundColor: "#2563EB",
			textColor: "#ffffff",
			fullWidth: false,
		},
	];
}
