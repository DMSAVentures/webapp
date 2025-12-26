import { createFileRoute } from "@tanstack/react-router";
import { SignupsChart } from "@/features/analytics/components/SignupsChart";
import { SourcesChart } from "@/features/analytics/components/SourcesChart";
import { CampaignStats } from "@/features/campaigns/components/CampaignStats/component";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { useChartNavigation } from "@/hooks/useChartNavigation";
import { useGetSignupsBySource } from "@/hooks/useGetSignupsBySource";
import { useGetSignupsOverTime } from "@/hooks/useGetSignupsOverTime";
import type { CampaignStats as CampaignStatsType } from "@/types/common.types";
import styles from "./analytics.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/analytics")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaign } = useCampaignContext();

	// Signups chart navigation
	const signupsNav = useChartNavigation("day");
	const { data: signupsData, loading: signupsLoading } = useGetSignupsOverTime(
		campaign?.id ?? "",
		signupsNav.params,
	);

	// Sources chart navigation
	const sourcesNav = useChartNavigation("day");
	const { data: sourcesData, loading: sourcesLoading } = useGetSignupsBySource(
		campaign?.id ?? "",
		sourcesNav.params,
	);

	if (!campaign) {
		return null;
	}

	// Build stats object for CampaignStats component
	const stats: CampaignStatsType = {
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
					data={signupsData?.data ?? []}
					total={signupsData?.total ?? 0}
					period={signupsData?.period ?? signupsNav.period}
					dateRange={signupsNav.dateRange}
					onPeriodChange={signupsNav.handlePeriodChange}
					onNavigate={signupsNav.handleNavigate}
					canGoForward={signupsNav.canGoForward}
					loading={signupsLoading}
				/>

				<SourcesChart
					data={sourcesData?.data ?? []}
					sources={sourcesData?.sources ?? []}
					total={sourcesData?.total ?? 0}
					period={sourcesData?.period ?? sourcesNav.period}
					dateRange={sourcesNav.dateRange}
					onPeriodChange={sourcesNav.handlePeriodChange}
					onNavigate={sourcesNav.handleNavigate}
					canGoForward={sourcesNav.canGoForward}
					loading={sourcesLoading}
				/>
			</div>
		</div>
	);
}
