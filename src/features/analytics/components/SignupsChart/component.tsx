/**
 * SignupsChart Component
 * Area chart showing signups over time with period selector
 */

import { type HTMLAttributes, memo, useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { DateRange } from "@/hooks/useChartNavigation";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import ButtonGroup from "@/proto-design-system/buttongroup/buttongroup";
import type { AnalyticsPeriod, ApiSignupDataPoint } from "@/types/api.types";
import styles from "./component.module.scss";

export interface SignupsChartProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "data"> {
	/** Time-series data to display */
	data: ApiSignupDataPoint[];
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
	/** Whether forward navigation is disabled (at current date) */
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
 * Format date for display based on period
 * Uses UTC to avoid timezone issues with API dates
 */
const formatDateForPeriod = (
	dateStr: string,
	period: AnalyticsPeriod,
): { line1: string; line2?: string } => {
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
				return {
					line1: date.toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						timeZone: "UTC",
					}),
				};
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
};

/**
 * Custom X-axis tick for multi-line labels
 */
interface CustomXAxisTickProps {
	x?: number;
	y?: number;
	payload?: { value: string };
	period: AnalyticsPeriod;
}

const CustomXAxisTick = ({ x, y, payload, period }: CustomXAxisTickProps) => {
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
};

/**
 * Format number for display
 */
const formatNumber = (value: number): string => {
	return value.toLocaleString("en-US");
};

/**
 * Custom tooltip component
 */
interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{ value: number }>;
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

	const formatted = formatDateForPeriod(label || "", period);
	const dateLabel = formatted.line2
		? `${formatted.line1}, ${formatted.line2}`
		: formatted.line1;

	return (
		<div className={styles.tooltip}>
			<p className={styles.tooltipLabel}>{dateLabel}</p>
			<div className={styles.tooltipContent}>
				<div className={styles.tooltipItem}>
					<span className={styles.tooltipDot} />
					<span className={styles.tooltipName}>Signups:</span>
					<span className={styles.tooltipValue}>
						{formatNumber(payload[0].value)}
					</span>
				</div>
			</div>
		</div>
	);
};

/**
 * SignupsChart displays time-series signup data with period selector
 */
export const SignupsChart = memo<SignupsChartProps>(function SignupsChart({
	data,
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

	return (
		<div className={classNames} {...props}>
			<div className={styles.header}>
				<div className={styles.headerLeft}>
					<h3 className={styles.title}>Signups Over Time</h3>
					<span className={styles.total}>
						{formatNumber(total)} total signups
					</span>
				</div>
				<div className={styles.headerRight}>
					<ButtonGroup
						items={periodButtonItems}
						size="2x-small"
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
				) : data.length === 0 ? (
					<div className={styles.empty}>
						<i className="ri-bar-chart-line" aria-hidden="true" />
						<p>No signup data available</p>
					</div>
				) : (
					<ResponsiveContainer width="100%" height={height}>
						<AreaChart
							data={data}
							margin={{
								top: 10,
								right: 10,
								left: 0,
								bottom: selectedPeriod === "hour" ? 20 : 0,
							}}
						>
							<defs>
								<linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="5%"
										stopColor="var(--color-info-default)"
										stopOpacity={0.3}
									/>
									<stop
										offset="95%"
										stopColor="var(--color-info-default)"
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
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
									stroke: "var(--color-border-primary-default)",
									strokeDasharray: "3 3",
								}}
							/>
							<Area
								type="monotone"
								dataKey="count"
								stroke="var(--color-info-default)"
								strokeWidth={2}
								fill="url(#signupGradient)"
								dot={false}
								activeDot={{
									r: 4,
									fill: "var(--color-info-default)",
									stroke: "var(--color-surface-primary-default)",
									strokeWidth: 2,
								}}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
});

SignupsChart.displayName = "SignupsChart";
