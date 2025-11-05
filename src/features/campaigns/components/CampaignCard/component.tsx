/**
 * CampaignCard Component
 * Displays campaign summary in list/grid view
 */

import { memo, type HTMLAttributes } from 'react';
import { format } from 'date-fns';
import { StatusBadge } from '@/proto-design-system/StatusBadge/component';
import type { Campaign } from '@/types/common.types';
import styles from './component.module.scss';

export interface CampaignCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Campaign data to display */
  campaign: Campaign;
  /** Show statistics in the card */
  showStats?: boolean;
  /** Action handlers */
  actions?: {
    onEdit?: () => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
  };
  /** Additional CSS class name */
  className?: string;
}

/**
 * Maps campaign status to StatusBadge variant
 */
const getStatusVariant = (status: Campaign['status']) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'draft':
      return 'default';
    case 'paused':
      return 'warning';
    case 'completed':
      return 'info';
    default:
      return 'default';
  }
};

/**
 * CampaignCard displays a summary of a campaign
 */
export const CampaignCard = memo<CampaignCardProps>(
  function CampaignCard({
    campaign,
    showStats = false,
    actions,
    className: customClassName,
    onClick,
    ...props
  }) {
    const hasActions = actions && (actions.onEdit || actions.onDuplicate || actions.onDelete);

    const classNames = [
      styles.root,
      customClassName
    ].filter(Boolean).join(' ');

    return (
      <div
        className={classNames}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h3 className={styles.title}>{campaign.name}</h3>
            <StatusBadge
              variant={getStatusVariant(campaign.status)}
              size="small"
            >
              {campaign.status}
            </StatusBadge>
          </div>

          {/* Action Menu */}
          {hasActions && (
            <div className={styles.actions}>
              <button
                className={styles.actionButton}
                aria-label="More actions"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="ri-more-2-fill" aria-hidden="true" />
              </button>
              <div className={styles.actionMenu}>
                {actions.onEdit && (
                  <button
                    className={styles.actionMenuItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.onEdit?.();
                    }}
                  >
                    <i className="ri-edit-line" aria-hidden="true" />
                    <span>Edit</span>
                  </button>
                )}
                {actions.onDuplicate && (
                  <button
                    className={styles.actionMenuItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.onDuplicate?.();
                    }}
                  >
                    <i className="ri-file-copy-line" aria-hidden="true" />
                    <span>Duplicate</span>
                  </button>
                )}
                {actions.onDelete && (
                  <button
                    className={`${styles.actionMenuItem} ${styles.actionMenuItemDanger}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.onDelete?.();
                    }}
                  >
                    <i className="ri-delete-bin-line" aria-hidden="true" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {campaign.description && (
          <p className={styles.description}>{campaign.description}</p>
        )}

        {/* Stats */}
        {showStats && campaign.stats && (
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <i className="ri-user-add-line" aria-hidden="true" />
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  {campaign.stats.totalSignups.toLocaleString()}
                </span>
                <span className={styles.statLabel}>Signups</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <i className="ri-share-forward-line" aria-hidden="true" />
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  {campaign.stats.totalReferrals.toLocaleString()}
                </span>
                <span className={styles.statLabel}>Referrals</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <i className="ri-line-chart-line" aria-hidden="true" />
              <div className={styles.statContent}>
                <span className={styles.statValue}>
                  {campaign.stats.viralCoefficient.toFixed(1)}
                </span>
                <span className={styles.statLabel}>K-Factor</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.date}>
            <i className="ri-calendar-line" aria-hidden="true" />
            Created {format(campaign.createdAt, 'MMM d, yyyy')}
          </span>
        </div>
      </div>
    );
  }
);

CampaignCard.displayName = 'CampaignCard';
