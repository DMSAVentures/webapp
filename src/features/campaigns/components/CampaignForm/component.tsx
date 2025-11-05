/**
 * CampaignForm Component
 * Form for creating or editing campaigns
 */

import { memo, useState, type FormEvent, type HTMLAttributes } from 'react';
import { validateRequired, validateLength } from '@/utils/validation';
import type { CampaignSettings } from '@/types/common.types';
import { Button } from '@/proto-design-system/Button/button';
import { TextInput } from '@/proto-design-system/TextInput/textInput';
import { TextArea } from '@/proto-design-system/TextArea/textArea';
import CheckboxWithLabel from '@/proto-design-system/checkbox/checkboxWithLabel';
import ContentDivider from '@/proto-design-system/contentdivider/contentdivider';
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
        <TextInput
          id="campaign-name"
          label="Campaign Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="e.g., Product Launch 2025"
          disabled={loading}
          required
          error={touched.name ? errors.name : undefined}
        />

        {/* Description */}
        <TextArea
          id="campaign-description"
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Describe your campaign..."
          rows={5}
          disabled={loading}
          maxLength={500}
          error={touched.description ? errors.description : undefined}
        />

        {/* Settings Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Campaign Settings</h3>

          {/* Email Verification */}
          <CheckboxWithLabel
            checked={formData.settings.emailVerificationRequired ? "checked" : "unchecked"}
            onChange={(e) => handleSettingChange('emailVerificationRequired', e.target.checked)}
            disabled={loading}
            flipCheckboxToRight={false}
            text="Require email verification"
            description="Users must verify their email before being added to waitlist"
          />

          {/* Enable Referrals */}
          <CheckboxWithLabel
            checked={formData.settings.enableReferrals ? "checked" : "unchecked"}
            onChange={(e) => handleSettingChange('enableReferrals', e.target.checked)}
            disabled={loading}
            flipCheckboxToRight={false}
            text="Enable referral system"
            description="Allow users to refer others and track viral growth"
          />

          {/* Enable Rewards */}
          <CheckboxWithLabel
            checked={formData.settings.enableRewards ? "checked" : "unchecked"}
            onChange={(e) => handleSettingChange('enableRewards', e.target.checked)}
            disabled={loading}
            flipCheckboxToRight={false}
            text="Enable reward system"
            description="Reward users for reaching referral milestones"
          />

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

        {/* Divider */}
        <ContentDivider size="thin" />

        {/* Form Actions */}
        <div className={styles.actions}>
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              disabled={loading}
              variant="secondary"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            leftIcon={loading ? "ri-loader-4-line ri-spin" : "ri-check-line"}
          >
            {loading ? 'Saving...' : submitText}
          </Button>
        </div>
      </form>
    );
  }
);

CampaignForm.displayName = 'CampaignForm';
