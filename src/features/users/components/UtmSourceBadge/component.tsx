/**
 * UtmSourceBadge Component
 * Displays UTM source with an appropriate icon using proto Badge
 */

import { memo } from "react";
import { Badge } from "@/proto-design-system/badge/badge";

export interface UtmSourceBadgeProps {
	/** UTM source value */
	source: string | undefined;
}

type BadgeVariant =
	| "gray"
	| "blue"
	| "orange"
	| "red"
	| "green"
	| "purple"
	| "yellow"
	| "pink"
	| "sky"
	| "teal";

interface SourceConfig {
	icon: string;
	color: BadgeVariant;
}

/**
 * Get icon and color config for UTM source
 */
const getUtmSourceConfig = (source: string | undefined): SourceConfig => {
	if (!source) return { icon: "global-line", color: "gray" };

	const sourceMap: Record<string, SourceConfig> = {
		google: { icon: "google-fill", color: "blue" },
		facebook: { icon: "facebook-fill", color: "blue" },
		twitter: { icon: "twitter-x-fill", color: "gray" },
		linkedin: { icon: "linkedin-fill", color: "blue" },
		instagram: { icon: "instagram-fill", color: "pink" },
		whatsapp: { icon: "whatsapp-fill", color: "green" },
		email: { icon: "mail-fill", color: "gray" },
		referral: { icon: "share-forward-fill", color: "purple" },
		direct: { icon: "global-line", color: "gray" },
		slack: { icon: "slack-fill", color: "purple" },
		youtube: { icon: "youtube-fill", color: "red" },
		tiktok: { icon: "tiktok-fill", color: "pink" },
		reddit: { icon: "reddit-fill", color: "orange" },
		producthunt: { icon: "product-hunt-fill", color: "orange" },
		pinterest: { icon: "pinterest-fill", color: "red" },
		telegram: { icon: "telegram-fill", color: "sky" },
		discord: { icon: "discord-fill", color: "purple" },
		snapchat: { icon: "snapchat-fill", color: "yellow" },
		bing: { icon: "bing-fill", color: "teal" },
		cpc: { icon: "advertisement-fill", color: "orange" },
		organic: { icon: "seedling-fill", color: "green" },
		social: { icon: "share-fill", color: "blue" },
	};

	const lowerSource = source.toLowerCase();
	return sourceMap[lowerSource] || { icon: "global-line", color: "gray" };
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

		const config = getUtmSourceConfig(source);
		const displayText = capitalizeSource(source);

		return (
			<Badge
				text={displayText}
				variant={config.color}
				styleType="filled"
				size="small"
				iconClass={config.icon}
				iconPosition="left"
			/>
		);
	},
);

UtmSourceBadge.displayName = "UtmSourceBadge";
