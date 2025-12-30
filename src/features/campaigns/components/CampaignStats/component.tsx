/**
 * CampaignStats Component
 * Display campaign statistics with KPI cards
 */

import { type HTMLAttributes, memo } from "react";
import { ArrowDown, ArrowUp, LineChart, Share2, UserPlus, Verified } from "lucide-react";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
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
	return num.toFixed(2);
};

/**
 * CampaignStats displays key performance indicators
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
			<div
				className={`${styles.statCard} ${onCardClick ? styles.statCardClickable : ""}`}
				onClick={() => onCardClick?.("totalSignups")}
				role={onCardClick ? "button" : undefined}
				tabIndex={onCardClick ? 0 : undefined}
			>
				<div className={styles.statIcon}>
					<Icon icon={UserPlus} size="lg" />
				</div>
				<Stack gap="xs" className={styles.statContent}>
					<Text size="sm" weight="medium" color="muted" className={styles.statLabel}>Total Signups</Text>
					<div className={styles.statValue}>
						{loading ? (
							<div className={styles.skeleton} />
						) : (
							<Text size="xl" weight="bold">{formatNumber(stats.totalSignups)}</Text>
						)}
					</div>
					<Text size="xs" color="muted">All users who joined</Text>
				</Stack>
			</div>

			{/* Verified Signups - only show if verification is enabled */}
			{verificationEnabled && (
				<div
					className={`${styles.statCard} ${onCardClick ? styles.statCardClickable : ""}`}
					onClick={() => onCardClick?.("verified")}
					role={onCardClick ? "button" : undefined}
					tabIndex={onCardClick ? 0 : undefined}
				>
					<div className={`${styles.statIcon} ${styles.statIconSuccess}`}>
						<Icon icon={Verified} size="lg" />
					</div>
					<Stack gap="xs" className={styles.statContent}>
						<Text size="sm" weight="medium" color="muted" className={styles.statLabel}>Verified</Text>
						<div className={styles.statValue}>
							{loading ? (
								<div className={styles.skeleton} />
							) : (
								<Stack direction="row" gap="xs" align="baseline">
									<Text size="xl" weight="bold">{formatNumber(stats.verifiedSignups)}</Text>
									<Text size="md" color="muted">({formatPercentage(stats.conversionRate)})</Text>
								</Stack>
							)}
						</div>
						<Text size="xs" color="muted">Email verified users</Text>
					</Stack>
				</div>
			)}

			{/* Total Referrals - only show if referrals are enabled */}
			{referralsEnabled && (
				<div
					className={`${styles.statCard} ${onCardClick ? styles.statCardClickable : ""}`}
					onClick={() => onCardClick?.("referrals")}
					role={onCardClick ? "button" : undefined}
					tabIndex={onCardClick ? 0 : undefined}
				>
					<div className={`${styles.statIcon} ${styles.statIconPurple}`}>
						<Icon icon={Share2} size="lg" />
					</div>
					<Stack gap="xs" className={styles.statContent}>
						<Text size="sm" weight="medium" color="muted" className={styles.statLabel}>Referrals</Text>
						<div className={styles.statValue}>
							{loading ? (
								<div className={styles.skeleton} />
							) : (
								<Text size="xl" weight="bold">{formatNumber(stats.totalReferrals)}</Text>
							)}
						</div>
						<Text size="xs" color="muted">Users referred by others</Text>
					</Stack>
				</div>
			)}

			{/* Viral Coefficient (K-Factor) - only show if referrals are enabled */}
			{referralsEnabled && (
				<div
					className={`${styles.statCard} ${onCardClick ? styles.statCardClickable : ""}`}
					onClick={() => onCardClick?.("kFactor")}
					role={onCardClick ? "button" : undefined}
					tabIndex={onCardClick ? 0 : undefined}
				>
					<div className={`${styles.statIcon} ${styles.statIconOrange}`}>
						<Icon icon={LineChart} size="lg" />
					</div>
					<Stack gap="xs" className={styles.statContent}>
						<Text size="sm" weight="medium" color="muted" className={styles.statLabel}>K-Factor</Text>
						<div className={styles.statValue}>
							{loading ? (
								<div className={styles.skeleton} />
							) : (
								<Stack direction="row" gap="sm" align="center">
									<Text size="xl" weight="bold">{formatCoefficient(stats.viralCoefficient)}</Text>
									{stats.viralCoefficient >= 1 ? (
										<Badge variant="success" leftIcon={<ArrowUp size={12} />}>Viral</Badge>
									) : (
										<Badge variant="warning" leftIcon={<ArrowDown size={12} />}>Sub-viral</Badge>
									)}
								</Stack>
							)}
						</div>
						<Text size="xs" color="muted">Average referrals per user</Text>
					</Stack>
				</div>
			)}
		</div>
	);
});

CampaignStats.displayName = "CampaignStats";
