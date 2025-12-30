/**
 * AnalyticsDashboard Component
 * Campaign analytics overview with KPIs, charts, and insights
 */

import { type HTMLAttributes, memo, useState } from "react";
import { ArrowUp, BarChart2, Download, LineChart, PieChart, Share2, UserPlus, Verified } from "lucide-react";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Card } from "@/proto-design-system/components/layout/Card";
import { Grid } from "@/proto-design-system/components/layout/Grid";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { Analytics } from "@/types/common.types";
import { ConversionFunnel } from "../ConversionFunnel/component";
import { GrowthChart } from "../GrowthChart/component";
import { TrafficSources } from "../TrafficSources/component";
import styles from "./component.module.scss";

export interface AnalyticsDashboardProps
	extends HTMLAttributes<HTMLDivElement> {
	/** Campaign ID to fetch analytics for */
	campaignId: string;
	/** Analytics data to display */
	analytics?: Analytics;
	/** Show loading state */
	loading?: boolean;
	/** Date range for analytics */
	dateRange?: { start: Date; end: Date };
	/** Callback when date range changes */
	onDateRangeChange?: (dateRange: { start: Date; end: Date }) => void;
	/** Callback for export action */
	onExport?: () => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Format number for display
 */
const formatNumber = (value: number): string => {
	return value.toLocaleString("en-US");
};

/**
 * Format percentage
 */
const formatPercentage = (value: number): string => {
	return `${value.toFixed(1)}%`;
};

/**
 * Format coefficient (K-Factor)
 */
const formatCoefficient = (value: number): string => {
	return value.toFixed(2);
};

/**
 * AnalyticsDashboard displays comprehensive campaign analytics
 */
export const AnalyticsDashboard = memo<AnalyticsDashboardProps>(
	function AnalyticsDashboard({
		campaignId,
		analytics,
		loading = false,
		dateRange,
		onDateRangeChange,
		onExport,
		className: customClassName,
		...props
	}) {
		const [chartType, setChartType] = useState<"pie" | "bar">("pie");

		const classNames = [styles.root, loading && styles.loading, customClassName]
			.filter(Boolean)
			.join(" ");

		if (!analytics) {
			return (
				<Stack gap="lg" className={classNames} {...props}>
					<Stack gap="md" align="center" className={styles.emptyState}>
						<Icon icon={LineChart} size="2xl" color="muted" />
						<Text as="h3" size="lg" weight="semibold">No Analytics Data</Text>
						<Text color="secondary">
							Analytics data will appear here once your campaign starts
							receiving traffic.
						</Text>
					</Stack>
				</Stack>
			);
		}

		const { overview, funnel, trafficSources, timeline } = analytics;

		return (
			<Stack gap="lg" className={classNames} {...props}>
				{/* Header with actions */}
				<Stack direction="row" align="center" justify="between" className={styles.header}>
					<Stack gap="xs">
						<Text as="h2" size="xl" weight="semibold">Analytics Overview</Text>
						{dateRange && (
							<Text size="sm" color="secondary">
								{dateRange.start.toLocaleDateString()} -{" "}
								{dateRange.end.toLocaleDateString()}
							</Text>
						)}
					</Stack>
					{onExport && (
						<Button
							variant="secondary"
							size="md"
							leftIcon={<Download size={16} />}
							onClick={onExport}
						>
							Export
						</Button>
					)}
				</Stack>

				{/* KPI Cards */}
				<Grid columns="4" gap="md" className={styles.kpiGrid}>
					<Card padding="md" className={styles.kpiCard}>
						<Stack direction="row" gap="md" align="start">
							<div className={styles.kpiIcon}>
								<Icon icon={UserPlus} size="lg" />
							</div>
							<Stack gap="xs">
								<Text size="sm" color="secondary">Total Signups</Text>
								<Text size="2xl" weight="semibold">
									{loading ? (
										<div className={styles.skeleton} />
									) : (
										formatNumber(overview.totalSignups)
									)}
								</Text>
								{!loading && overview.todaySignups > 0 && (
									<Stack direction="row" gap="xs" align="center">
										<Icon icon={ArrowUp} size="sm" color="success" />
										<Text size="xs" color="secondary">{formatNumber(overview.todaySignups)} today</Text>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Card>

					<Card padding="md" className={styles.kpiCard}>
						<Stack direction="row" gap="md" align="start">
							<div className={`${styles.kpiIcon} ${styles.kpiIconSuccess}`}>
								<Icon icon={Verified} size="lg" />
							</div>
							<Stack gap="xs">
								<Text size="sm" color="secondary">Verification Rate</Text>
								<Text size="2xl" weight="semibold">
									{loading ? (
										<div className={styles.skeleton} />
									) : (
										formatPercentage(overview.verificationRate)
									)}
								</Text>
								<Text size="xs" color="secondary">Email verification rate</Text>
							</Stack>
						</Stack>
					</Card>

					<Card padding="md" className={styles.kpiCard}>
						<Stack direction="row" gap="md" align="start">
							<div className={`${styles.kpiIcon} ${styles.kpiIconPurple}`}>
								<Icon icon={LineChart} size="lg" />
							</div>
							<Stack gap="xs">
								<Text size="sm" color="secondary">K-Factor</Text>
								<Stack direction="row" gap="sm" align="center">
									<Text size="2xl" weight="semibold">
										{loading ? (
											<div className={styles.skeleton} />
										) : (
											formatCoefficient(overview.viralCoefficient)
										)}
									</Text>
									{!loading && (
										<Badge variant={overview.viralCoefficient >= 1 ? "success" : "warning"} size="sm">
											{overview.viralCoefficient >= 1 ? "Viral" : "Sub-viral"}
										</Badge>
									)}
								</Stack>
								<Text size="xs" color="secondary">Viral coefficient</Text>
							</Stack>
						</Stack>
					</Card>

					<Card padding="md" className={styles.kpiCard}>
						<Stack direction="row" gap="md" align="start">
							<div className={`${styles.kpiIcon} ${styles.kpiIconOrange}`}>
								<Icon icon={Share2} size="lg" />
							</div>
							<Stack gap="xs">
								<Text size="sm" color="secondary">Avg Referrals</Text>
								<Text size="2xl" weight="semibold">
									{loading ? (
										<div className={styles.skeleton} />
									) : (
										formatCoefficient(overview.avgReferralsPerUser)
									)}
								</Text>
								<Text size="xs" color="secondary">Per user average</Text>
							</Stack>
						</Stack>
					</Card>
				</Grid>

				{/* Growth Chart */}
				{timeline && timeline.length > 0 && (
					<Card padding="lg">
						<Stack gap="md">
							<Text as="h3" size="lg" weight="semibold">Growth Over Time</Text>
							<GrowthChart data={timeline} height={350} />
						</Stack>
					</Card>
				)}

				{/* Two-column layout for Funnel and Traffic Sources */}
				<Grid columns="2" gap="lg" className={styles.twoColumnGrid}>
					{/* Conversion Funnel */}
					<Card padding="lg">
						<ConversionFunnel data={funnel} />
					</Card>

					{/* Traffic Sources */}
					{trafficSources && trafficSources.length > 0 && (
						<Card padding="lg">
							<Stack gap="md">
								<Stack direction="row" justify="end">
									<Stack direction="row" gap="xs" className={styles.chartTypeToggle}>
										<button
											className={`${styles.toggleButton} ${chartType === "pie" ? styles.toggleButtonActive : ""}`}
											onClick={() => setChartType("pie")}
											aria-label="Pie chart"
										>
											<Icon icon={PieChart} size="sm" />
										</button>
										<button
											className={`${styles.toggleButton} ${chartType === "bar" ? styles.toggleButtonActive : ""}`}
											onClick={() => setChartType("bar")}
											aria-label="Bar chart"
										>
											<Icon icon={BarChart2} size="sm" />
										</button>
									</Stack>
								</Stack>
								<TrafficSources data={trafficSources} chartType={chartType} />
							</Stack>
						</Card>
					)}
				</Grid>
			</Stack>
		);
	},
);

AnalyticsDashboard.displayName = "AnalyticsDashboard";
