import type { Meta, StoryObj } from '@storybook/react';
import { EmailCampaignForm } from './component';

const meta = {
  title: 'Features/Emails/EmailCampaignForm',
  component: EmailCampaignForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Form component for creating email campaigns with trigger configuration. Supports various trigger types including manual, signup, verified, milestone, scheduled, and inactive.',
      },
    },
  },
  argTypes: {
    campaignId: {
      control: 'text',
      description: 'Campaign ID this email campaign belongs to',
    },
    onSubmit: {
      action: 'onSubmit',
      description: 'Callback when the form is submitted',
    },
    onCancel: {
      action: 'onCancel',
      description: 'Callback when the cancel button is clicked',
    },
  },
} satisfies Meta<typeof EmailCampaignForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default email campaign form with all trigger options available
 */
export const Default: Story = {
  args: {
    campaignId: 'campaign-1',
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onCancel: () => {
      console.log('Form cancelled');
    },
  },
};

/**
 * Form without cancel button
 */
export const WithoutCancel: Story = {
  args: {
    campaignId: 'campaign-1',
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

/**
 * Form in a modal or narrow container
 */
export const InNarrowContainer: Story = {
  args: {
    campaignId: 'campaign-1',
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onCancel: () => {
      console.log('Form cancelled');
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Form with custom className for styling
 */
export const WithCustomClass: Story = {
  args: {
    campaignId: 'campaign-1',
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onCancel: () => {
      console.log('Form cancelled');
    },
    className: 'custom-email-form',
  },
};
