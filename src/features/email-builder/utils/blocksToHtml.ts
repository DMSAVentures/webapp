/**
 * Blocks to HTML Converter
 * Converts email blocks to HTML for email templates
 */

import type {
	ButtonBlock,
	DividerBlock,
	EmailBlock,
	HeadingBlock,
	ParagraphBlock,
	SpacerBlock,
} from "../types/emailBlocks";

/**
 * Escape HTML entities
 */
function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * Convert newlines to <br> tags
 */
function nl2br(text: string): string {
	return text.replace(/\n/g, "<br>");
}

/**
 * Get font size in pixels
 */
function getFontSize(size: "small" | "medium" | "large"): number {
	switch (size) {
		case "small":
			return 14;
		case "medium":
			return 16;
		case "large":
			return 18;
		default:
			return 16;
	}
}

/**
 * Get heading font size
 */
function getHeadingSize(level: 1 | 2 | 3): number {
	switch (level) {
		case 1:
			return 24;
		case 2:
			return 20;
		case 3:
			return 18;
		default:
			return 24;
	}
}

/**
 * Get spacer height in pixels
 */
function getSpacerHeight(height: "small" | "medium" | "large"): number {
	switch (height) {
		case "small":
			return 16;
		case "medium":
			return 32;
		case "large":
			return 48;
		default:
			return 32;
	}
}

/**
 * Get divider thickness in pixels
 */
function getDividerThickness(thickness: "thin" | "medium" | "thick"): number {
	switch (thickness) {
		case "thin":
			return 1;
		case "medium":
			return 2;
		case "thick":
			return 4;
		default:
			return 1;
	}
}

/**
 * Convert a heading block to HTML
 */
function headingToHtml(block: HeadingBlock): string {
	const fontSize = getHeadingSize(block.level);
	const tag = `h${block.level}`;
	const content = nl2br(escapeHtml(block.content));

	return `<${tag} style="color: ${block.color}; font-size: ${fontSize}px; font-weight: 600; margin: 0 0 16px 0; text-align: ${block.align};">
      ${content}
    </${tag}>`;
}

/**
 * Convert a paragraph block to HTML
 */
function paragraphToHtml(block: ParagraphBlock): string {
	const fontSize = getFontSize(block.fontSize);
	const content = nl2br(escapeHtml(block.content));

	return `<p style="color: ${block.color}; font-size: ${fontSize}px; line-height: 1.6; margin: 0 0 16px 0; text-align: ${block.align};">
      ${content}
    </p>`;
}

/**
 * Convert a button block to HTML
 */
function buttonToHtml(block: ButtonBlock): string {
	const width = block.fullWidth ? "width: 100%;" : "";
	const display = block.fullWidth ? "display: block;" : "display: inline-block;";

	return `<div style="text-align: ${block.align}; margin: 24px 0;">
      <a href="${escapeHtml(block.url)}"
         style="${display} background-color: ${block.backgroundColor}; color: ${block.textColor};
                padding: 14px 32px; text-decoration: none; border-radius: 6px;
                font-size: 16px; font-weight: 600; ${width}">
        ${escapeHtml(block.text)}
      </a>
    </div>`;
}

/**
 * Convert a divider block to HTML
 */
function dividerToHtml(block: DividerBlock): string {
	const thickness = getDividerThickness(block.thickness);

	return `<hr style="border: none; border-top: ${thickness}px ${block.style} ${block.color}; margin: 24px 0;" />`;
}

/**
 * Convert a spacer block to HTML
 */
function spacerToHtml(block: SpacerBlock): string {
	const height = getSpacerHeight(block.height);

	return `<div style="height: ${height}px;"></div>`;
}

/**
 * Convert a single block to HTML
 */
function blockToHtml(block: EmailBlock): string {
	switch (block.type) {
		case "heading":
			return headingToHtml(block);
		case "paragraph":
			return paragraphToHtml(block);
		case "button":
			return buttonToHtml(block);
		case "divider":
			return dividerToHtml(block);
		case "spacer":
			return spacerToHtml(block);
		case "image":
			// Image handling can be added later
			return "";
		default:
			return "";
	}
}

/**
 * Convert an array of blocks to complete HTML email
 */
export function blocksToHtml(blocks: EmailBlock[]): string {
	const bodyContent = blocks.map(blockToHtml).join("\n");

	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f5f5f5;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    ${bodyContent}
  </div>

  <p style="color: #9a9a9a; font-size: 12px; text-align: center; margin-top: 24px;">
    If you didn't sign up for this waitlist, you can safely ignore this email.
  </p>
</body>
</html>`;
}

/**
 * Convert blocks to plain text
 */
export function blocksToText(blocks: EmailBlock[]): string {
	return blocks
		.map((block) => {
			switch (block.type) {
				case "heading":
					return block.content + "\n";
				case "paragraph":
					return block.content + "\n";
				case "button":
					return `${block.text}: ${block.url}\n`;
				case "divider":
					return "---\n";
				case "spacer":
					return "\n";
				default:
					return "";
			}
		})
		.join("\n")
		.trim();
}

/**
 * Parse HTML back to blocks (basic implementation)
 * This is a simplified parser for backwards compatibility
 */
export function htmlToBlocks(html: string): EmailBlock[] | null {
	// This is a basic implementation - could be enhanced for better parsing
	// For now, return null to indicate parsing failed and use defaults
	if (!html || html.trim() === "") {
		return null;
	}

	// Check if HTML looks like block-based structure
	// This is a heuristic check - actual parsing would be more complex
	const hasBlockStructure =
		html.includes('style="') &&
		(html.includes("<h1") || html.includes("<h2") || html.includes("<p"));

	if (!hasBlockStructure) {
		return null;
	}

	// For existing HTML templates, return null to use block defaults
	// A more sophisticated parser could be implemented if needed
	return null;
}
