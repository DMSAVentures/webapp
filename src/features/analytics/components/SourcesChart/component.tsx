/**
 * SourcesChart Component
 * Multi-line area chart showing signups by UTM source over time
 */

import { type HTMLAttributes, memo, useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import ButtonGroup from "@/proto-design-system/buttongroup/buttongroup";
import type {
	AnalyticsPeriod,
	ApiSignupsBySourceDataPoint,
} from "@/types/api.types";
import styles from "./component.module.scss";

export interface DateRange {
	from: Date;
	to: Date;
}

export interface SourcesChartProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "data"> {
	/** Time-series data with source breakdown */
	data: ApiSignupsBySourceDataPoint[];
	/** Unique sources in the data */
	sources: string[];
	/** Total count of signups */
	total: number;
	/** Current period */
	period: AnalyticsPeriod;
	/** Current date range */
	dateRange?: DateRange;
	/** Callback when period changes */
	onPeriodChange?: (period: AnalyticsPeriod) => void;
	/** Callback when navigating back/forward */
	onNavigate?: (direction: "back" | "forward") => void;
	/** Whether forward navigation is disabled */
	canGoForward?: boolean;
	/** Height of the chart in pixels */
	height?: number;
	/** Whether data is loading */
	loading?: boolean;
	/** Additional CSS class name */
	className?: string;
}

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
	{ value: "hour", label: "Hourly" },
	{ value: "day", label: "Daily" },
	{ value: "week", label: "Weekly" },
	{ value: "month", label: "Monthly" },
];

// Colors for different sources
const SOURCE_COLORS: Record<string, string> = {
	google: "#4285F4",
	facebook: "#1877F2",
	twitter: "#1DA1F2",
	linkedin: "#0A66C2",
	instagram: "#E4405F",
	youtube: "#FF0000",
	tiktok: "#000000",
	reddit: "#FF4500",
	pinterest: "#E60023",
	whatsapp: "#25D366",
	telegram: "#0088CC",
	discord: "#5865F2",
	slack: "#4A154B",
	email: "#6B7280",
	direct: "#9CA3AF",
	"": "#9CA3AF", // null/direct traffic
};

const DEFAULT_COLORS = [
	"#3B82F6", // blue
	"#10B981", // green
	"#F59E0B", // amber
	"#EF4444", // red
	"#8B5CF6", // purple
	"#EC4899", // pink
	"#06B6D4", // cyan
	"#F97316", // orange
];

/**
 * Get color for a source
 */
const getSourceColor = (source: string, index: number): string => {
	const normalizedSource = source.toLowerCase();
	if (SOURCE_COLORS[normalizedSource]) {
		return SOURCE_COLORS[normalizedSource];
	}
	return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
};

/**
 * Get display name for a source
 */
const getSourceDisplayName = (source: string): string => {
	if (!source || source === "") return "Direct";
	return source.charAt(0).toUpperCase() + source.slice(1);
};

/**
 * Format date range for display
 */
const formatDateRange = (
	dateRange: DateRange | undefined,
	period: AnalyticsPeriod,
): string => {
	if (!dateRange) return "";

	const { from, to } = dateRange;

	switch (period) {
		case "hour":
			return from.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
		case "day":
		case "week": {
			const fromStr = from.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
			const toStr = to.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
			return `${fromStr} - ${toStr}`;
		}
		case "month": {
			const fromMonth = from.toLocaleDateString("en-US", {
				month: "short",
				year: "numeric",
			});
			const toMonth = to.toLocaleDateString("en-US", {
				month: "short",
				year: "numeric",
			});
			return `${fromMonth} - ${toMonth}`;
		}
		default:
			return "";
	}
};

/**
 * Format date for X-axis (UTC)
 */
