/**
 * ConversionFunnel Component
 * Displays conversion funnel visualization with stages and conversion rates
 */

import { AlertTriangle } from "lucide-react";
import { type HTMLAttributes, memo, useMemo } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	LabelList,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Text } from "@/proto-design-system/components/primitives/Text";
import styles from "./component.module.scss";

export interface ConversionFunnelData {
	/** Number of impressions */
	impressions: number;
	/** Number of users who started the form */
	started: number;
	/** Number of users who submitted the form */
	submitted: number;
	/** Number of users who verified their email */
	verified: number;
	/** Number of users who made a referral */
	referred: number;
}

export interface ConversionFunnelProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "data"> {
	/** Funnel data to display */
	data: ConversionFunnelData;
	/** Additional CSS class name */
	className?: string;
}

interface FunnelStage {
	name: string;
	value: number;
	conversion: number;
	dropOff: number;
}

// ============================================================================
// Constants
// ============================================================================

const FUNNEL_COLORS = [
	"var(--color-info-default)",
	"var(--color-success-default)",
	"var(--color-warning-default)",
	"hsl(270, 10%, 60%)",
	"hsl(330, 10%, 60%)",
];

// ============================================================================
// Pure Functions
// ============================================================================

/** Format number for display */
function formatNumber(value: number): string {
	return value.toLocaleString("en-US");
}

/** Format percentage */
function formatPercentage(value: number): string {
	return `${value.toFixed(1)}%`;
}

/** Get bar color for a stage */
function getBarColor(index: number): string {
	return FUNNEL_COLORS[index] || FUNNEL_COLORS[0];
}

/** Build funnel stages from data */
function buildFunnelStages(data: ConversionFunnelData): FunnelStage[] {
	const { impressions, started, submitted, verified, referred } = data;

	return [
		{
			name: "Impressions",
			value: impressions,
			conversion: 100,
			dropOff: 0,
		},
		{
			name: "Started",
			value: started,
			conversion: impressions > 0 ? (started / impressions) * 100 : 0,
			dropOff:
				impressions > 0 ? ((impressions - started) / impressions) * 100 : 0,
		},
		{
			name: "Submitted",
			value: submitted,
			conversion: started > 0 ? (submitted / started) * 100 : 0,
			dropOff: started > 0 ? ((started - submitted) / started) * 100 : 0,
		},
		{
			name: "Verified",
			value: verified,
			conversion: submitted > 0 ? (verified / submitted) * 100 : 0,
			dropOff: submitted > 0 ? ((submitted - verified) / submitted) * 100 : 0,
		},
		{
			name: "Referred",
			value: referred,
			conversion: verified > 0 ? (referred / verified) * 100 : 0,
			dropOff: verified > 0 ? ((verified - referred) / verified) * 100 : 0,
		},
	];
}

/** Calculate the index of the biggest drop-off stage */
function calculateBiggestDropOffIndex(stages: FunnelStage[]): number {
	let maxDropOff = 0;
	let maxIndex = -1;

	stages.forEach((stage, index) => {
		if (index > 0 && stage.dropOff > maxDropOff) {
			maxDropOff = stage.dropOff;
			maxIndex = index;
		}
	});

	return maxIndex;
}

// ============================================================================
// Sub-Components
// ============================================================================

/** Custom label component for bars */
interface CustomLabelProps {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	value?: number;
	conversion?: number;
}

function CustomLabel(props: CustomLabelProps) {
	const { x, y, width, height, value, conversion } = props;

	if (
		x === undefined ||
		y === undefined ||
		width === undefined ||
		height === undefined ||
		value === undefined
	) {
		return null;
	}

	return (
		<g>
			<text
				x={x + width + 10}
				y={y + height / 2}
				fill="var(--color-text-primary-default)"
				textAnchor="start"
				dominantBaseline="middle"
				fontSize={14}
				fontWeight={600}
			>
				{formatNumber(value)}
			</text>
			<text
				x={x + width + 10}
				y={y + height / 2 + 18}
				fill="var(--color-text-secondary-default)"
				textAnchor="start"
				dominantBaseline="middle"
				fontSize={12}
			>
				{conversion ? formatPercentage(conversion) : ""}
			</text>
		</g>
	);
}

/** Custom tooltip component */
interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		payload: FunnelStage;
	}>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
	if (!active || !payload || !payload.length) {
		return null;
	}

	const data = payload[0].payload;

	return (
		<div className={styles.tooltip}>
			<p className={styles.tooltipLabel}>{data.name}</p>
			<div className={styles.tooltipContent}>
				<div className={styles.tooltipItem}>
					<span className={styles.tooltipName}>Count:</span>
					<span className={styles.tooltipValue}>
						{formatNumber(data.value)}
					</span>
				</div>
				{data.conversion && (
					<div className={styles.tooltipItem}>
						<span className={styles.tooltipName}>Conversion:</span>
						<span className={styles.tooltipValue}>
							{formatPercentage(data.conversion)}
						</span>
					</div>
				)}
				{data.dropOff && (
					<div className={styles.tooltipItem}>
						<span className={styles.tooltipName}>Drop-off:</span>
						<span className={styles.tooltipValue}>
							{formatPercentage(data.dropOff)}
						</span>
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
 * ConversionFunnel displays funnel visualization with conversion rates
 */
export const ConversionFunnel = memo<ConversionFunnelProps>(
	function ConversionFunnel({ data, className: customClassName, ...props }) {
		// Derived state
		const chartData = useMemo(() => buildFunnelStages(data), [data]);

		const biggestDropOffIndex = useMemo(
			() => calculateBiggestDropOffIndex(chartData),
			[chartData],
		);

		const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

		// Render
		return (
			<Stack gap="md" className={classNames} {...props}>
				<Stack gap="xs">
					<Text as="h3" size="lg" weight="semibold">
						Conversion Funnel
					</Text>
					{biggestDropOffIndex > 0 && (
						<Stack direction="row" gap="xs" align="center">
							<Icon icon={AlertTriangle} size="sm" color="warning" />
							<Text size="sm" color="secondary">
								Biggest drop-off at{" "}
								<Text as="strong" weight="semibold">
									{chartData[biggestDropOffIndex].name}
								</Text>
							</Text>
						</Stack>
					)}
				</Stack>

				<ResponsiveContainer width="100%" height={400}>
					<BarChart
						data={chartData}
						layout="vertical"
						margin={{ top: 20, right: 120, left: 20, bottom: 20 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="var(--color-border-secondary-default)"
						/>
						<XAxis
							type="number"
							stroke="var(--color-text-secondary-default)"
							tick={{
								fill: "var(--color-text-secondary-default)",
								fontSize: 12,
							}}
							tickFormatter={formatNumber}
						/>
						<YAxis
							type="category"
							dataKey="name"
							stroke="var(--color-text-secondary-default)"
							tick={{ fill: "var(--color-text-primary-default)", fontSize: 14 }}
							width={100}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Bar dataKey="value" radius={[0, 8, 8, 0]}>
							{chartData.map((_entry, index) => (
								<Cell key={`cell-${index}`} fill={getBarColor(index)} />
							))}
							<LabelList content={<CustomLabel />} />
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</Stack>
		);
	},
);

ConversionFunnel.displayName = "ConversionFunnel";
