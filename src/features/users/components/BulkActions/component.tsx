/**
 * BulkActions Component
 * Bulk operations toolbar for selected users
 */

import { memo, useState, type HTMLAttributes } from 'react';
import { Button } from '@/proto-design-system/Button/button';
import { IconOnlyButton } from '@/proto-design-system/Button/IconOnlyButton';
import Modal from '@/proto-design-system/modal/modal';
import styles from './component.module.scss';

export interface BulkActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Selected user IDs */
  selectedUserIds: string[];
  /** Action handler */
  onAction: (action: 'email' | 'status' | 'export' | 'delete') => Promise<void>;
  /** Clear selection handler */
  onClearSelection: () => void;
  /** Additional CSS class name */
  className?: string;
}

/**
 * BulkActions displays a toolbar for bulk operations on selected users
 */
export const BulkActions = memo<BulkActionsProps>(
  function BulkActions({
    selectedUserIds,
    onAction,
    onClearSelection,
    className: customClassName,
    ...props
  }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const classNames = [
      styles.root,
      customClassName
    ].filter(Boolean).join(' ');

    const handleAction = async (action: 'email' | 'status' | 'export' | 'delete') => {
      // Show confirmation for delete action
      if (action === 'delete') {
        setIsDeleteModalOpen(true);
        return;
      }

      setIsLoading(true);
      try {
        await onAction(action);
      } catch (error) {
        console.error(`Failed to ${action}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleConfirmDelete = async () => {
      setIsLoading(true);
      try {
        await onAction('delete');
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Failed to delete users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedUserIds.length === 0) {
      return null;
    }

    return (
      <>
        <div className={classNames} {...props}>
          <div className={styles.content}>
            {/* Selection count */}
            <div className={styles.selectionInfo}>
              <i className="ri-checkbox-multiple-line" aria-hidden="true" />
              <span className={styles.selectionCount}>
                {selectedUserIds.length} user{selectedUserIds.length !== 1 ? 's' : ''} selected
              </span>
            </div>

            {/* Action buttons */}
            <div className={styles.actions}>
              <Button
                variant="secondary"
                leftIcon="ri-mail-line"
                onClick={() => handleAction('email')}
                disabled={isLoading}
              >
                Send Email
              </Button>
              <Button
                variant="secondary"
                leftIcon="ri-refresh-line"
                onClick={() => handleAction('status')}
                disabled={isLoading}
              >
                Update Status
              </Button>
              <Button
                variant="secondary"
                leftIcon="ri-download-line"
                onClick={() => handleAction('export')}
                disabled={isLoading}
              >
                Export
              </Button>
              <Button
                variant="secondary"
                leftIcon="ri-delete-bin-line"
                onClick={() => handleAction('delete')}
                disabled={isLoading}
              >
                Delete
              </Button>
            </div>

            {/* Clear selection */}
            <IconOnlyButton
              iconClass="close-line"
              variant="secondary"
              ariaLabel="Clear selection"
              onClick={onClearSelection}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Delete confirmation modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Users"
          description={`Are you sure you want to delete ${selectedUserIds.length} user${selectedUserIds.length !== 1 ? 's' : ''}? This action cannot be undone.`}
          icon="warning"
          dismissibleByCloseIcon={true}
          proceedText={isLoading ? 'Deleting...' : 'Delete'}
          cancelText="Cancel"
          onCancel={() => setIsDeleteModalOpen(false)}
          onProceed={handleConfirmDelete}
        >
          {/* Modal content is handled by the Modal component itself */}
        </Modal>
      </>
    );
  }
);

BulkActions.displayName = 'BulkActions';
