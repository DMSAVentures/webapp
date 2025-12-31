/**
 * Email Block Types
 * Defines the structure and types for email content blocks
 */

// ============================================================================
// Email Design Types (similar to FormDesign for form builder)
// ============================================================================

/**
 * Email design configuration for appearance customization
 */
export interface EmailDesign {
	/** Color configuration */
	colors: {
		/** Primary/accent color (buttons, links) */
		primary: string;
		/** Email body background */
		background: string;
		/** Container/card background */
		contentBackground: string;
		/** Primary text color */
		text: string;
		/** Secondary/muted text color */
		secondaryText: string;
		/** Link color */
		link: string;
	};
	/** Typography configuration */
	typography: {
		/** Font family stack */
		fontFamily: string;
		/** Base font size in pixels */
		fontSize: number;
		/** Heading font weight */
		headingWeight: number;
	};
	/** Spacing configuration */
	spacing: {
		/** Content padding in pixels */
		contentPadding: number;
		/** Gap between blocks in pixels */
		blockGap: number;
	};
	/** Container border radius in pixels */
	borderRadius: number;
	/** Optional footer text */
	footerText?: string;
	/** Custom CSS (future use) */
	customCss?: string;
}

/**
 * Default email design values
 */
export const DEFAULT_EMAIL_DESIGN: EmailDesign = {
	colors: {
		primary: "#2563EB",
		background: "#f5f5f5",
		contentBackground: "#ffffff",
		text: "#1a1a1a",
		secondaryText: "#6b6b6b",
		link: "#2563EB",
	},
	typography: {
		fontFamily:
			"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
		fontSize: 16,
		headingWeight: 600,
	},
	spacing: {
		contentPadding: 40,
		blockGap: 16,
	},
	borderRadius: 8,
	footerText:
		"If you didn't sign up for this waitlist, you can safely ignore this email.",
};

