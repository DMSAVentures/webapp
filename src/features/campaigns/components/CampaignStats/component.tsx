/**
 * CampaignStats Component
 * Display campaign statistics using proto design system StatCard
 */

import { BadgeCheck, Share2, TrendingUp, Users } from "lucide-react";
import { type HTMLAttributes, memo } from "react";
import { StatCard } from "@/proto-design-system/components/data/StatCard";
import type { CampaignStats as CampaignStatsType } from "@/types/common.types";
import styles from "./component.module.scss";

export interface CampaignStatsProps extends HTMLAttributes<HTMLDivElement> {
	/** Campaign statistics to display */
	stats: CampaignStatsType;
	/** Show loading state */
	loading?: boolean;
	/** Whether email verification is enabled for the campaign */
	verificationEnabled?: boolean;
	/** Whether referrals are enabled for the campaign */
	referralsEnabled?: boolean;
	/** Click handler for stat cards */
	onCardClick?: (
		cardType: "totalSignups" | "verified" | "referrals" | "kFactor",
	) => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Format number with commas for thousands
 */
const formatNumber = (num: number): string => {
	return num.toLocaleString("en-US");
};

/**
 * Format percentage
 */
const formatPercentage = (num: number): string => {
	return `${num.toFixed(1)}%`;
};

/**
 * Format coefficient (K-Factor)
 */
const formatCoefficient = (num: number): string => {
	return num.toFixed(1);
};

/**
 * CampaignStats displays key performance indicators using StatCard
 */
export const CampaignStats = memo<CampaignStatsProps>(function CampaignStats({
	stats,
	loading = false,
	verificationEnabled = true,
	referralsEnabled = true,
	onCardClick,
	className: customClassName,
	...props
}) {
	const classNames = [styles.root, loading && styles.loading, customClassName]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={classNames} {...props}>
			{/* Total Signups */}
			<StatCard
				label="TOTAL SIGNUPS"
				value={formatNumber(stats.totalSignups)}
				numericValue={stats.totalSignups}
				formatValue={formatNumber}
				icon={<Users />}
				trend="up"
				trendValue="+12%"
				description="from last week"
				onClick={onCardClick ? () => onCardClick("totalSignups") : undefined}
			/>

			{/* Verified Signups - only show if verification is enabled */}
			{verificationEnabled && (
				<StatCard
					label="VERIFIED"
					value={formatNumber(stats.verifiedSignups)}
					numericValue={stats.verifiedSignups}
					formatValue={formatNumber}
					icon={<BadgeCheck />}
					description={`${formatPercentage(stats.conversionRate)} rate`}
					onClick={onCardClick ? () => onCardClick("verified") : undefined}
				/>
			)}

			{/* Total Referrals - only show if referrals are enabled */}
			{referralsEnabled && (
				<StatCard
					label="REFERRALS"
					value={formatNumber(stats.totalReferrals)}
					numericValue={stats.totalReferrals}
					formatValue={formatNumber}
					icon={<Share2 />}
					trend="up"
					trendValue="+5"
					description="this week"
					onClick={onCardClick ? () => onCardClick("referrals") : undefined}
				/>
			)}

			{/* Viral Coefficient (K-Factor) - only show if referrals are enabled */}
			{referralsEnabled && (
				<StatCard
					label="K-FACTOR"
					value={formatCoefficient(stats.viralCoefficient)}
					icon={<TrendingUp />}
					description="Viral coefficient"
					onClick={onCardClick ? () => onCardClick("kFactor") : undefined}
				/>
			)}
		</div>
	);
});

CampaignStats.displayName = "CampaignStats";