const formatDateForPeriod = (
	dateStr: string,
	period: AnalyticsPeriod,
): string => {
	try {
		const date = new Date(dateStr);
		switch (period) {
			case "hour":
				return date.toLocaleTimeString("en-US", {
					hour: "numeric",
					hour12: true,
					timeZone: "UTC",
				});
			case "day":
			case "week":
				return date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					timeZone: "UTC",
				});
			case "month":
				return date.toLocaleDateString("en-US", {
					month: "short",
					year: "numeric",
					timeZone: "UTC",
				});
			default:
				return date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					timeZone: "UTC",
				});
		}
	} catch {
		return dateStr;
	}
};

/**
 * Format number for display
 */
const formatNumber = (value: number): string => {
	return value.toLocaleString("en-US");
};

/**
 * Transform API data for Recharts
 * Groups data by date with each source as a separate key
 */
const transformDataForChart = (
	data: ApiSignupsBySourceDataPoint[],
	sources: string[],
): Record<string, string | number>[] => {
	const dateMap = new Map<string, Record<string, string | number>>();

	// Initialize all dates with all sources set to 0
	for (const point of data) {
		if (!dateMap.has(point.date)) {
			const entry: Record<string, string | number> = { date: point.date };
			for (const source of sources) {
				entry[source || "direct"] = 0;
			}
			dateMap.set(point.date, entry);
		}

		const entry = dateMap.get(point.date)!;
		const sourceKey = point.utm_source || "direct";
		entry[sourceKey] = point.count;
	}

	return Array.from(dateMap.values()).sort(
		(a, b) =>
			new Date(a.date as string).getTime() -
			new Date(b.date as string).getTime(),
	);
};

/**
 * Custom tooltip component
 */
interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		dataKey: string;
		value: number;
		color: string;
		name: string;
	}>;
	label?: string;
	period: AnalyticsPeriod;
}

const CustomTooltip = ({
	active,
	payload,
	label,
	period,
}: CustomTooltipProps) => {
	if (!active || !payload || !payload.length) {
		return null;
	}

	const dateLabel = formatDateForPeriod(label || "", period);
	const total = payload.reduce((sum, entry) => sum + entry.value, 0);

	return (
		<div className={styles.tooltip}>
			<p className={styles.tooltipLabel}>{dateLabel}</p>
			<div className={styles.tooltipContent}>
				{payload.map((entry) => (
					<div key={entry.dataKey} className={styles.tooltipItem}>
						<span
							className={styles.tooltipDot}
							style={{ backgroundColor: entry.color }}
						/>
						<span className={styles.tooltipName}>{entry.name}:</span>
						<span className={styles.tooltipValue}>
							{formatNumber(entry.value)}
						</span>
					</div>
				))}
				{payload.length > 1 && (
					<div className={styles.tooltipTotal}>
						<span className={styles.tooltipName}>Total:</span>
						<span className={styles.tooltipValue}>{formatNumber(total)}</span>
					</div>
				)}
			</div>
		</div>
	);
};

/**
 * SourcesChart displays signups by UTM source over time
 */
