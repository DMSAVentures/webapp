/**
 * AnalyticsDashboard Component
 * Campaign analytics overview with KPIs, charts, and insights
 */

import { memo, useState, type HTMLAttributes } from 'react';
import { GrowthChart } from '../GrowthChart/component';
import { ConversionFunnel } from '../ConversionFunnel/component';
import { TrafficSources } from '../TrafficSources/component';
import { Button } from '@/proto-design-system/Button/button';
import type { Analytics } from '@/types/common.types';
import styles from './component.module.scss';

export interface AnalyticsDashboardProps extends HTMLAttributes<HTMLDivElement> {
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
  return value.toLocaleString('en-US');
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
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

    const classNames = [
      styles.root,
      loading && styles.loading,
      customClassName
    ].filter(Boolean).join(' ');

    if (!analytics) {
      return (
        <div className={classNames} {...props}>
          <div className={styles.emptyState}>
            <i className="ri-line-chart-line" aria-hidden="true" />
            <h3>No Analytics Data</h3>
            <p>Analytics data will appear here once your campaign starts receiving traffic.</p>
          </div>
        </div>
      );
    }

    const { overview, funnel, trafficSources, timeline } = analytics;

    return (
      <div className={classNames} {...props}>
        {/* Header with actions */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Analytics Overview</h2>
            {dateRange && (
              <p className={styles.dateRange}>
                {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
              </p>
            )}
          </div>
          <div className={styles.actions}>
            {onExport && (
              <Button
                variant="secondary"
                size="medium"
                leftIcon="download-2-line"
                onClick={onExport}
              >
                Export
              </Button>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon}>
              <i className="ri-user-add-line" aria-hidden="true" />
            </div>
            <div className={styles.kpiContent}>
              <div className={styles.kpiLabel}>Total Signups</div>
              <div className={styles.kpiValue}>
                {loading ? (
                  <div className={styles.skeleton} />
                ) : (
                  formatNumber(overview.totalSignups)
                )}
              </div>
              {!loading && overview.todaySignups > 0 && (
                <div className={styles.kpiSubtext}>
                  <i className="ri-arrow-up-line" aria-hidden="true" />
                  {formatNumber(overview.todaySignups)} today
                </div>
              )}
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={`${styles.kpiIcon} ${styles.kpiIconSuccess}`}>
              <i className="ri-verified-badge-line" aria-hidden="true" />
            </div>
            <div className={styles.kpiContent}>
              <div className={styles.kpiLabel}>Verification Rate</div>
              <div className={styles.kpiValue}>
                {loading ? (
                  <div className={styles.skeleton} />
                ) : (
                  formatPercentage(overview.verificationRate)
                )}
              </div>
              <div className={styles.kpiSubtext}>
                Email verification rate
              </div>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={`${styles.kpiIcon} ${styles.kpiIconPurple}`}>
              <i className="ri-line-chart-line" aria-hidden="true" />
            </div>
            <div className={styles.kpiContent}>
              <div className={styles.kpiLabel}>K-Factor</div>
              <div className={styles.kpiValue}>
                {loading ? (
                  <div className={styles.skeleton} />
                ) : (
                  <>
                    {formatCoefficient(overview.viralCoefficient)}
                    <span className={styles.kpiBadge}>
                      {overview.viralCoefficient >= 1 ? (
                        <span className={styles.kpiBadgeSuccess}>Viral</span>
                      ) : (
                        <span className={styles.kpiBadgeWarning}>Sub-viral</span>
                      )}
                    </span>
                  </>
                )}
              </div>
              <div className={styles.kpiSubtext}>
                Viral coefficient
              </div>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={`${styles.kpiIcon} ${styles.kpiIconOrange}`}>
              <i className="ri-share-forward-line" aria-hidden="true" />
            </div>
            <div className={styles.kpiContent}>
              <div className={styles.kpiLabel}>Avg Referrals</div>
              <div className={styles.kpiValue}>
                {loading ? (
                  <div className={styles.skeleton} />
                ) : (
                  formatCoefficient(overview.avgReferralsPerUser)
                )}
              </div>
              <div className={styles.kpiSubtext}>
                Per user average
              </div>
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        {timeline && timeline.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Growth Over Time</h3>
            <GrowthChart data={timeline} height={350} />
          </div>
        )}

        {/* Two-column layout for Funnel and Traffic Sources */}
        <div className={styles.twoColumnGrid}>
          {/* Conversion Funnel */}
          <div className={styles.section}>
            <ConversionFunnel data={funnel} />
          </div>

          {/* Traffic Sources */}
          {trafficSources && trafficSources.length > 0 && (
            <div className={styles.section}>
              <div className={styles.chartTypeToggle}>
                <button
                  className={`${styles.toggleButton} ${chartType === 'pie' ? styles.toggleButtonActive : ''}`}
                  onClick={() => setChartType('pie')}
                  aria-label="Pie chart"
                >
                  <i className="ri-pie-chart-line" aria-hidden="true" />
                </button>
                <button
                  className={`${styles.toggleButton} ${chartType === 'bar' ? styles.toggleButtonActive : ''}`}
                  onClick={() => setChartType('bar')}
                  aria-label="Bar chart"
                >
                  <i className="ri-bar-chart-line" aria-hidden="true" />
                </button>
              </div>
              <TrafficSources data={trafficSources} chartType={chartType} />
            </div>
          )}
        </div>
      </div>
    );
  }
);

AnalyticsDashboard.displayName = 'AnalyticsDashboard';
