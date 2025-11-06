/**
 * UserList Component
 * Display waitlist users with filters and sorting
 */

import { memo, useState, useMemo, useCallback, type HTMLAttributes } from 'react';
import { Button } from '@/proto-design-system/Button/button';
import { IconOnlyButton } from '@/proto-design-system/Button/IconOnlyButton';
import StatusBadge from '@/proto-design-system/StatusBadge/statusBadge';
import Checkbox from '@/proto-design-system/Checkbox/Checkbox';
import { UserFilters, type UserFilters as UserFiltersType } from '../UserFilters/component';
import { BulkActions } from '../BulkActions/component';
import type { WaitlistUser } from '@/types/common.types';
import styles from './component.module.scss';

export interface UserListProps extends HTMLAttributes<HTMLDivElement> {
  /** Campaign ID */
  campaignId: string;
  /** Users to display */
  users: WaitlistUser[];
  /** Loading state */
  loading?: boolean;
  /** Show filters panel */
  showFilters?: boolean;
  /** User click handler */
  onUserClick?: (user: WaitlistUser) => void;
  /** Export handler */
  onExport?: (userIds: string[]) => Promise<void>;
  /** Bulk action handler */
  onBulkAction?: (action: string, userIds: string[]) => Promise<void>;
  /** Additional CSS class name */
  className?: string;
}

type SortField = 'email' | 'name' | 'status' | 'position' | 'referralCount' | 'source' | 'createdAt';
type SortDirection = 'asc' | 'desc';

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
 * Converts status text to display format
 */
const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * UserList displays a filterable, sortable list of waitlist users
 */
