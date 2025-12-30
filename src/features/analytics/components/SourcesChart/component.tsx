/**
 * SourcesChart Component
 * Stacked bar chart showing signups by UTM source over time
 */

import {
	type HTMLAttributes,
	memo,
	useCallback,
	useMemo,
	useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import type { DateRange } from "@/hooks/useChartNavigation";
import { Button, ButtonGroup } from "@/proto-design-system/components/primitives/Button";
import { Card } from "@/proto-design-system/components/layout/Card";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type {
	AnalyticsPeriod,
	ApiSignupsBySourceDataPoint,
} from "@/types/api.types";
import styles from "./component.module.scss";

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

// ============================================================================
// Constants
// ============================================================================

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
	{ value: "hour", label: "Hourly" },
	{ value: "day", label: "Daily" },
	{ value: "week", label: "Weekly" },
	{ value: "month", label: "Monthly" },
];

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
	"": "#9CA3AF",
};

const DEFAULT_COLORS = [
	"#3B82F6",
	"#10B981",
	"#F59E0B",
	"#EF4444",
	"#8B5CF6",
	"#EC4899",
	"#06B6D4",
	"#F97316",
	"#14B8A6",
	"#6366F1",
];

const MAX_SOURCES = 10;
const OTHER_COLOR = "#9CA3AF";

// ============================================================================
// Pure Functions
// ============================================================================

/** Format number for display */
function formatNumber(value: number): string {
	return value.toLocaleString("en-US");
}

/** Get color for a source */
function getSourceColor(source: string, index: number): string {
	if (source === "other") return OTHER_COLOR;
	const normalizedSource = source.toLowerCase();
	if (SOURCE_COLORS[normalizedSource]) {
		return SOURCE_COLORS[normalizedSource];
	}
	return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

/** Get display name for a source */
function getSourceDisplayName(source: string): string {
	if (!source || source === "") return "Direct";
	if (source === "other") return "Other";
	return source.charAt(0).toUpperCase() + source.slice(1);
}

/** Format date range for display */
function formatDateRange(
	dateRange: DateRange | undefined,
	period: AnalyticsPeriod,
): string {
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
}

/** Format date for display based on period (UTC to avoid timezone issues) */
function formatDateForPeriod(
	dateStr: string,
	period: AnalyticsPeriod,
): { line1: string; line2?: string } {
	try {
		const date = new Date(dateStr);
		switch (period) {
			case "hour": {
				const time = date.toLocaleTimeString("en-US", {
					hour: "numeric",
					hour12: true,
					timeZone: "UTC",
				});
				const day = date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					timeZone: "UTC",
				});
				return { line1: time, line2: day };
			}
			case "day":
			case "week":
				return {
					line1: date.toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						timeZone: "UTC",
					}),
				};
			case "month":
				return {
					line1: date.toLocaleDateString("en-US", {
						month: "short",
						year: "numeric",
						timeZone: "UTC",
					}),
				};
			default:
				return {
					line1: date.toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						timeZone: "UTC",
					}),
				};
		}
	} catch {
		return { line1: dateStr };
	}
}


/** Get top sources by total count, grouping rest into "Other" */
function getTopSources(data: ApiSignupsBySourceDataPoint[]): {
	topSources: string[];
	hasOther: boolean;
} {
	const sourceTotals = new Map<string, number>();
	for (const point of data) {
		const sourceKey = point.utm_source || "direct";
		sourceTotals.set(
			sourceKey,
			(sourceTotals.get(sourceKey) || 0) + point.count,
		);
	}

	const sorted = Array.from(sourceTotals.entries()).sort((a, b) => b[1] - a[1]);
	const topSources = sorted.slice(0, MAX_SOURCES).map(([source]) => source);
	const hasOther = sorted.length > MAX_SOURCES;

	return { topSources, hasOther };
}

/** Transform API data for Recharts - groups by date with top sources + "Other" */
function transformDataForChart(
	data: ApiSignupsBySourceDataPoint[],
	topSources: string[],
	hasOther: boolean,
): Record<string, string | number>[] {
	const dateMap = new Map<string, Record<string, string | number>>();
	const topSourceSet = new Set(topSources);

	for (const point of data) {
		if (!dateMap.has(point.date)) {
			const entry: Record<string, string | number> = { date: point.date };
			for (const source of topSources) {
				entry[source] = 0;
			}
			if (hasOther) {
				entry.other = 0;
			}
			dateMap.set(point.date, entry);
		}

		const entry = dateMap.get(point.date)!;
		const sourceKey = point.utm_source || "direct";

		if (topSourceSet.has(sourceKey)) {
			entry[sourceKey] = point.count;
		} else if (hasOther) {
			entry.other = (entry.other as number) + point.count;
		}
	}

	return Array.from(dateMap.values()).sort(
		(a, b) =>
			new Date(a.date as string).getTime() -
			new Date(b.date as string).getTime(),
	);
}

// ============================================================================
// Sub-Components
// ============================================================================

/** Custom X-axis tick for multi-line labels */
interface CustomXAxisTickProps {
	x?: number;
	y?: number;
	payload?: { value: string };
	period: AnalyticsPeriod;
}

