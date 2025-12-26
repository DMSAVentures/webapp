/**
 * Email Design Templates
 * Pre-built email appearance templates for quick selection
 */

import type { EmailDesign } from "../types/emailBlocks";

/**
 * Email design template with metadata
 */
export interface EmailDesignTemplate {
	id: string;
	name: string;
	description: string;
	design: EmailDesign;
	preview: {
		/** Accent color for thumbnail/preview display */
		accentColor: string;
		/** Whether this is a dark theme */
		isDark: boolean;
	};
}

/**
 * Clean & Minimal - Simple, professional email design
 */
const cleanMinimal: EmailDesignTemplate = {
	id: "clean-minimal",
	name: "Clean & Minimal",
	description: "Simple and professional with clean styling",
	design: {
		colors: {
			primary: "#3b82f6",
			background: "#f8fafc",
			contentBackground: "#ffffff",
			text: "#1f2937",
			secondaryText: "#6b7280",
			link: "#3b82f6",
		},
		typography: {
			fontFamily:
				"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
			fontSize: 16,
			headingWeight: 600,
		},
		spacing: {
			contentPadding: 40,
			blockGap: 16,
		},
		borderRadius: 8,
		footerText: "If you didn't request this email, you can safely ignore it.",
	},
	preview: {
		accentColor: "#3b82f6",
		isDark: false,
	},
};

/**
 * Dark Elegance - Modern dark theme email
 */
const darkElegance: EmailDesignTemplate = {
	id: "dark-elegance",
	name: "Dark Elegance",
	description: "Sleek dark theme with modern styling",
	design: {
		colors: {
			primary: "#8b5cf6",
			background: "#0f0f0f",
			contentBackground: "#1a1a1a",
			text: "#f4f4f5",
			secondaryText: "#a1a1aa",
			link: "#a78bfa",
		},
		typography: {
			fontFamily:
				"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
			fontSize: 16,
			headingWeight: 600,
		},
		spacing: {
			contentPadding: 40,
			blockGap: 18,
		},
		borderRadius: 12,
		footerText: "If you didn't request this email, you can safely ignore it.",
	},
	preview: {
		accentColor: "#8b5cf6",
		isDark: true,
	},
};

/**
 * Bold & Vibrant - Eye-catching with strong colors
 */
const boldVibrant: EmailDesignTemplate = {
	id: "bold-vibrant",
	name: "Bold & Vibrant",
	description: "Eye-catching design with punchy colors",
	design: {
		colors: {
			primary: "#f43f5e",
			background: "#fef2f2",
			contentBackground: "#ffffff",
			text: "#1c1917",
			secondaryText: "#78716c",
			link: "#e11d48",
		},
		typography: {
			fontFamily:
				"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
			fontSize: 16,
			headingWeight: 700,
		},
		spacing: {
			contentPadding: 36,
			blockGap: 16,
		},
		borderRadius: 16,
		footerText: "If you didn't request this email, you can safely ignore it.",
	},
	preview: {
		accentColor: "#f43f5e",
		isDark: false,
	},
};

/**
 * Soft & Rounded - Friendly design with pastel tones
 */
const softRounded: EmailDesignTemplate = {
	id: "soft-rounded",
	name: "Soft & Rounded",
	description: "Friendly and approachable with soft pastel tones",
	design: {
		colors: {
			primary: "#6366f1",
			background: "#f5f3ff",
			contentBackground: "#ffffff",
			text: "#4c1d95",
			secondaryText: "#7c3aed",
			link: "#6366f1",
		},
		typography: {
			fontFamily:
				"'DM Sans', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
			fontSize: 16,
			headingWeight: 600,
		},
		spacing: {
			contentPadding: 44,
			blockGap: 20,
		},
		borderRadius: 24,
		footerText: "If you didn't request this email, you can safely ignore it.",
	},
	preview: {
		accentColor: "#6366f1",
		isDark: false,
	},
};

/**
 * Corporate Professional - Conservative business design
 */
const corporateProfessional: EmailDesignTemplate = {
	id: "corporate-professional",
	name: "Corporate Pro",
	description: "Conservative and business-appropriate design",
	design: {
		colors: {
			primary: "#0f766e",
			background: "#f1f5f9",
			contentBackground: "#ffffff",
			text: "#0f172a",
			secondaryText: "#475569",
			link: "#0d9488",
		},
		typography: {
			fontFamily:
				"'Source Sans Pro', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
			fontSize: 15,
			headingWeight: 600,
		},
		spacing: {
			contentPadding: 32,
			blockGap: 14,
		},
		borderRadius: 4,
		footerText: "If you didn't request this email, you can safely ignore it.",
	},
	preview: {
		accentColor: "#0f766e",
		isDark: false,
	},
};

/**
 * Ocean Breeze - Calm, relaxing blue-green tones
 */
const oceanBreeze: EmailDesignTemplate = {
	id: "ocean-breeze",
	name: "Ocean Breeze",
	description: "Calm and refreshing with blue-green tones",
	design: {
		colors: {
			primary: "#0ea5e9",
			background: "#f0f9ff",
			contentBackground: "#ffffff",
			text: "#0c4a6e",
			secondaryText: "#0369a1",
			link: "#0ea5e9",
		},
		typography: {
			fontFamily:
				"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
			fontSize: 16,
			headingWeight: 600,
		},
		spacing: {
			contentPadding: 40,
			blockGap: 16,
		},
		borderRadius: 10,
		footerText: "If you didn't request this email, you can safely ignore it.",
	},
	preview: {
		accentColor: "#0ea5e9",
		isDark: false,
	},
};

/**
 * Midnight Pro - Premium dark theme with amber accents
 */
const midnightPro: EmailDesignTemplate = {
	id: "midnight-pro",
	name: "Midnight Pro",
	description: "Premium dark theme with warm amber accents",
	design: {
		colors: {
			primary: "#f59e0b",
			background: "#09090b",
			contentBackground: "#18181b",
			text: "#f4f4f5",
			secondaryText: "#a1a1aa",
			link: "#fbbf24",
		},
		typography: {
			fontFamily:
				"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
			fontSize: 16,
			headingWeight: 600,
		},
		spacing: {
			contentPadding: 40,
			blockGap: 16,
		},
		borderRadius: 8,
		footerText: "If you didn't request this email, you can safely ignore it.",
	},
	preview: {
		accentColor: "#f59e0b",
		isDark: true,
	},
};

/**
 * All available email design templates
 */
export const EMAIL_DESIGN_TEMPLATES: EmailDesignTemplate[] = [
	cleanMinimal,
	darkElegance,
	boldVibrant,
	softRounded,
	corporateProfessional,
	oceanBreeze,
	midnightPro,
];

/**
 * Default design template (Clean & Minimal)
 */
export const DEFAULT_EMAIL_DESIGN_TEMPLATE = cleanMinimal;

/**
 * Get a template by ID
 */
export const getEmailTemplateById = (
	id: string,
): EmailDesignTemplate | undefined => {
	return EMAIL_DESIGN_TEMPLATES.find((template) => template.id === id);
};

/**
 * Get the default EmailDesign
 */
export const getDefaultEmailDesign = (): EmailDesign => {
	return { ...DEFAULT_EMAIL_DESIGN_TEMPLATE.design };
};
