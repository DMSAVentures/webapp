/**
 * RewardBuilder Component
 * Form for creating or editing campaign rewards
 */

import { memo, useState, type FormEvent, type HTMLAttributes } from 'react';
import { validateRequired, validateLength, validateNumber, validateDate } from '@/utils/validation';
import type { Reward } from '@/types/common.types';
import { Button } from '@/proto-design-system/Button/button';
import { TextInput } from '@/proto-design-system/TextInput/textInput';
import { TextArea } from '@/proto-design-system/TextArea/textArea';
import ContentDivider from '@/proto-design-system/contentdivider/contentdivider';
import Dropdown from '@/proto-design-system/dropdown/dropdown';
import styles from './component.module.scss';

export interface CreateRewardRequest {
  name: string;
  description: string;
  type: Reward['type'];
  value?: string;
  tier: number;
  triggerType: Reward['triggerType'];
  triggerValue?: number;
  inventory?: number;
  expiryDate?: Date;
  deliveryMethod: Reward['deliveryMethod'];
}

export interface RewardBuilderProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Campaign ID this reward belongs to */
  campaignId: string;
  /** Initial reward data for editing */
  initialData?: Partial<Reward>;
  /** Submit handler */
  onSubmit: (data: CreateRewardRequest) => Promise<void> | void;
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
  value?: string;
  tier?: string;
  triggerValue?: string;
  inventory?: string;
  expiryDate?: string;
}

/**
 * RewardBuilder for creating/editing rewards
 */
