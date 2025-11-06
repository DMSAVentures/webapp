/**
 * GrowthChart Component
 * Time-series line chart showing signups and referrals over time
 */

import { memo, type HTMLAttributes } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import styles from './component.module.scss';

export interface GrowthChartData {
  /** Date string (ISO format or parseable date) */
  date: string;
  /** Number of signups on this date */
  signups: number;
  /** Number of referrals on this date */
  referrals: number;
}

export interface GrowthChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'data'> {
  /** Time-series data to display */
  data: GrowthChartData[];
  /** Height of the chart in pixels */
  height?: number;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Format date for display on X-axis
 */
const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return format(date, 'MMM d');
  } catch {
    return dateStr;
  }
};

/**
 * Format number for tooltip
 */
const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US');
};

/**
 * Custom tooltip component
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{formatDate(label)}</p>
      <div className={styles.tooltipContent}>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className={styles.tooltipItem}>
            <span
              className={styles.tooltipDot}
              style={{ backgroundColor: entry.color }}
            />
            <span className={styles.tooltipName}>{entry.name}:</span>
            <span className={styles.tooltipValue}>{formatNumber(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * GrowthChart displays time-series data for signups and referrals
 */
export const GrowthChart = memo<GrowthChartProps>(
  function GrowthChart({
    data,
    height = 300,
    className: customClassName,
    ...props
  }) {
    const classNames = [
      styles.root,
      customClassName
    ].filter(Boolean).join(' ');

    // Chart colors from design system
    const COLORS = {
      signups: '#3b82f6', // Blue
      referrals: '#10b981', // Green
    };

    return (
      <div className={classNames} {...props}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-secondary-default)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="var(--color-text-secondary-default)"
              tick={{ fill: 'var(--color-text-secondary-default)', fontSize: 12 }}
            />
            <YAxis
              stroke="var(--color-text-secondary-default)"
              tick={{ fill: 'var(--color-text-secondary-default)', fontSize: 12 }}
              tickFormatter={formatNumber}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: '14px',
                color: 'var(--color-text-primary-default)',
              }}
            />
            <Line
              type="monotone"
              dataKey="signups"
              name="Signups"
              stroke={COLORS.signups}
              strokeWidth={2}
              dot={{ fill: COLORS.signups, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="referrals"
              name="Referrals"
              stroke={COLORS.referrals}
              strokeWidth={2}
              dot={{ fill: COLORS.referrals, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

GrowthChart.displayName = 'GrowthChart';
