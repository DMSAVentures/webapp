/**
 * TrafficSources Component
 * Displays traffic sources using pie or bar chart
 */

import { memo, type HTMLAttributes } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './component.module.scss';

export interface TrafficSourceData {
  /** Source name */
  source: string;
  /** Number of users from this source */
  count: number;
  /** Percentage of total traffic */
  percentage: number;
}

export interface TrafficSourcesProps extends Omit<HTMLAttributes<HTMLDivElement>, 'data'> {
  /** Traffic source data to display */
  data: TrafficSourceData[];
  /** Chart type to display */
  chartType?: 'pie' | 'bar';
  /** Additional CSS class name */
  className?: string;
}

/**
 * Format number for display
 */
const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US');
};

/**
 * Format percentage
 */
const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Custom tooltip component
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{data.source}</p>
      <div className={styles.tooltipContent}>
        <div className={styles.tooltipItem}>
          <span className={styles.tooltipName}>Count:</span>
          <span className={styles.tooltipValue}>{formatNumber(data.count)}</span>
        </div>
        <div className={styles.tooltipItem}>
          <span className={styles.tooltipName}>Percentage:</span>
          <span className={styles.tooltipValue}>{formatPercentage(data.percentage)}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Custom label for pie chart
 */
const renderPieLabel = (entry: any) => {
  return `${formatPercentage(entry.percentage)}`;
};

/**
 * TrafficSources displays traffic source distribution
 */
export const TrafficSources = memo<TrafficSourcesProps>(
  function TrafficSources({
    data,
    chartType = 'pie',
    className: customClassName,
    ...props
  }) {
    const classNames = [
      styles.root,
      customClassName
    ].filter(Boolean).join(' ');

    // Color palette for sources
    const COLORS = [
      '#3b82f6', // Blue
      '#10b981', // Green
      '#f59e0b', // Orange
      '#8b5cf6', // Purple
      '#ec4899', // Pink
      '#06b6d4', // Cyan
      '#f97316', // Dark Orange
      '#6366f1', // Indigo
    ];

    return (
      <div className={classNames} {...props}>
        <div className={styles.header}>
          <h3 className={styles.title}>Traffic Sources</h3>
          <p className={styles.subtitle}>Where your users come from</p>
        </div>

        {chartType === 'pie' ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine
                label={renderPieLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value, entry: any) => {
                  const item = data.find(d => d.source === entry.payload.source);
                  return `${value} (${formatPercentage(item?.percentage || 0)})`;
                }}
                wrapperStyle={{
                  fontSize: '14px',
                  color: 'var(--color-text-primary-default)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-secondary-default)" />
              <XAxis
                dataKey="source"
                stroke="var(--color-text-secondary-default)"
                tick={{ fill: 'var(--color-text-secondary-default)', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
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
              <Bar dataKey="count" name="Users" radius={[8, 8, 0, 0]}>
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Source list */}
        <div className={styles.sourceList}>
          {data.map((source, index) => (
            <div key={source.source} className={styles.sourceItem}>
              <span
                className={styles.sourceDot}
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className={styles.sourceName}>{source.source}</span>
              <span className={styles.sourceCount}>{formatNumber(source.count)}</span>
              <span className={styles.sourcePercentage}>({formatPercentage(source.percentage)})</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

TrafficSources.displayName = 'TrafficSources';
