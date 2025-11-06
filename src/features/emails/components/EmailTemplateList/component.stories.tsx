import type { Meta, StoryObj } from '@storybook/react';
import { EmailTemplateList } from './component';
import { mockEmailTemplates } from '@/mocks/emails.mock';

const meta = {
  title: 'Features/Emails/EmailTemplateList',
  component: EmailTemplateList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Displays a list of email templates with actions like preview, edit, duplicate, and delete. Shows template details including name, type, subject, preheader, and status. Note: This component currently shows an empty state in Storybook. In production, it fetches templates from the API.',
      },
    },
  },
  argTypes: {
    campaignId: {
      control: 'text',
      description: 'Campaign ID to fetch templates for',
    },
    onSelect: {
      action: 'onSelect',
      description: 'Callback when a template is selected',
    },
  },
} satisfies Meta<typeof EmailTemplateList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default email template list - shows empty state
 * In production, this component fetches templates from the API
 */
export const Default: Story = {
  args: {
    campaignId: 'campaign-1',
    onSelect: (templateId) => {
      console.log('Template selected:', templateId);
    },
  },
};

/**
 * Empty state when no templates exist
 * This is the current behavior in Storybook since the component fetches from API
 */
export const EmptyState: Story = {
  args: {
    campaignId: 'campaign-empty',
    onSelect: (templateId) => {
      console.log('Template selected:', templateId);
    },
  },
};

/**
 * Template list without selection handler
 */
export const WithoutSelection: Story = {
  args: {
    campaignId: 'campaign-1',
  },
};

/**
 * Template list in a narrow container (mobile view)
 */
export const MobileView: Story = {
  args: {
    campaignId: 'campaign-1',
    onSelect: (templateId) => {
      console.log('Template selected:', templateId);
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Template list with custom className
 */
export const WithCustomClass: Story = {
  args: {
    campaignId: 'campaign-1',
    onSelect: (templateId) => {
      console.log('Template selected:', templateId);
    },
    className: 'custom-template-list',
  },
};
