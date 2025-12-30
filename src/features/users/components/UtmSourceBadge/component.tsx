/**
 * UtmSourceBadge Component
 * Displays UTM source with an appropriate icon using proto Badge
 */

import { memo } from "react";
import { Badge, type BadgeVariant } from "@/proto-design-system";

export interface UtmSourceBadgeProps {
	/** UTM source value */
	source: string | undefined;
}

/**
 * Get badge variant for UTM source
 */
const getUtmSourceVariant = (source: string | undefined): BadgeVariant => {
	if (!source) return "secondary";

	const sourceMap: Record<string, BadgeVariant> = {
		google: "primary",
		facebook: "primary",
		twitter: "secondary",
		linkedin: "primary",
		instagram: "secondary",
		whatsapp: "success",
		email: "secondary",
		referral: "secondary",
		direct: "secondary",
		slack: "secondary",
		youtube: "error",
		tiktok: "secondary",
		reddit: "warning",
		producthunt: "warning",
		pinterest: "error",
		telegram: "primary",
		discord: "secondary",
		snapchat: "warning",
		bing: "primary",
		cpc: "warning",
		organic: "success",
		social: "primary",
	};

	const lowerSource = source.toLowerCase();
	return sourceMap[lowerSource] || "secondary";
};

/**
 * Capitalize first letter of string
 */
const capitalizeSource = (source: string | undefined): string => {
	if (!source) return "-";
	return source.charAt(0).toUpperCase() + source.slice(1);
};

/**
 * UtmSourceBadge displays a UTM source with an icon
 */
export const UtmSourceBadge = memo<UtmSourceBadgeProps>(
	function UtmSourceBadge({ source }) {
		if (!source) {
			return <span>-</span>;
		}

		const variant = getUtmSourceVariant(source);
		const displayText = capitalizeSource(source);

		return (
			<Badge variant={variant} size="sm">
				{displayText}
			</Badge>
		);
	},
);

UtmSourceBadge.displayName = "UtmSourceBadge";
