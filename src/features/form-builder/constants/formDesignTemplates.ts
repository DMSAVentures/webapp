import type { FormDesign } from "@/types/common.types";

/**
 * Pre-baked form design templates for quick selection
 */
export interface FormDesignTemplate {
	id: string;
	name: string;
	description: string;
	design: FormDesign;
	preview: {
		/** Accent color for thumbnail/preview display */
		accentColor: string;
		/** Whether this is a dark theme */
		isDark: boolean;
	};
}

/**
 * Clean & Minimal - Simple, professional look with subtle styling
 */
const cleanMinimal: FormDesignTemplate = {
	id: "clean-minimal",
	name: "Clean & Minimal",
	description: "Simple and professional with subtle styling",
	design: {
		layout: "single-column",
		colors: {
			primary: "#3b82f6",
			background: "#ffffff",
			text: "#1f2937",
			border: "#e5e7eb",
			error: "#ef4444",
			success: "#10b981",
		},
		typography: {
			fontFamily: "Inter, system-ui, sans-serif",
			fontSize: 16,
			fontWeight: 400,
		},
		spacing: {
			padding: 24,
			gap: 20,
		},
		borderRadius: 8,
		submitButtonText: "Submit",
	},
	preview: {
		accentColor: "#3b82f6",
		isDark: false,
	},
};

/**
 * Dark Elegance - Modern dark theme with sleek appearance
 */
const darkElegance: FormDesignTemplate = {
	id: "dark-elegance",
	name: "Dark Elegance",
	description: "Modern dark theme with a sleek, sophisticated look",
	design: {
		layout: "single-column",
		colors: {
			primary: "#8b5cf6",
			background: "#18181b",
			text: "#fafafa",
			border: "#3f3f46",
			error: "#f87171",
			success: "#34d399",
		},
		typography: {
			fontFamily: "Inter, system-ui, sans-serif",
			fontSize: 16,
			fontWeight: 400,
		},
		spacing: {
			padding: 28,
			gap: 20,
		},
		borderRadius: 12,
		submitButtonText: "Get Started",
	},
	preview: {
		accentColor: "#8b5cf6",
		isDark: true,
	},
};

/**
 * Bold & Vibrant - Eye-catching design with strong colors
 */
const boldVibrant: FormDesignTemplate = {
	id: "bold-vibrant",
	name: "Bold & Vibrant",
	description: "Eye-catching design with punchy colors",
	design: {
		layout: "single-column",
		colors: {
			primary: "#f43f5e",
			background: "#fef2f2",
			text: "#1c1917",
			border: "#fecaca",
			error: "#dc2626",
			success: "#16a34a",
		},
		typography: {
			fontFamily: "Inter, system-ui, sans-serif",
			fontSize: 16,
			fontWeight: 500,
		},
		spacing: {
			padding: 24,
			gap: 18,
		},
		borderRadius: 16,
		submitButtonText: "Join Now",
	},
	preview: {
		accentColor: "#f43f5e",
		isDark: false,
	},
};

/**
 * Soft & Rounded - Friendly design with pastel tones
 */
const softRounded: FormDesignTemplate = {
	id: "soft-rounded",
	name: "Soft & Rounded",
	description: "Friendly and approachable with soft pastel tones",
	design: {
		layout: "single-column",
		colors: {
			primary: "#6366f1",
			background: "#f5f3ff",
			text: "#4c1d95",
			border: "#c4b5fd",
			error: "#e11d48",
			success: "#059669",
		},
		typography: {
			fontFamily: "'DM Sans', Inter, system-ui, sans-serif",
			fontSize: 16,
			fontWeight: 400,
		},
		spacing: {
			padding: 28,
			gap: 22,
		},
		borderRadius: 24,
		submitButtonText: "Sign Me Up",
	},
	preview: {
		accentColor: "#6366f1",
		isDark: false,
	},
};

/**
 * Corporate Professional - Conservative and business-appropriate
 */
const corporateProfessional: FormDesignTemplate = {
	id: "corporate-professional",
	name: "Corporate Pro",
	description: "Conservative and business-appropriate design",
	design: {
		layout: "single-column",
		colors: {
			primary: "#0f766e",
			background: "#ffffff",
			text: "#0f172a",
			border: "#cbd5e1",
			error: "#dc2626",
			success: "#15803d",
		},
		typography: {
			fontFamily: "'Source Sans Pro', Inter, system-ui, sans-serif",
			fontSize: 15,
			fontWeight: 400,
		},
		spacing: {
			padding: 20,
			gap: 16,
		},
		borderRadius: 4,
		submitButtonText: "Submit",
	},
	preview: {
		accentColor: "#0f766e",
		isDark: false,
	},
};

/**
 * Ocean Breeze - Calm, relaxing blue-green tones
 */
const oceanBreeze: FormDesignTemplate = {
	id: "ocean-breeze",
	name: "Ocean Breeze",
	description: "Calm and refreshing with blue-green tones",
	design: {
		layout: "single-column",
		colors: {
			primary: "#0ea5e9",
			background: "#f0f9ff",
			text: "#0c4a6e",
			border: "#bae6fd",
			error: "#f43f5e",
			success: "#10b981",
		},
		typography: {
			fontFamily: "Inter, system-ui, sans-serif",
			fontSize: 16,
			fontWeight: 400,
		},
		spacing: {
			padding: 26,
			gap: 20,
		},
		borderRadius: 10,
		submitButtonText: "Join Waitlist",
	},
	preview: {
		accentColor: "#0ea5e9",
		isDark: false,
	},
};

/**
 * Midnight Pro - Premium dark theme with amber accents
 */
const midnightPro: FormDesignTemplate = {
	id: "midnight-pro",
	name: "Midnight Pro",
	description: "Premium dark theme with warm amber accents",
	design: {
		layout: "single-column",
		colors: {
			primary: "#f59e0b",
			background: "#0f0f0f",
			text: "#f5f5f4",
			border: "#2a2a2a",
			error: "#ef4444",
			success: "#22c55e",
		},
		typography: {
			fontFamily: "Inter, system-ui, sans-serif",
			fontSize: 16,
			fontWeight: 400,
		},
		spacing: {
			padding: 28,
			gap: 20,
		},
		borderRadius: 8,
		submitButtonText: "Get Early Access",
	},
	preview: {
		accentColor: "#f59e0b",
		isDark: true,
	},
};

/**
 * All available form design templates
 */
export const FORM_DESIGN_TEMPLATES: FormDesignTemplate[] = [
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
export const DEFAULT_DESIGN_TEMPLATE = cleanMinimal;

/**
 * Get a template by ID
 */
export const getTemplateById = (id: string): FormDesignTemplate | undefined => {
	return FORM_DESIGN_TEMPLATES.find((template) => template.id === id);
};

/**
 * Get the default FormDesign
 */
export const getDefaultDesign = (): FormDesign => {
	return { ...DEFAULT_DESIGN_TEMPLATE.design };
};
