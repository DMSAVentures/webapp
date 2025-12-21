import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { SignupsChart } from "@/features/analytics/components/SignupsChart";
import { SourcesChart } from "@/features/analytics/components/SourcesChart";
import { useChartNavigation } from "@/hooks/useChartNavigation";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { useGetSignupsBySource } from "@/hooks/useGetSignupsBySource";
import { useGetSignupsOverTime } from "@/hooks/useGetSignupsOverTime";
import Dropdown from "@/proto-design-system/dropdown/dropdown";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import styles from "./page.module.scss";

export const Route = createFileRoute("/analytics")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: campaigns, loading: campaignsLoading } = useGetCampaigns();
	const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

	// Signups chart navigation
	const signupsNav = useChartNavigation("day");
	const { data: signupsData, loading: signupsLoading } = useGetSignupsOverTime(
		selectedCampaignId,
		signupsNav.params,
	);

	// Sources chart navigation
	const sourcesNav = useChartNavigation("day");
	const { data: sourcesData, loading: sourcesLoading } = useGetSignupsBySource(
		selectedCampaignId,
		sourcesNav.params,
	);

	// Build dropdown options from campaigns
	const campaignOptions = useMemo(() => {
		if (!campaigns?.campaigns) return [];
		return campaigns.campaigns.map((campaign) => ({
			value: campaign.id,
			label: campaign.name,
			selected: campaign.id === selectedCampaignId,
		}));
	}, [campaigns, selectedCampaignId]);

	// Auto-select first campaign when campaigns load
	useMemo(() => {
		if (
			campaigns?.campaigns &&
			campaigns.campaigns.length > 0 &&
			!selectedCampaignId
		) {
			setSelectedCampaignId(campaigns.campaigns[0].id);
		}
	}, [campaigns, selectedCampaignId]);

	if (campaignsLoading) {
		return (
			<LoadingSpinner
				size="large"
				mode="centered"
				message="Loading analytics..."
			/>
		);
	}

	if (!campaigns?.campaigns || campaigns.campaigns.length === 0) {
		return (
			<motion.div
				className={styles.page}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<div className={styles.pageHeader}>
					<h1 className={styles.pageTitle}>Analytics</h1>
					<p className={styles.pageDescription}>
						Track your marketing performance and campaign metrics
					</p>
				</div>
				<div className={styles.pageContent}>
					<EmptyState
						title="No campaigns yet"
						description="Create a campaign to start tracking analytics"
						icon="bar-chart-2-line"
					/>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div className={styles.headerTop}>
					<div>
						<h1 className={styles.pageTitle}>Analytics</h1>
						<p className={styles.pageDescription}>
							Track your marketing performance and campaign metrics
						</p>
					</div>
					<Dropdown
						options={campaignOptions}
						onChange={(option) => setSelectedCampaignId(option.value)}
						placeholderText="Select campaign"
						size="medium"
					/>
				</div>
			</div>

			<div className={styles.pageContent}>
				{selectedCampaignId && (
					<>
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
					</>
				)}
			</div>
		</motion.div>
	);
}