function CustomXAxisTick({ x, y, payload, period }: CustomXAxisTickProps) {
	if (!payload) return null;

	const formatted = formatDateForPeriod(payload.value, period);

	return (
		<g transform={`translate(${x},${y})`}>
			<text
				x={0}
				y={0}
				dy={12}
				textAnchor="middle"
				fill="var(--color-text-tertiary-default)"
				fontSize={12}
			>
				{formatted.line1}
			</text>
			{formatted.line2 && (
				<text
					x={0}
					y={0}
					dy={26}
					textAnchor="middle"
					fill="var(--color-text-tertiary-default)"
					fontSize={11}
				>
					{formatted.line2}
				</text>
			)}
		</g>
	);
}

/** Custom tooltip component */
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

function CustomTooltip({ active, payload, label, period }: CustomTooltipProps) {
	if (!active || !payload || !payload.length) {
		return null;
	}

	const formatted = formatDateForPeriod(label || "", period);
	const dateLabel = formatted.line2
		? `${formatted.line1}, ${formatted.line2}`
		: formatted.line1;
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
}

// ============================================================================
// Component
// ============================================================================

/**
 * SourcesChart displays signups by UTM source over time
 */
export const SourcesChart = memo<SourcesChartProps>(function SourcesChart({
	data,
	sources: _sources,
	total,
	period,
	dateRange,
	onPeriodChange,
	onNavigate,
	canGoForward = false,
	height = 300,
	loading = false,
	className: customClassName,
}) {
	// State
	const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>(period);

	// Handlers
	const handlePeriodChange = useCallback(
		(newPeriod: AnalyticsPeriod) => {
			setSelectedPeriod(newPeriod);
			onPeriodChange?.(newPeriod);
		},
		[onPeriodChange],
	);

	// Derived state
	const dateRangeLabel = formatDateRange(dateRange, selectedPeriod);

	const { topSources, hasOther } = useMemo(() => getTopSources(data), [data]);

	const chartData = useMemo(
		() => transformDataForChart(data, topSources, hasOther),
		[data, topSources, hasOther],
	);

	const displaySources = useMemo(
		() => (hasOther ? [...topSources, "other"] : topSources),
		[topSources, hasOther],
	);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Render
	return (
		<Card padding="lg" className={classNames}>
			<Stack gap="lg">
				<Stack direction="row" align="start" justify="between" wrap className={styles.header}>
					<Stack gap="xs">
						<Text as="h3" size="lg" weight="semibold">Signups by Source</Text>
						<Text size="sm" color="secondary">
							{formatNumber(total)} total signups
						</Text>
					</Stack>
					<Stack direction="row" gap="md" align="center" wrap>
						<ButtonGroup isAttached>
							{PERIOD_OPTIONS.map((option) => (
								<Button
									key={option.value}
									variant={selectedPeriod === option.value ? "outline" : "ghost"}
									size="sm"
									onClick={() => handlePeriodChange(option.value)}
								>
									{option.label}
								</Button>
							))}
						</ButtonGroup>
						{onNavigate && (
							<Stack direction="row" gap="sm" align="center">
								<Button
									leftIcon={<ChevronLeft size={16} />}
									variant="secondary"
									onClick={() => onNavigate("back")}
									aria-label="Previous period"
								/>
								{dateRangeLabel && (
									<Text size="sm" color="secondary">{dateRangeLabel}</Text>
								)}
								<Button
									leftIcon={<ChevronRight size={16} />}
									variant="secondary"
									onClick={() => onNavigate("forward")}
									disabled={!canGoForward}
									aria-label="Next period"
								/>
							</Stack>
						)}
					</Stack>
				</Stack>

				<div className={styles.chartContainer}>
					{loading ? (
						<Stack align="center" justify="center" style={{ height }}>
							<Spinner size="lg" />
						</Stack>
					) : chartData.length === 0 ? (
						<Stack align="center" justify="center" gap="sm" style={{ height }}>
							<Icon icon={PieChartIcon} size="2xl" color="muted" />
							<Text color="secondary">No source data available</Text>
						</Stack>
					) : (
						<ResponsiveContainer width="100%" height={height}>
							<BarChart
								data={chartData}
								margin={{
									top: 10,
									right: 10,
									left: 0,
									bottom: 0,
								}}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="var(--color-border-secondary-default)"
									vertical={false}
								/>
								<XAxis
									dataKey="date"
									stroke="var(--color-text-tertiary-default)"
									tick={<CustomXAxisTick period={selectedPeriod} />}
									tickLine={false}
									axisLine={false}
									height={selectedPeriod === "hour" ? 45 : 30}
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
										fill: "var(--color-bg-secondary-default)",
										opacity: 0.5,
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
								{displaySources.map((source, index) => (
									<Bar
										key={source}
										dataKey={source}
										name={getSourceDisplayName(source)}
										stackId="sources"
										fill={getSourceColor(source, index)}
										radius={
											index === displaySources.length - 1
												? [4, 4, 0, 0]
												: [0, 0, 0, 0]
										}
									/>
								))}
							</BarChart>
						</ResponsiveContainer>
					)}
				</div>
			</Stack>
		</Card>
	);
});

SourcesChart.displayName = "SourcesChart";