export const UserList = memo<UserListProps>(
  function UserList({
    campaignId,
    users,
    loading = false,
    showFilters = true,
    onUserClick,
    onExport,
    onBulkAction,
    className: customClassName,
    ...props
  }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('position');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [filters, setFilters] = useState<UserFiltersType>({});
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const classNames = [
      styles.root,
      customClassName
    ].filter(Boolean).join(' ');

    // Handle sort
    const handleSort = useCallback((field: SortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    }, [sortField, sortDirection]);

    // Filter and sort users
    const filteredAndSortedUsers = useMemo(() => {
      let filtered = users;

      // Apply search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(user =>
          user.email.toLowerCase().includes(query) ||
          user.name?.toLowerCase().includes(query)
        );
      }

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        filtered = filtered.filter(user => filters.status!.includes(user.status));
      }

      if (filters.source && filters.source.length > 0) {
        filtered = filtered.filter(user => filters.source!.includes(user.source));
      }

      if (filters.hasReferrals) {
        filtered = filtered.filter(user => user.referralCount > 0);
      }

      if (filters.minPosition !== undefined) {
        filtered = filtered.filter(user => user.position >= filters.minPosition!);
      }

      if (filters.maxPosition !== undefined) {
        filtered = filtered.filter(user => user.position <= filters.maxPosition!);
      }

      if (filters.dateRange) {
        filtered = filtered.filter(user => {
          const createdAt = new Date(user.createdAt);
          return createdAt >= filters.dateRange!.start && createdAt <= filters.dateRange!.end;
        });
      }

      // Sort
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
          case 'email':
            aValue = a.email;
            bValue = b.email;
            break;
          case 'name':
            aValue = a.name || '';
            bValue = b.name || '';
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'position':
            aValue = a.position;
            bValue = b.position;
            break;
          case 'referralCount':
            aValue = a.referralCount;
            bValue = b.referralCount;
            break;
          case 'source':
            aValue = a.source;
            bValue = b.source;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          default:
            return 0;
        }

        if (typeof aValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      });

      return filtered;
    }, [users, searchQuery, filters, sortField, sortDirection]);

    // Handle select all
    const handleSelectAll = useCallback(() => {
      if (selectedUserIds.length === filteredAndSortedUsers.length) {
        setSelectedUserIds([]);
      } else {
        setSelectedUserIds(filteredAndSortedUsers.map(u => u.id));
      }
    }, [selectedUserIds, filteredAndSortedUsers]);

    // Handle select user
    const handleSelectUser = useCallback((userId: string) => {
      setSelectedUserIds(prev =>
        prev.includes(userId)
          ? prev.filter(id => id !== userId)
          : [...prev, userId]
      );
    }, []);

    // Handle bulk action
    const handleBulkAction = async (action: 'email' | 'status' | 'export' | 'delete') => {
      if (action === 'export' && onExport) {
        await onExport(selectedUserIds);
      } else if (onBulkAction) {
        await onBulkAction(action, selectedUserIds);
      }
      setSelectedUserIds([]);
    };

    // Handle export CSV
    const handleExportAll = async () => {
      if (onExport) {
        await onExport(filteredAndSortedUsers.map(u => u.id));
      }
    };

    // Empty state
    if (!loading && users.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <i className="ri-user-line" aria-hidden="true" />
          </div>
          <h3 className={styles.emptyStateTitle}>No users yet</h3>
          <p className={styles.emptyStateDescription}>
            Users who sign up for this campaign will appear here
          </p>
        </div>
      );
    }

    return (
      <div className={classNames} {...props}>
        <div className={styles.container}>
          {/* Filters sidebar */}
          {showFilters && isFilterPanelOpen && (
            <div className={styles.filterPanel}>
              <UserFilters
                filters={filters}
                onChange={(newFilters) => {
                  setFilters(newFilters);
                  setIsFilterPanelOpen(false);
                }}
                onReset={() => {
                  setFilters({});
                  setIsFilterPanelOpen(false);
                }}
              />
            </div>
          )}

          {/* Main content */}
          <div className={styles.main}>
            {/* Header with search and actions */}
            <div className={styles.header}>
              {/* Search */}
              <div className={styles.searchBox}>
                <i className="ri-search-line" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    className={styles.searchClear}
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <i className="ri-close-line" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className={styles.headerActions}>
                {showFilters && (
                  <IconOnlyButton
                    iconClass="filter-line"
                    variant="secondary"
                    ariaLabel="Toggle filters"
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                  />
                )}
                <Button
                  variant="secondary"
                  leftIcon="ri-download-line"
                  onClick={handleExportAll}
                >
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Results count */}
            <div className={styles.resultsInfo}>
              {filteredAndSortedUsers.length} user{filteredAndSortedUsers.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>

            {/* User table */}
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.loadingSpinner} />
                <p>Loading users...</p>
              </div>
            ) : filteredAndSortedUsers.length === 0 ? (
              <div className={styles.noResults}>
                <i className="ri-search-line" aria-hidden="true" />
                <p>No users found</p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({});
                  }}
                  variant="secondary"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      <th className={styles.tableHeaderCell}>
                        <Checkbox
                          checked={selectedUserIds.length === filteredAndSortedUsers.length}
                          onChange={handleSelectAll}
                          aria-label="Select all users"
                        />
                      </th>
                      <th className={styles.tableHeaderCell}>
                        <button
                          className={styles.sortButton}
                          onClick={() => handleSort('email')}
                        >
                          Email
                          {sortField === 'email' && (
                            <i
                              className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-s-line`}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </th>
                      <th className={styles.tableHeaderCell}>
                        <button
                          className={styles.sortButton}
                          onClick={() => handleSort('name')}
                        >
                          Name
                          {sortField === 'name' && (
                            <i
                              className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-s-line`}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </th>
                      <th className={styles.tableHeaderCell}>
                        <button
                          className={styles.sortButton}
                          onClick={() => handleSort('status')}
                        >
                          Status
                          {sortField === 'status' && (
                            <i
                              className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-s-line`}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </th>
                      <th className={styles.tableHeaderCell}>
                        <button
                          className={styles.sortButton}
                          onClick={() => handleSort('position')}
                        >
                          Position
                          {sortField === 'position' && (
                            <i
                              className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-s-line`}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </th>
                      <th className={styles.tableHeaderCell}>
                        <button
                          className={styles.sortButton}
                          onClick={() => handleSort('referralCount')}
                        >
                          Referrals
                          {sortField === 'referralCount' && (
                            <i
                              className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-s-line`}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </th>
                      <th className={styles.tableHeaderCell}>
                        <button
                          className={styles.sortButton}
                          onClick={() => handleSort('source')}
                        >
                          Source
                          {sortField === 'source' && (
                            <i
                              className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-s-line`}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </th>
                      <th className={styles.tableHeaderCell}>
                        <button
                          className={styles.sortButton}
                          onClick={() => handleSort('createdAt')}
                        >
                          Date
                          {sortField === 'createdAt' && (
                            <i
                              className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-s-line`}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {filteredAndSortedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={`${styles.tableRow} ${selectedUserIds.includes(user.id) ? styles.tableRowSelected : ''}`}
                        onClick={() => onUserClick?.(user)}
                      >
                        <td className={styles.tableCell}>
                          <Checkbox
                            checked={selectedUserIds.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.email}>{user.email}</span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.name}>{user.name || '-'}</span>
                        </td>
                        <td className={styles.tableCell}>
                          <StatusBadge
                            text={formatStatus(user.status)}
                            variant={getStatusVariant(user.status)}
                            styleType="stroke"
                          />
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.position}>#{user.position}</span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.referralCount}>
                            {user.referralCount}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.source}>
                            {user.source.charAt(0).toUpperCase() + user.source.slice(1)}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span className={styles.date}>
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Bulk actions */}
        <BulkActions
          selectedUserIds={selectedUserIds}
          onAction={handleBulkAction}
          onClearSelection={() => setSelectedUserIds([])}
        />
      </div>
    );
  }
);

UserList.displayName = 'UserList';
