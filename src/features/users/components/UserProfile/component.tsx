/**
 * UserProfile Component
 * User detail modal with full information and actions
 */

import { memo, useState, type HTMLAttributes } from 'react';
import Modal from '@/proto-design-system/Modal/modal';
import { Button } from '@/proto-design-system/Button/button';
import { IconOnlyButton } from '@/proto-design-system/Button/IconOnlyButton';
import StatusBadge from '@/proto-design-system/StatusBadge/statusBadge';
import ContentDivider from '@/proto-design-system/contentdivider/contentdivider';
import type { WaitlistUser, RewardEarned } from '@/types/common.types';
import styles from './component.module.scss';

export interface UserProfileProps extends HTMLAttributes<HTMLDivElement> {
  /** User ID to display */
  userId: string;
  /** User data */
  user: WaitlistUser;
  /** Referred users (referral tree) */
  referredUsers?: WaitlistUser[];
  /** Rewards earned */
  rewards?: RewardEarned[];
  /** Close handler */
  onClose: () => void;
  /** Send email handler */
  onSendEmail?: (userId: string) => void;
  /** Update status handler */
  onUpdateStatus?: (userId: string, status: WaitlistUser['status']) => void;
  /** Delete handler */
  onDelete?: (userId: string) => void;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Maps waitlist user status to StatusBadge variant
 */
const getStatusVariant = (status: WaitlistUser['status']): "completed" | "pending" | "failed" | "disabled" => {
  switch (status) {
    case 'verified':
    case 'active':
      return 'completed';
    case 'pending':
      return 'pending';
    case 'rejected':
      return 'failed';
    case 'invited':
      return 'pending';
    default:
      return 'pending';
  }
};

/**
 * Formats status for display
 */
const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * UserProfile displays detailed user information in a modal
 */
export const UserProfile = memo<UserProfileProps>(
  function UserProfile({
    userId,
    user,
    referredUsers = [],
    rewards = [],
    onClose,
    onSendEmail,
    onUpdateStatus,
    onDelete,
    className: customClassName,
    ...props
  }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<WaitlistUser['status']>(user.status);

    const classNames = [
      styles.root,
      customClassName
    ].filter(Boolean).join(' ');

    const handleUpdateStatus = () => {
      if (onUpdateStatus && selectedStatus !== user.status) {
        onUpdateStatus(userId, selectedStatus);
      }
    };

    const handleDelete = () => {
      if (onDelete) {
        onDelete(userId);
        setIsDeleteModalOpen(false);
        onClose();
      }
    };

    return (
      <>
        <Modal
          open={true}
          onClose={onClose}
          size="large"
        >
          <div className={classNames} {...props}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.userAvatar}>
                  <i className="ri-user-line" aria-hidden="true" />
                </div>
                <div className={styles.userInfo}>
                  <h2 className={styles.userName}>{user.name || 'Unknown'}</h2>
                  <p className={styles.userEmail}>{user.email}</p>
                </div>
                <StatusBadge
                  text={formatStatus(user.status)}
                  variant={getStatusVariant(user.status)}
                  styleType="stroke"
                />
              </div>
              <IconOnlyButton
                iconClass="close-line"
                variant="secondary"
                ariaLabel="Close"
                onClick={onClose}
              />
            </div>

            <ContentDivider size="thin" />

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <i className="ri-number-1" aria-hidden="true" />
                <div className={styles.statContent}>
                  <span className={styles.statValue}>#{user.position}</span>
                  <span className={styles.statLabel}>Position</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <i className="ri-share-forward-line" aria-hidden="true" />
                <div className={styles.statContent}>
                  <span className={styles.statValue}>{user.referralCount}</span>
                  <span className={styles.statLabel}>Referrals</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <i className="ri-star-line" aria-hidden="true" />
                <div className={styles.statContent}>
                  <span className={styles.statValue}>{user.points}</span>
                  <span className={styles.statLabel}>Points</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <i className="ri-link" aria-hidden="true" />
                <div className={styles.statContent}>
                  <span className={styles.statValue}>{user.source}</span>
                  <span className={styles.statLabel}>Source</span>
                </div>
              </div>
            </div>

            <ContentDivider size="thin" />

            {/* Details Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Details</h3>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Referral Code</span>
                  <span className={styles.detailValue}>{user.referralCode}</span>
                </div>
                {user.referredBy && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Referred By</span>
                    <span className={styles.detailValue}>{user.referredBy}</span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Created At</span>
                  <span className={styles.detailValue}>
                    {new Date(user.createdAt).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {user.verifiedAt && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Verified At</span>
                    <span className={styles.detailValue}>
                      {new Date(user.verifiedAt).toLocaleString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
                {user.invitedAt && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Invited At</span>
                    <span className={styles.detailValue}>
                      {new Date(user.invitedAt).toLocaleString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* UTM Parameters */}
            {user.utmParams && Object.keys(user.utmParams).length > 0 && (
              <>
                <ContentDivider size="thin" />
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>UTM Parameters</h3>
                  <div className={styles.detailsGrid}>
                    {user.utmParams.source && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Source</span>
                        <span className={styles.detailValue}>{user.utmParams.source}</span>
                      </div>
                    )}
                    {user.utmParams.medium && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Medium</span>
                        <span className={styles.detailValue}>{user.utmParams.medium}</span>
                      </div>
                    )}
                    {user.utmParams.campaign && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Campaign</span>
                        <span className={styles.detailValue}>{user.utmParams.campaign}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Metadata */}
            {user.metadata && (
              <>
                <ContentDivider size="thin" />
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Metadata</h3>
                  <div className={styles.detailsGrid}>
                    {user.metadata.country && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Country</span>
                        <span className={styles.detailValue}>{user.metadata.country}</span>
                      </div>
                    )}
                    {user.metadata.device && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Device</span>
                        <span className={styles.detailValue}>
                          {user.metadata.device.charAt(0).toUpperCase() + user.metadata.device.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Referral Tree */}
            {referredUsers.length > 0 && (
              <>
                <ContentDivider size="thin" />
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Referred Users ({referredUsers.length})</h3>
                  <div className={styles.referralList}>
                    {referredUsers.map((referredUser) => (
                      <div key={referredUser.id} className={styles.referralItem}>
                        <div className={styles.referralInfo}>
                          <i className="ri-user-line" aria-hidden="true" />
                          <div>
                            <div className={styles.referralName}>
                              {referredUser.name || referredUser.email}
                            </div>
                            <div className={styles.referralEmail}>
                              {referredUser.email}
                            </div>
                          </div>
                        </div>
                        <StatusBadge
                          text={formatStatus(referredUser.status)}
                          variant={getStatusVariant(referredUser.status)}
                          styleType="stroke"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Rewards Earned */}
            {rewards.length > 0 && (
              <>
                <ContentDivider size="thin" />
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Rewards Earned ({rewards.length})</h3>
                  <div className={styles.rewardList}>
                    {rewards.map((reward) => (
                      <div key={reward.id} className={styles.rewardItem}>
                        <i className="ri-gift-line" aria-hidden="true" />
                        <div className={styles.rewardInfo}>
                          <div className={styles.rewardStatus}>
                            {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                          </div>
                          <div className={styles.rewardDate}>
                            Earned {new Date(reward.earnedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <ContentDivider size="thin" />

            {/* Actions Section */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Actions</h3>
              <div className={styles.actionsGrid}>
                {/* Update Status */}
                <div className={styles.actionItem}>
                  <label className={styles.actionLabel}>Update Status</label>
                  <div className={styles.actionControl}>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as WaitlistUser['status'])}
                      className={styles.statusSelect}
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="invited">Invited</option>
                      <option value="active">Active</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <Button
                      variant="secondary"
                      onClick={handleUpdateStatus}
                      disabled={selectedStatus === user.status}
                    >
                      Update
                    </Button>
                  </div>
                </div>

                {/* Send Email */}
                {onSendEmail && (
                  <div className={styles.actionItem}>
                    <Button
                      variant="secondary"
                      leftIcon="ri-mail-line"
                      onClick={() => onSendEmail(userId)}
                      className={styles.actionButton}
                    >
                      Send Email
                    </Button>
                  </div>
                )}

                {/* Delete User */}
                {onDelete && (
                  <div className={styles.actionItem}>
                    <Button
                      variant="secondary"
                      leftIcon="ri-delete-bin-line"
                      onClick={() => setIsDeleteModalOpen(true)}
                      className={styles.actionButton}
                    >
                      Delete User
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>

        {/* Delete confirmation modal */}
        <Modal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          size="small"
        >
          <div className={styles.deleteModal}>
            <div className={styles.deleteModalHeader}>
              <div className={styles.deleteModalIcon}>
                <i className="ri-alert-line" aria-hidden="true" />
              </div>
              <h2 className={styles.deleteModalTitle}>Delete User</h2>
            </div>
            <p className={styles.deleteModalDescription}>
              Are you sure you want to delete {user.name || user.email}? This action cannot be undone.
            </p>
            <div className={styles.deleteModalActions}>
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
);

UserProfile.displayName = 'UserProfile';
