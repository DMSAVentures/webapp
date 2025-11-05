/**
 * CampaignForm Component
 * Form for creating or editing campaigns
 */

import { memo, useState, type FormEvent, type HTMLAttributes } from 'react';
import { validateRequired, validateLength } from '@/utils/validation';
import type { Campaign, CampaignSettings } from '@/types/common.types';
import styles from './component.module.scss';

export interface CampaignFormData {
  name: string;
  description?: string;
  settings: {
    emailVerificationRequired: boolean;
    duplicateHandling: 'block' | 'update' | 'allow';
    enableReferrals: boolean;
    enableRewards: boolean;
  };
}

export interface CampaignFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Initial form data for editing */
  initialData?: Partial<CampaignFormData>;
  /** Submit handler */
  onSubmit: (data: CampaignFormData) => Promise<void> | void;
  /** Cancel handler */
  onCancel?: () => void;
  /** Loading state */
  loading?: boolean;
  /** Submit button text */
  submitText?: string;
  /** Additional CSS class name */
  className?: string;
}

interface FormErrors {
  name?: string;
  description?: string;
}

/**
 * CampaignForm for creating/editing campaigns
 */
export const CampaignForm = memo<CampaignFormProps>(
  function CampaignForm({
    initialData,
    onSubmit,
    onCancel,
    loading = false,
    submitText = 'Create Campaign',
    className: customClassName,
    ...props
  }) {
    // Form state
    const [formData, setFormData] = useState<CampaignFormData>({
      name: initialData?.name || '',
      description: initialData?.description || '',
      settings: {
        emailVerificationRequired: initialData?.settings?.emailVerificationRequired ?? true,
        duplicateHandling: initialData?.settings?.duplicateHandling || 'block',
        enableReferrals: initialData?.settings?.enableReferrals ?? true,
        enableRewards: initialData?.settings?.enableRewards ?? true,
      },
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Validation
    const validateField = (name: keyof FormErrors, value: string): string | null => {
      switch (name) {
        case 'name':
          return validateRequired(value, 'Campaign name') ||
                 validateLength(value, { min: 3, max: 100, fieldName: 'Campaign name' });
        case 'description':
          return validateLength(value, { max: 500, fieldName: 'Description' });
        default:
          return null;
      }
    };

    const handleBlur = (field: keyof FormErrors) => {
      setTouched(prev => ({ ...prev, [field]: true }));
      const error = validateField(field, formData[field] || '');
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    };

    const handleChange = (field: keyof Pick<CampaignFormData, 'name' | 'description'>, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (touched[field]) {
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [field]: error || undefined }));
      }
    };

    const handleSettingChange = (setting: keyof CampaignSettings, value: boolean | string) => {
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [setting]: value,
        },
      }));
    };

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      // Validate all fields
      const nameError = validateField('name', formData.name);
      const descriptionError = validateField('description', formData.description || '');

      if (nameError || descriptionError) {
        setErrors({
          name: nameError || undefined,
          description: descriptionError || undefined,
        });
        setTouched({ name: true, description: true });
        return;
      }

      await onSubmit(formData);
    };

    const classNames = [
      styles.root,
      customClassName
    ].filter(Boolean).join(' ');

    return (
      <form className={classNames} onSubmit={handleSubmit} {...props}>
        {/* Campaign Name */}
        <div className={styles.field}>
          <label htmlFor="campaign-name" className={styles.label}>
            Campaign Name
            <span className={styles.required}>*</span>
          </label>
          <input
            id="campaign-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            placeholder="e.g., Product Launch 2025"
            disabled={loading}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && touched.name && (
            <span id="name-error" className={styles.errorMessage}>
              <i className="ri-error-warning-line" aria-hidden="true" />
              {errors.name}
            </span>
          )}
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label htmlFor="campaign-description" className={styles.label}>
            Description
            <span className={styles.optional}>(Optional)</span>
          </label>
          <textarea
            id="campaign-description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
            placeholder="Describe your campaign..."
            rows={3}
            disabled={loading}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          <div className={styles.fieldHelp}>
            {formData.description?.length || 0} / 500 characters
          </div>
          {errors.description && touched.description && (
            <span id="description-error" className={styles.errorMessage}>
              <i className="ri-error-warning-line" aria-hidden="true" />
              {errors.description}
            </span>
          )}
        </div>

        {/* Settings Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Campaign Settings</h3>

          {/* Email Verification */}
          <div className={styles.checkboxField}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.settings.emailVerificationRequired}
                onChange={(e) => handleSettingChange('emailVerificationRequired', e.target.checked)}
                disabled={loading}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                <strong>Require email verification</strong>
                <span className={styles.checkboxDescription}>
                  Users must verify their email before being added to waitlist
                </span>
              </span>
            </label>
          </div>

          {/* Enable Referrals */}
          <div className={styles.checkboxField}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.settings.enableReferrals}
                onChange={(e) => handleSettingChange('enableReferrals', e.target.checked)}
                disabled={loading}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                <strong>Enable referral system</strong>
                <span className={styles.checkboxDescription}>
                  Allow users to refer others and track viral growth
                </span>
              </span>
            </label>
          </div>

          {/* Enable Rewards */}
          <div className={styles.checkboxField}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.settings.enableRewards}
                onChange={(e) => handleSettingChange('enableRewards', e.target.checked)}
                disabled={loading}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                <strong>Enable reward system</strong>
                <span className={styles.checkboxDescription}>
                  Reward users for reaching referral milestones
                </span>
              </span>
            </label>
          </div>

          {/* Duplicate Handling */}
          <div className={styles.field}>
            <label htmlFor="duplicate-handling" className={styles.label}>
              Duplicate Email Handling
            </label>
            <select
              id="duplicate-handling"
              value={formData.settings.duplicateHandling}
              onChange={(e) => handleSettingChange('duplicateHandling', e.target.value)}
              disabled={loading}
              className={styles.select}
            >
              <option value="block">Block - Reject duplicate signups</option>
              <option value="update">Update - Replace existing entry</option>
              <option value="allow">Allow - Create new entry</option>
            </select>
          </div>
        </div>

        {/* Form Actions */}
        <div className={styles.actions}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line ri-spin" aria-hidden="true" />
                Saving...
              </>
            ) : (
              <>
                <i className="ri-check-line" aria-hidden="true" />
                {submitText}
              </>
            )}
          </button>
        </div>
      </form>
    );
  }
);

CampaignForm.displayName = 'CampaignForm';
