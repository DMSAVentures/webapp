/**
 * TeamInviteModal Component
 * Modal for inviting new team members
 */

import { memo, useState, type HTMLAttributes } from 'react';
import Modal from '@/proto-design-system/modal/modal';
import { TextInput } from '@/proto-design-system/TextInput/textInput';
import Dropdown, { type DropdownOptionInput } from '@/proto-design-system/dropdown/dropdown';
import type { TeamMember } from '@/types/common.types';
import styles from './component.module.scss';

export interface TeamInviteModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when invite is submitted */
  onInvite: (data: { email: string; role: TeamMember['role'] }) => Promise<void>;
  /** Loading state during submission */
  loading?: boolean;
}

/**
 * Role options for the dropdown
 */
const ROLE_OPTIONS: DropdownOptionInput[] = [
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'Can view campaigns and analytics',
  },
  {
    value: 'editor',
    label: 'Editor',
    description: 'Can edit campaigns and manage users',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full access except billing',
  },
];

/**
 * Validates email format
 */
const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return null;
};

/**
 * TeamInviteModal allows inviting new team members
 */
export const TeamInviteModal = memo(
  function TeamInviteModal({
    isOpen,
    onClose,
    onInvite,
    loading = false,
    ...props
  }: TeamInviteModalProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<TeamMember['role']>('viewer');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Handle email change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      setEmailError(null);
      setSubmitError(null);
    };

    // Handle role change
    const handleRoleChange = (option: DropdownOptionInput) => {
      setRole(option.value as TeamMember['role']);
      setSubmitError(null);
    };

    // Handle form submission
    const handleSubmit = async () => {
      // Validate email
      const error = validateEmail(email);
      if (error) {
        setEmailError(error);
        return;
      }

      try {
        await onInvite({ email, role });
        // Reset form on success
        setEmail('');
        setRole('viewer');
        setEmailError(null);
        setSubmitError(null);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to invite team member';
        setSubmitError(message);
      }
    };

    // Handle modal close
    const handleClose = () => {
      // Reset form
      setEmail('');
      setRole('viewer');
      setEmailError(null);
      setSubmitError(null);
      onClose();
    };

    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Invite Team Member"
        description="Send an invitation to join your team"
        dismissibleByCloseIcon={true}
        proceedText={loading ? "Sending..." : "Send Invite"}
        cancelText="Cancel"
        onProceed={handleSubmit}
        onCancel={handleClose}
      >
        <div className={styles.root} {...props}>
          <div className={styles.formGroup}>
            <TextInput
              label="Email Address"
              placeholder="team@example.com"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={emailError || undefined}
              disabled={loading}
              required
              showLeftIcon={true}
              leftIcon="ri-mail-line"
            />
          </div>

          <div className={styles.formGroup}>
            <Dropdown
              label="Role"
              placeholderText="Select a role"
              options={ROLE_OPTIONS}
              size="medium"
              onChange={handleRoleChange}
              disabled={loading}
            />
          </div>

          {submitError && (
            <div className={styles.error}>
              <i className="ri-error-warning-line" aria-hidden="true" />
              {submitError}
            </div>
          )}
        </div>
      </Modal>
    );
  }
);

TeamInviteModal.displayName = 'TeamInviteModal';
