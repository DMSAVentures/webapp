/**
 * SignupsChart Component
 * Area chart showing signups over time with period selector
 */

import { BarChart2, ChevronLeft, ChevronRight } from "lucide-react";
import { type HTMLAttributes, memo, useCallback, useState } from "react";
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
import { Card } from "@/proto-design-system/components/layout/Card";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import {
	Button,
	ButtonGroup,
} from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Text } from "@/proto-design-system/components/primitives/Text";
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

// ============================================================================
// Constants
// ============================================================================

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
	{ value: "hour", label: "Hourly" },
	{ value: "day", label: "Daily" },
	{ value: "week", label: "Weekly" },
	{ value: "month", label: "Monthly" },
];

// ============================================================================
// Pure Functions
// ============================================================================

/** Format number for display */
function formatNumber(value: number): string {
	return value.toLocaleString("en-US");
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

/**
 * Format date for display based on period
 * Uses UTC to avoid timezone issues with API dates
 */
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
				fill="var(--color-base-content-tertiary)"
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
					fill="var(--color-base-content-tertiary)"
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
	payload?: Array<{ value: number }>;
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
}

// ============================================================================
// Component
// ============================================================================

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

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Render
	return (
		<Card padding="lg" className={classNames}>
			<Stack gap="lg">
				<Stack
					direction="row"
					align="start"
					justify="between"
					wrap
					className={styles.header}
				>
					<Stack gap="xs">
						<Text as="h3" size="lg" weight="semibold">
							Signups Over Time
						</Text>
						<Text size="sm" color="secondary">
							{formatNumber(total)} total signups
						</Text>
					</Stack>
					<Stack direction="row" gap="md" align="center" wrap>
						<ButtonGroup isAttached>
							{PERIOD_OPTIONS.map((option) => (
								<Button
									key={option.value}
									variant={
										selectedPeriod === option.value ? "outline" : "ghost"
									}
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
									variant="outline"
									onClick={() => onNavigate("back")}
									aria-label="Previous period"
								/>
								{dateRangeLabel && (
									<Text size="sm" color="secondary">
										{dateRangeLabel}
									</Text>
								)}
								<Button
									leftIcon={<ChevronRight size={16} />}
									variant="outline"
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
					) : data.length === 0 ? (
						<Stack align="center" justify="center" gap="sm" style={{ height }}>
							<Icon icon={BarChart2} size="2xl" color="muted" />
							<Text color="secondary">No signup data available</Text>
						</Stack>
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
									<linearGradient
										id="signupGradient"
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop
											offset="5%"
											stopColor="var(--color-primary)"
											stopOpacity={0.3}
										/>
										<stop
											offset="95%"
											stopColor="var(--color-primary)"
											stopOpacity={0}
										/>
									</linearGradient>
								</defs>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="var(--color-border)"
									vertical={false}
								/>
								<XAxis
									dataKey="date"
									stroke="var(--color-base-content-tertiary)"
									tick={<CustomXAxisTick period={selectedPeriod} />}
									tickLine={false}
									axisLine={false}
									height={selectedPeriod === "hour" ? 45 : 30}
								/>
								<YAxis
									stroke="var(--color-base-content-tertiary)"
									tick={{
										fill: "var(--color-base-content-tertiary)",
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
										stroke: "var(--color-border)",
										strokeDasharray: "3 3",
									}}
								/>
								<Area
									type="monotone"
									dataKey="count"
									stroke="var(--color-primary)"
									strokeWidth={2}
									fill="url(#signupGradient)"
									dot={false}
									activeDot={{
										r: 4,
										fill: "var(--color-primary)",
										stroke: "var(--color-primary)",
										strokeWidth: 2,
									}}
								/>
							</AreaChart>
						</ResponsiveContainer>
					)}
				</div>
			</Stack>
		</Card>
	);
});

SignupsChart.displayName = "SignupsChart";