// ============================================================================
// Email Block Types
// ============================================================================

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
					"Enter your text here. You can use {{.variables}} to personalize the content.",
				align: "left",
				color: "#4a4a4a",
				fontSize: "medium",
			};
		case "button":
			return {
				id,
				type: "button",
				text: "Click Here",
				url: "{{.referral_link}}",
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

export type EmailTemplateType =
	| "verification"
	| "welcome"
	| "position_update"
	| "reward_earned"
	| "milestone"
	| "custom";

/**
 * Default email structure for different email types
 */
export function getDefaultBlocks(emailType: EmailTemplateType): EmailBlock[] {
	switch (emailType) {
		case "verification":
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
						"Hi {{.first_name}},\n\nThank you for joining the {{.campaign_name}} waitlist! You're currently at position #{{.position}}.",
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
					url: "{{.verification_link}}",
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
					content: "Share to move up the waitlist:\n{{.referral_link}}",
					align: "left",
					color: "#6b6b6b",
					fontSize: "small",
				},
			];

		case "welcome":
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
						"Hi {{.first_name}},\n\nYou've successfully joined the {{.campaign_name}} waitlist!",
					align: "left",
					color: "#4a4a4a",
					fontSize: "medium",
				},
				{
					id: "block-3",
					type: "heading",
					content: "#{{.position}}",
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
					content:
						"Want to move up? Share your unique referral link with friends:",
					align: "left",
					color: "#4a4a4a",
					fontSize: "medium",
				},
				{
					id: "block-7",
					type: "button",
					text: "Share Your Link",
					url: "{{.referral_link}}",
					align: "center",
					backgroundColor: "#2563EB",
					textColor: "#ffffff",
					fullWidth: false,
				},
			];

		case "position_update":
			return [
				{
					id: "block-1",
					type: "heading",
					content: "Your Position Has Changed!",
					level: 1,
					align: "left",
					color: "#1a1a1a",
				},
				{
					id: "block-2",
					type: "paragraph",
					content:
						"Hi {{.first_name}},\n\nGreat news! Your position on the {{.campaign_name}} waitlist has been updated.",
					align: "left",
					color: "#4a4a4a",
					fontSize: "medium",
				},
				{
					id: "block-3",
					type: "heading",
					content: "#{{.position}}",
					level: 2,
					align: "center",
					color: "#2563EB",
				},
				{
					id: "block-4",
					type: "paragraph",
					content: "Your new position",
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
					content: "Keep sharing to move up even faster!",
					align: "left",
					color: "#4a4a4a",
					fontSize: "medium",
				},
				{
					id: "block-7",
					type: "button",
					text: "Share Your Link",
					url: "{{.referral_link}}",
					align: "center",
					backgroundColor: "#2563EB",
					textColor: "#ffffff",
					fullWidth: false,
				},
			];

		case "reward_earned":
			return [
				{
					id: "block-1",
					type: "heading",
					content: "Congratulations! You've Earned a Reward!",
					level: 1,
					align: "left",
					color: "#1a1a1a",
				},
				{
					id: "block-2",
					type: "paragraph",
					content:
						"Hi {{.first_name}},\n\nYour referrals have paid off! You've unlocked a new reward on {{.campaign_name}}.",
					align: "left",
					color: "#4a4a4a",
					fontSize: "medium",
				},
				{
					id: "block-3",
					type: "divider",
					color: "#e5e5e5",
					thickness: "thin",
					style: "solid",
				},
				{
					id: "block-4",
					type: "paragraph",
					content: "Your reward details will be available in your dashboard.",
					align: "left",
					color: "#4a4a4a",
					fontSize: "medium",
				},
				{
					id: "block-5",
					type: "button",
					text: "View My Reward",
					url: "{{.dashboard_link}}",
					align: "center",
					backgroundColor: "#2563EB",
					textColor: "#ffffff",
					fullWidth: false,
				},
				{
					id: "block-6",
					type: "spacer",
					height: "medium",
				},
				{
					id: "block-7",
					type: "paragraph",
					content: "Keep referring friends to unlock more rewards!",
					align: "center",
					color: "#6b6b6b",
					fontSize: "small",
				},
			];

		case "milestone":
			return [
				{
					id: "block-1",
					type: "heading",
					content: "Milestone Reached!",
					level: 1,
					align: "left",
					color: "#1a1a1a",
				},
				{
					id: "block-2",
					type: "paragraph",
					content:
						"Hi {{.first_name}},\n\nExciting news! The {{.campaign_name}} waitlist has reached a new milestone.",
					align: "left",
					color: "#4a4a4a",
					fontSize: "medium",
				},
				{
					id: "block-3",
					type: "spacer",
					height: "small",
				},
				{
					id: "block-4",
					type: "paragraph",
					content:
						"Thank you for being part of this journey. Your support means everything to us!",
					align: "left",
					color: "#4a4a4a",
					fontSize: "medium",
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
					content:
						"Your current position: #{{.position}}\n\nShare with friends to move up:",
					align: "left",
					color: "#6b6b6b",
					fontSize: "small",
				},
				{
					id: "block-7",
					type: "button",
					text: "Share the News",
					url: "{{.referral_link}}",
					align: "center",
					backgroundColor: "#2563EB",
					textColor: "#ffffff",
					fullWidth: false,
				},
			];

		case "custom":
		default:
			return [
				{
					id: "block-1",
					type: "heading",
					content: "Your Heading Here",
					level: 1,
					align: "left",
					color: "#1a1a1a",
				},
				{
					id: "block-2",
					type: "paragraph",
					content:
						"Hi {{.first_name}},\n\nAdd your custom message here. You can use variables like {{.campaign_name}}, {{.position}}, and {{.referral_link}}.",
					align: "left",
					color: "#4a4a4a",
					fontSize: "medium",
				},
				{
					id: "block-3",
					type: "spacer",
					height: "medium",
				},
				{
					id: "block-4",
					type: "button",
					text: "Call to Action",
					url: "{{.referral_link}}",
					align: "center",
					backgroundColor: "#2563EB",
					textColor: "#ffffff",
					fullWidth: false,
				},
			];
	}
}
