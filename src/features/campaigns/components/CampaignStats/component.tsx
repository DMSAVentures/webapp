/**
 * CampaignStats Component
 * Display campaign statistics with KPI cards
 */

import { memo, type HTMLAttributes } from 'react';
import type { CampaignStats as CampaignStatsType } from '@/types/common.types';
import styles from './component.module.scss';

export interface CampaignStatsProps extends HTMLAttributes<HTMLDivElement> {
  /** Campaign statistics to display */
  stats: CampaignStatsType;
  /** Show loading state */
  loading?: boolean;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Format number with commas for thousands
 */
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

/**
 * Format percentage
 */
const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

/**
 * Format coefficient (K-Factor)
 */
const formatCoefficient = (num: number): string => {
  return num.toFixed(2);
};

/**
 * CampaignStats displays key performance indicators
 */
export const CampaignStats = memo<CampaignStatsProps>(
  function CampaignStats({
    stats,
    loading = false,
    className: customClassName,
    ...props
  }) {
    const classNames = [
      styles.root,
      loading && styles.loading,
      customClassName
    ].filter(Boolean).join(' ');

    return (
      <div className={classNames} {...props}>
        {/* Total Signups */}
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="ri-user-add-line" aria-hidden="true" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Signups</div>
            <div className={styles.statValue}>
              {loading ? (
                <div className={styles.skeleton} />
              ) : (
                formatNumber(stats.totalSignups)
              )}
            </div>
            <div className={styles.statSubtext}>
              All users who joined
            </div>
          </div>
        </div>

        {/* Verified Signups */}
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconSuccess}`}>
            <i className="ri-verified-badge-line" aria-hidden="true" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Verified</div>
            <div className={styles.statValue}>
              {loading ? (
                <div className={styles.skeleton} />
              ) : (
                <>
                  {formatNumber(stats.verifiedSignups)}
                  <span className={styles.statPercentage}>
                    ({formatPercentage(stats.conversionRate)})
                  </span>
                </>
              )}
            </div>
            <div className={styles.statSubtext}>
              Email verified users
            </div>
          </div>
        </div>

        {/* Total Referrals */}
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
            <i className="ri-share-forward-line" aria-hidden="true" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Referrals</div>
            <div className={styles.statValue}>
              {loading ? (
                <div className={styles.skeleton} />
              ) : (
                formatNumber(stats.totalReferrals)
              )}
            </div>
            <div className={styles.statSubtext}>
              Users referred by others
            </div>
          </div>
        </div>

        {/* Viral Coefficient (K-Factor) */}
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
            <i className="ri-line-chart-line" aria-hidden="true" />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>K-Factor</div>
            <div className={styles.statValue}>
              {loading ? (
                <div className={styles.skeleton} />
              ) : (
                <>
                  {formatCoefficient(stats.viralCoefficient)}
                  <span className={styles.statBadge}>
                    {stats.viralCoefficient >= 1 ? (
                      <span className={styles.statBadgeSuccess}>
                        <i className="ri-arrow-up-line" aria-hidden="true" />
                        Viral
                      </span>
                    ) : (
                      <span className={styles.statBadgeWarning}>
                        <i className="ri-arrow-down-line" aria-hidden="true" />
                        Sub-viral
                      </span>
                    )}
                  </span>
                </>
              )}
            </div>
            <div className={styles.statSubtext}>
              Average referrals per user
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CampaignStats.displayName = 'CampaignStats';
