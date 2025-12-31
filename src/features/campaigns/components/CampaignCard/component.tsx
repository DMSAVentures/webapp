/**
 * CampaignCard Component
 * Displays campaign summary in list/grid view
 */

import {
	type HTMLAttributes,
	memo,
} from "react";
import { Calendar, Share2, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { Campaign } from "@/types/campaign";
import styles from "./component.module.scss";

export interface CampaignCardProps extends HTMLAttributes<HTMLDivElement> {
	/** Campaign data to display */
	campaign: Campaign;
	/** Show statistics in the card */
	showStats?: boolean;
	/** Additional CSS class name */
	className?: string;
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Maps campaign status to Badge variant */
function getStatusVariant(
	status: Campaign["status"],
): "success" | "warning" | "secondary" | "primary" {
	switch (status) {
		case "active":
			return "success";
		case "draft":
			return "warning";
		case "paused":
			return "secondary";
		case "completed":
			return "primary";
		default:
			return "secondary";
	}
}

/** Converts status text to title case */
function toTitleCase(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/** Formats campaign date for display */
function formatCampaignDate(campaign: Campaign): string {
	if (campaign.status === "completed" && campaign.endDate) {
		const dateStr = new Date(campaign.endDate).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
		return `Completed ${dateStr}`;
	}

	if (campaign.createdAt && !isNaN(new Date(campaign.createdAt).getTime())) {
		const dateStr = new Date(campaign.createdAt).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
		return `Created ${dateStr}`;
	}

	return "Created Unknown";
}

/** Calculates K-Factor from signups and referrals */
function calculateKFactor(
	totalSignups: number,
	totalReferrals: number,
): string {
	if (totalSignups === 0) return "0.0";
	return (totalReferrals / totalSignups).toFixed(1);
}

// ============================================================================
// Component
// ============================================================================

/**
 * CampaignCard displays a summary of a campaign
 */
export const CampaignCard = memo<CampaignCardProps>(function CampaignCard({
	campaign,
	showStats = false,
	className: customClassName,
	onClick,
	...props
}) {
	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	return (
		<div
			className={classNames}
			onClick={onClick}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
			{...props}
		>
			<Stack gap="sm">
				{/* Header */}
				<Stack direction="row" justify="between" align="center">
					<Text as="h3" size="md" weight="semibold" className={styles.title}>{campaign.name}</Text>
					<Badge variant={getStatusVariant(campaign.status)} size="sm">
						{toTitleCase(campaign.status)}
					</Badge>
				</Stack>

				{/* Description */}
				{campaign.description && (
					<Text size="sm" color="muted" className={styles.description}>
						{campaign.description}
					</Text>
				)}

				{/* Stats */}
				{showStats && campaign.totalSignups !== undefined && (
					<div className={styles.statsRow}>
						<div className={styles.statItem}>
							<div className={styles.statIcon}>
								<Icon icon={Users} size="sm" />
							</div>
							<div className={styles.statContent}>
								<Text size="xl" weight="semibold">{campaign.totalSignups.toLocaleString()}</Text>
								<Text size="xs" color="muted">Signups</Text>
							</div>
						</div>
						<div className={styles.statItem}>
							<div className={styles.statIcon}>
								<Icon icon={Share2} size="sm" />
							</div>
							<div className={styles.statContent}>
								<Text size="xl" weight="semibold">{campaign.totalReferrals.toLocaleString()}</Text>
								<Text size="xs" color="muted">Referrals</Text>
							</div>
						</div>
						<div className={styles.statItem}>
							<div className={styles.statIcon}>
								<Icon icon={TrendingUp} size="sm" />
							</div>
							<div className={styles.statContent}>
								<Text size="xl" weight="semibold">
									{calculateKFactor(campaign.totalSignups, campaign.totalReferrals)}
								</Text>
								<Text size="xs" color="muted">K-Factor</Text>
							</div>
						</div>
					</div>
				)}

				{/* Footer */}
				<div className={styles.footer}>
					<Icon icon={Calendar} size="xs" color="muted" />
					<Text size="xs" color="muted">{formatCampaignDate(campaign)}</Text>
				</div>
			</Stack>
		</div>
	);
});

CampaignCard.displayName = "CampaignCard";
