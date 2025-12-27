/**
 * AnalyticsPage Component
 * Container component for the global analytics dashboard
 */

import { motion } from "motion/react";
import { memo, useEffect, useMemo, useState } from "react";
import { useChartNavigation } from "@/hooks/useChartNavigation";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { useGetSignupsBySource } from "@/hooks/useGetSignupsBySource";
import { useGetSignupsOverTime } from "@/hooks/useGetSignupsOverTime";
import Dropdown from "@/proto-design-system/dropdown/dropdown";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import type { Campaign } from "@/types/campaign";
import { SignupsChart } from "../SignupsChart";
import { SourcesChart } from "../SourcesChart";
import styles from "./component.module.scss";

// ============================================================================
// Types
// ============================================================================

interface DropdownOption {
	value: string;
	label: string;
	selected: boolean;
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Build dropdown options from campaigns list */
function buildCampaignOptions(
	campaigns: Campaign[] | undefined,
	selectedId: string,
): DropdownOption[] {
	if (!campaigns) return [];

	return campaigns.map((campaign) => ({
		value: campaign.id,
		label: campaign.name,
		selected: campaign.id === selectedId,
	}));
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing campaign selection with auto-select */
function useCampaignSelection(campaigns: Campaign[] | undefined) {
	const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

	// Auto-select first campaign when campaigns load
	useEffect(() => {
		if (campaigns && campaigns.length > 0 && !selectedCampaignId) {
			setSelectedCampaignId(campaigns[0].id);
		}
	}, [campaigns, selectedCampaignId]);

	const campaignOptions = useMemo(
		() => buildCampaignOptions(campaigns, selectedCampaignId),
		[campaigns, selectedCampaignId],
	);

	return {
		selectedCampaignId,
		setSelectedCampaignId,
		campaignOptions,
	};
}

/** Hook for analytics chart data */
function useAnalyticsCharts(campaignId: string) {
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
// Sub-Components
// ============================================================================

interface PageHeaderProps {
	showSelector: boolean;
	campaignOptions: DropdownOption[];
	onCampaignChange?: (value: string) => void;
}

const PageHeader = memo(function PageHeader({
	showSelector,
	campaignOptions,
	onCampaignChange,
}: PageHeaderProps) {
	return (
		<div className={styles.pageHeader}>
			<div className={styles.headerTop}>
				<div>
					<h1 className={styles.pageTitle}>Analytics</h1>
					<p className={styles.pageDescription}>
						Track your marketing performance and campaign metrics
					</p>
				</div>
				{showSelector && onCampaignChange && (
					<Dropdown
						options={campaignOptions}
						onChange={(option) => onCampaignChange(option.value)}
						placeholderText="Select campaign"
						size="medium"
					/>
				)}
			</div>
		</div>
	);
});

PageHeader.displayName = "PageHeader";

// ============================================================================
// Component
// ============================================================================

/**
 * AnalyticsPage displays the global analytics dashboard
 */
export const AnalyticsPage = memo(function AnalyticsPage() {
	// Data fetching
	const { data: campaignsData, loading: campaignsLoading } = useGetCampaigns();
	const campaigns = campaignsData?.campaigns;

	// Campaign selection
	const { selectedCampaignId, setSelectedCampaignId, campaignOptions } =
		useCampaignSelection(campaigns);

	// Chart data
	const { signups, sources } = useAnalyticsCharts(selectedCampaignId);

	// Loading state
	if (campaignsLoading) {
		return (
			<LoadingSpinner
				size="large"
				mode="centered"
				message="Loading analytics..."
			/>
		);
	}

	// Empty state
	if (!campaigns || campaigns.length === 0) {
		return (
			<motion.div
				className={styles.page}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<PageHeader showSelector={false} campaignOptions={[]} />
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
			<PageHeader
				showSelector={true}
				campaignOptions={campaignOptions}
				onCampaignChange={setSelectedCampaignId}
			/>

			<div className={styles.pageContent}>
				{selectedCampaignId && (
					<>
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
					</>
				)}
			</div>
		</motion.div>
	);
});

AnalyticsPage.displayName = "AnalyticsPage";
