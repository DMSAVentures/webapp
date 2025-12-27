/**
 * CampaignAnalyticsPage Component
 * Container component for campaign-specific analytics
 */

import { memo, useMemo } from "react";
import { CampaignStats } from "@/features/campaigns/components/CampaignStats/component";
import { useChartNavigation } from "@/hooks/useChartNavigation";
import { useGetSignupsBySource } from "@/hooks/useGetSignupsBySource";
import { useGetSignupsOverTime } from "@/hooks/useGetSignupsOverTime";
import type { Campaign } from "@/types/campaign";
import type { CampaignStats as CampaignStatsType } from "@/types/common.types";
import { SignupsChart } from "../SignupsChart";
import { SourcesChart } from "../SourcesChart";
import styles from "./component.module.scss";

export interface CampaignAnalyticsPageProps {
	/** Campaign data */
	campaign: Campaign;
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Build stats object from campaign data */
function buildCampaignStats(campaign: Campaign): CampaignStatsType {
	return {
		totalSignups: campaign.totalSignups,
		verifiedSignups: campaign.totalVerified,
		totalReferrals: campaign.totalReferrals,
		conversionRate:
			campaign.totalSignups > 0
				? (campaign.totalVerified / campaign.totalSignups) * 100
				: 0,
		viralCoefficient:
			campaign.totalSignups > 0
				? campaign.totalReferrals / campaign.totalSignups
				: 0,
	};
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for campaign analytics chart data */
function useCampaignCharts(campaignId: string) {
	// Signups chart navigation
	const signupsNav = useChartNavigation("day");
	const { data: signupsData, loading: signupsLoading } = useGetSignupsOverTime(
		campaignId,
		signupsNav.params,
	);

	// Sources chart navigation
	const sourcesNav = useChartNavigation("day");
	const { data: sourcesData, loading: sourcesLoading } = useGetSignupsBySource(
		campaignId,
		sourcesNav.params,
	);

	return {
		signups: {
			data: signupsData,
			loading: signupsLoading,
			nav: signupsNav,
		},
		sources: {
			data: sourcesData,
			loading: sourcesLoading,
			nav: sourcesNav,
		},
	};
}

// ============================================================================
// Component
// ============================================================================

/**
 * CampaignAnalyticsPage displays analytics for a specific campaign
 */
export const CampaignAnalyticsPage = memo(function CampaignAnalyticsPage({
	campaign,
}: CampaignAnalyticsPageProps) {
	// Hooks
	const { signups, sources } = useCampaignCharts(campaign.id);

	// Derived state
	const stats = useMemo(() => buildCampaignStats(campaign), [campaign]);

	return (
		<div className={styles.analytics}>
			<div className={styles.header}>
				<h2 className={styles.title}>Analytics</h2>
				<p className={styles.description}>
					Track signups, sources, and campaign performance over time
				</p>
			</div>

			<CampaignStats
				stats={stats}
				verificationEnabled={
					campaign.emailSettings?.verificationRequired ?? false
				}
				referralsEnabled={campaign.referralSettings?.enabled ?? false}
			/>

			<div className={styles.charts}>
				<SignupsChart
					data={signups.data?.data ?? []}
					total={signups.data?.total ?? 0}
					period={signups.data?.period ?? signups.nav.period}
					dateRange={signups.nav.dateRange}
					onPeriodChange={signups.nav.handlePeriodChange}
					onNavigate={signups.nav.handleNavigate}
					canGoForward={signups.nav.canGoForward}
					loading={signups.loading}
				/>

				<SourcesChart
					data={sources.data?.data ?? []}
					sources={sources.data?.sources ?? []}
					total={sources.data?.total ?? 0}
					period={sources.data?.period ?? sources.nav.period}
					dateRange={sources.nav.dateRange}
					onPeriodChange={sources.nav.handlePeriodChange}
					onNavigate={sources.nav.handleNavigate}
					canGoForward={sources.nav.canGoForward}
					loading={sources.loading}
				/>
			</div>
		</div>
	);
});

CampaignAnalyticsPage.displayName = "CampaignAnalyticsPage";