export const SourcesChart = memo<SourcesChartProps>(function SourcesChart({
	data,
	sources,
	total,
	period,
	dateRange,
	onPeriodChange,
	onNavigate,
	canGoForward = false,
	height = 300,
	loading = false,
	className: customClassName,
	...props
}) {
	const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>(period);
	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	const handlePeriodChange = (newPeriod: AnalyticsPeriod) => {
		setSelectedPeriod(newPeriod);
		onPeriodChange?.(newPeriod);
	};

	const dateRangeLabel = formatDateRange(dateRange, selectedPeriod);

	const periodButtonItems = useMemo(
		() =>
			PERIOD_OPTIONS.map((option) => ({
				text: option.label,
				icon: "",
				iconPosition: "left" as const,
				iconOnly: false,
				onClick: () => handlePeriodChange(option.value),
				selected: selectedPeriod === option.value,
			})),
		[selectedPeriod],
	);

	// Transform data for Recharts
	const chartData = useMemo(
		() => transformDataForChart(data, sources),
		[data, sources],
	);

	// Normalize sources (replace empty string with "direct")
	const normalizedSources = useMemo(
		() => sources.map((s) => (s === "" ? "direct" : s)),
		[sources],
	);

	return (
		<div className={classNames} {...props}>
			<div className={styles.header}>
				<div className={styles.headerLeft}>
					<h3 className={styles.title}>Signups by Source</h3>
					<span className={styles.total}>
						{formatNumber(total)} total signups
					</span>
				</div>
				<div className={styles.headerRight}>
					<ButtonGroup
						items={periodButtonItems}
						size="small"
						ariaLabel="Select time period"
					/>
					{onNavigate && (
						<div className={styles.navigation}>
							<IconOnlyButton
								iconClass="arrow-left-s-line"
								variant="secondary"
								onClick={() => onNavigate("back")}
								ariaLabel="Previous period"
							/>
							{dateRangeLabel && (
								<span className={styles.dateRangeLabel}>{dateRangeLabel}</span>
							)}
							<IconOnlyButton
								iconClass="arrow-right-s-line"
								variant="secondary"
								onClick={() => onNavigate("forward")}
								disabled={!canGoForward}
								ariaLabel="Next period"
							/>
						</div>
					)}
				</div>
			</div>

			<div className={styles.chartContainer}>
				{loading ? (
					<div className={styles.loading}>
						<div className={styles.loadingSpinner} />
					</div>
				) : chartData.length === 0 ? (
					<div className={styles.empty}>
						<i className="ri-pie-chart-line" aria-hidden="true" />
						<p>No source data available</p>
					</div>
				) : (
					<ResponsiveContainer width="100%" height={height}>
						<AreaChart
							data={chartData}
							margin={{
								top: 10,
								right: 10,
								left: 0,
								bottom: 0,
							}}
						>
							<defs>
								{normalizedSources.map((source, index) => (
									<linearGradient
										key={source}
										id={`gradient-${source}`}
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop
											offset="5%"
											stopColor={getSourceColor(source, index)}
											stopOpacity={0.3}
										/>
										<stop
											offset="95%"
											stopColor={getSourceColor(source, index)}
											stopOpacity={0}
										/>
									</linearGradient>
								))}
							</defs>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="var(--color-border-secondary-default)"
								vertical={false}
							/>
							<XAxis
								dataKey="date"
								tickFormatter={(value) =>
									formatDateForPeriod(value, selectedPeriod)
								}
								stroke="var(--color-text-tertiary-default)"
								tick={{
									fill: "var(--color-text-tertiary-default)",
									fontSize: 12,
								}}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								stroke="var(--color-text-tertiary-default)"
								tick={{
									fill: "var(--color-text-tertiary-default)",
									fontSize: 12,
								}}
								tickFormatter={formatNumber}
								tickLine={false}
								axisLine={false}
								width={40}
							/>
							<Tooltip
								content={<CustomTooltip period={selectedPeriod} />}
								cursor={{
									stroke: "var(--color-border-primary-default)",
									strokeDasharray: "3 3",
								}}
							/>
							<Legend
								wrapperStyle={{
									paddingTop: "12px",
								}}
								formatter={(value) => (
									<span
										style={{ color: "var(--color-text-secondary-default)" }}
									>
										{getSourceDisplayName(value)}
									</span>
								)}
							/>
							{normalizedSources.map((source, index) => (
								<Area
									key={source}
									type="monotone"
									dataKey={source}
									name={getSourceDisplayName(source)}
									stroke={getSourceColor(source, index)}
									strokeWidth={2}
									fill={`url(#gradient-${source})`}
									dot={false}
									activeDot={{
										r: 4,
										fill: getSourceColor(source, index),
										stroke: "var(--color-surface-primary-default)",
										strokeWidth: 2,
									}}
								/>
							))}
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
});

SourcesChart.displayName = "SourcesChart";