export const RewardBuilder = memo<RewardBuilderProps>(
  function RewardBuilder({
    campaignId,
    initialData,
    onSubmit,
    onCancel,
    loading = false,
    submitText = 'Create Reward',
    className: customClassName,
    ...props
  }) {
    // Form state
    const [formData, setFormData] = useState<CreateRewardRequest>({
      name: initialData?.name || '',
      description: initialData?.description || '',
      type: initialData?.type || 'early_access',
      value: initialData?.value || '',
      tier: initialData?.tier || 1,
      triggerType: initialData?.triggerType || 'referral_count',
      triggerValue: initialData?.triggerValue,
      inventory: initialData?.inventory,
      expiryDate: initialData?.expiryDate,
      deliveryMethod: initialData?.deliveryMethod || 'email',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Validation
    const validateField = (name: keyof FormErrors, value: string | number | Date | undefined): string | null => {
      switch (name) {
        case 'name':
          return validateRequired(value, 'Reward name') ||
                 validateLength(value as string, { min: 3, max: 100, fieldName: 'Reward name' });
        case 'description':
          return validateRequired(value, 'Description') ||
                 validateLength(value as string, { min: 10, max: 500, fieldName: 'Description' });
        case 'value':
          if (value) {
            return validateLength(value as string, { max: 100, fieldName: 'Reward value' });
          }
          return null;
        case 'tier':
          return validateRequired(value, 'Tier') ||
                 validateNumber(value as number, { min: 1, max: 10, fieldName: 'Tier' });
        case 'triggerValue':
          if (formData.triggerType !== 'manual' && !value) {
            return 'Trigger value is required for this trigger type';
          }
          if (value) {
            return validateNumber(value as number, { min: 1, fieldName: 'Trigger value' });
          }
          return null;
        case 'inventory':
          if (value) {
            return validateNumber(value as number, { min: 1, fieldName: 'Inventory' });
          }
          return null;
        case 'expiryDate':
          if (value) {
            return validateDate(value as Date, {
              minDate: new Date(),
              fieldName: 'Expiry date'
            });
          }
          return null;
        default:
          return null;
      }
    };

    const handleBlur = (field: keyof FormErrors) => {
      setTouched(prev => ({ ...prev, [field]: true }));
      const value = formData[field as keyof CreateRewardRequest];
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    };

    const handleChange = (field: keyof CreateRewardRequest, value: string | number | Date | undefined) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (touched[field]) {
        const error = validateField(field as keyof FormErrors, value);
        setErrors(prev => ({ ...prev, [field]: error || undefined }));
      }
    };

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      // Validate all fields
      const nameError = validateField('name', formData.name);
      const descriptionError = validateField('description', formData.description);
      const tierError = validateField('tier', formData.tier);
      const triggerValueError = validateField('triggerValue', formData.triggerValue);

      if (nameError || descriptionError || tierError || triggerValueError) {
        setErrors({
          name: nameError || undefined,
          description: descriptionError || undefined,
          tier: tierError || undefined,
          triggerValue: triggerValueError || undefined,
        });
        setTouched({
          name: true,
          description: true,
          tier: true,
          triggerValue: true
        });
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
        {/* Reward Name */}
        <TextInput
          id="reward-name"
          label="Reward Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="e.g., VIP Early Access"
          disabled={loading}
          required
          error={touched.name ? errors.name : undefined}
        />

        {/* Description */}
        <TextArea
          id="reward-description"
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Describe what users will receive..."
          rows={4}
          disabled={loading}
          maxLength={500}
          required
          error={touched.description ? errors.description : undefined}
        />

        {/* Reward Type */}
        <Dropdown
          label="Reward Type"
          placeholderText="Select reward type"
          size="medium"
          options={[
            {
              label: 'Early Access',
              value: 'early_access',
              description: 'Priority access to product or service'
            },
            {
              label: 'Discount',
              value: 'discount',
              description: 'Percentage or fixed amount discount'
            },
            {
              label: 'Premium Feature',
              value: 'premium_feature',
              description: 'Unlock exclusive features'
            },
            {
              label: 'Merchandise',
              value: 'merchandise',
              description: 'Physical or digital merchandise'
            },
            {
              label: 'Custom',
              value: 'custom',
              description: 'Custom reward type'
            }
          ]}
          disabled={loading}
          onChange={(option) => handleChange('type', option.value as Reward['type'])}
        />

        {/* Reward Value */}
        <TextInput
          id="reward-value"
          label="Reward Value"
          type="text"
          value={formData.value || ''}
          onChange={(e) => handleChange('value', e.target.value)}
          onBlur={() => handleBlur('value')}
          placeholder='e.g., "20% off", "Free for 6 months"'
          disabled={loading}
          error={touched.value ? errors.value : undefined}
          hint="Optional - Describe the value users receive"
        />

        {/* Tier */}
        <TextInput
          id="reward-tier"
          label="Reward Tier"
          type="number"
          value={formData.tier.toString()}
          onChange={(e) => handleChange('tier', parseInt(e.target.value) || 1)}
          onBlur={() => handleBlur('tier')}
          placeholder="1"
          disabled={loading}
          required
          min={1}
          max={10}
          error={touched.tier ? errors.tier : undefined}
          hint="Tier 1 is lowest, Tier 10 is highest"
        />

        {/* Divider */}
        <ContentDivider size="thin" />

        {/* Trigger Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Unlock Requirements</h3>

          {/* Trigger Type */}
          <Dropdown
            label="Trigger Type"
            placeholderText="Select trigger type"
            size="medium"
            options={[
              {
                label: 'Referral Count',
                value: 'referral_count',
                description: 'Unlock after N successful referrals'
              },
              {
                label: 'Waitlist Position',
                value: 'position',
                description: 'Unlock for top N positions'
              },
              {
                label: 'Manual',
                value: 'manual',
                description: 'Manually assign to users'
              }
            ]}
            disabled={loading}
            onChange={(option) => handleChange('triggerType', option.value as Reward['triggerType'])}
          />

          {/* Trigger Value (conditional) */}
          {formData.triggerType !== 'manual' && (
            <TextInput
              id="reward-trigger-value"
              label={
                formData.triggerType === 'referral_count'
                  ? 'Number of Referrals'
                  : 'Position Threshold'
              }
              type="number"
              value={formData.triggerValue?.toString() || ''}
              onChange={(e) => handleChange('triggerValue', parseInt(e.target.value) || undefined)}
              onBlur={() => handleBlur('triggerValue')}
              placeholder={
                formData.triggerType === 'referral_count'
                  ? 'e.g., 5'
                  : 'e.g., 100'
              }
              disabled={loading}
              required
              min={1}
              error={touched.triggerValue ? errors.triggerValue : undefined}
              hint={
                formData.triggerType === 'referral_count'
                  ? 'Users must refer this many people'
                  : 'Users in top N positions receive reward'
              }
            />
          )}
        </div>

        {/* Divider */}
        <ContentDivider size="thin" />

        {/* Delivery Settings */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Delivery Settings</h3>

          {/* Delivery Method */}
          <Dropdown
            label="Delivery Method"
            placeholderText="Select delivery method"
            size="medium"
            options={[
              {
                label: 'Email',
                value: 'email',
                description: 'Send reward details via email'
              },
              {
                label: 'Dashboard',
                value: 'dashboard',
                description: 'Show in user dashboard'
              },
              {
                label: 'API/Webhook',
                value: 'api_webhook',
                description: 'Trigger via API webhook'
              }
            ]}
            disabled={loading}
            onChange={(option) => handleChange('deliveryMethod', option.value as Reward['deliveryMethod'])}
          />

          {/* Inventory (optional) */}
          <TextInput
            id="reward-inventory"
            label="Inventory Limit"
            type="number"
            value={formData.inventory?.toString() || ''}
            onChange={(e) => handleChange('inventory', e.target.value ? parseInt(e.target.value) : undefined)}
            onBlur={() => handleBlur('inventory')}
            placeholder="Unlimited"
            disabled={loading}
            min={1}
            error={touched.inventory ? errors.inventory : undefined}
            hint="Optional - Limit total number of rewards available"
          />

          {/* Expiry Date (optional) */}
          <TextInput
            id="reward-expiry"
            label="Expiry Date"
            type="date"
            value={formData.expiryDate ? new Date(formData.expiryDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleChange('expiryDate', e.target.value ? new Date(e.target.value) : undefined)}
            onBlur={() => handleBlur('expiryDate')}
            disabled={loading}
            error={touched.expiryDate ? errors.expiryDate : undefined}
            hint="Optional - Reward expires after this date"
          />
        </div>

        {/* Divider */}
        <ContentDivider size="thin" />

        {/* Preview Card */}
        <div className={styles.preview}>
          <h3 className={styles.previewTitle}>Preview</h3>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div className={styles.previewTier}>Tier {formData.tier}</div>
              <div className={styles.previewType}>{formData.type.replace('_', ' ')}</div>
            </div>
            <h4 className={styles.previewName}>{formData.name || 'Reward Name'}</h4>
            <p className={styles.previewDescription}>
              {formData.description || 'Reward description will appear here...'}
            </p>
            {formData.value && (
              <div className={styles.previewValue}>
                <i className="ri-gift-line" aria-hidden="true" />
                {formData.value}
              </div>
            )}
            {formData.triggerType !== 'manual' && formData.triggerValue && (
              <div className={styles.previewRequirement}>
                <i className="ri-checkbox-circle-line" aria-hidden="true" />
                {formData.triggerType === 'referral_count'
                  ? `Refer ${formData.triggerValue} ${formData.triggerValue === 1 ? 'person' : 'people'}`
                  : `Top ${formData.triggerValue} on waitlist`
                }
              </div>
            )}
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

RewardBuilder.displayName = 'RewardBuilder';
