/**
 * CampaignList Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { CampaignList } from './component';
import { mockCampaigns, mockCampaignsByStatus } from '@/mocks/campaigns.mock';

const meta = {
  title: 'Features/Campaigns/CampaignList',
  component: CampaignList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    campaigns: {
      description: 'Array of campaigns to display',
      control: 'object',
    },
    view: {
      description: 'View mode: list or grid',
      control: 'select',
      options: ['list', 'grid'],
    },
    showFilters: {
      description: 'Show filter controls',
      control: 'boolean',
    },
    showViewToggle: {
      description: 'Show view toggle buttons',
      control: 'boolean',
    },
    showStats: {
      description: 'Show stats on campaign cards',
      control: 'boolean',
    },
    loading: {
      description: 'Show loading state',
      control: 'boolean',
    },
    onCampaignClick: {
      description: 'Campaign card click handler',
      action: 'campaign clicked',
    },
    onEdit: {
      description: 'Edit campaign handler',
      action: 'edit clicked',
    },
    onDuplicate: {
      description: 'Duplicate campaign handler',
      action: 'duplicate clicked',
    },
    onDelete: {
      description: 'Delete campaign handler',
      action: 'delete clicked',
    },
    onCreateCampaign: {
      description: 'Create campaign handler',
      action: 'create campaign clicked',
    },
  },
} satisfies Meta<typeof CampaignList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default grid view with all campaigns
 */
export const Default: Story = {
  args: {
    campaigns: mockCampaigns,
    view: 'grid',
    showFilters: true,
    showViewToggle: true,
    showStats: true,
  },
};

/**
 * List view
 */
export const ListView: Story = {
  args: {
    campaigns: mockCampaigns,
    view: 'list',
    showFilters: true,
    showViewToggle: true,
    showStats: true,
  },
};

/**
 * Without filters
 */
export const NoFilters: Story = {
  args: {
    campaigns: mockCampaigns,
    view: 'grid',
    showFilters: false,
    showViewToggle: false,
    showStats: true,
  },
};

/**
 * Without stats on cards
 */
export const NoStats: Story = {
  args: {
    campaigns: mockCampaigns,
    view: 'grid',
    showFilters: true,
    showViewToggle: true,
    showStats: false,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    campaigns: mockCampaigns,
    view: 'grid',
    showFilters: true,
    showViewToggle: true,
    showStats: true,
    loading: true,
  },
};

/**
 * Empty state (no campaigns)
 */
export const Empty: Story = {
  args: {
    campaigns: [],
    view: 'grid',
    showFilters: true,
    showViewToggle: true,
    showStats: true,
  },
};

/**
 * Only active campaigns
 */
export const ActiveOnly: Story = {
  args: {
    campaigns: mockCampaignsByStatus.active,
    view: 'grid',
    showFilters: true,
    showViewToggle: true,
    showStats: true,
  },
};

/**
 * Only draft campaigns
 */
export const DraftOnly: Story = {
  args: {
    campaigns: mockCampaignsByStatus.draft,
    view: 'grid',
    showFilters: true,
    showViewToggle: true,
    showStats: true,
  },
};

/**
 * Few campaigns (2)
 */
export const FewCampaigns: Story = {
  args: {
    campaigns: mockCampaigns.slice(0, 2),
    view: 'grid',
    showFilters: true,
    showViewToggle: true,
    showStats: true,
  },
};

/**
 * Many campaigns (with actions)
 */
export const WithActions: Story = {
  args: {
    campaigns: mockCampaigns,
    view: 'grid',
    showFilters: true,
    showViewToggle: true,
    showStats: true,
    onCampaignClick: (campaign) => console.log('Clicked:', campaign.name),
    onEdit: (campaign) => console.log('Edit:', campaign.name),
    onDuplicate: (campaign) => console.log('Duplicate:', campaign.name),
    onDelete: (campaign) => console.log('Delete:', campaign.name),
    onCreateCampaign: () => console.log('Create new campaign'),
  },
};

/**
 * Compact layout (list view without stats)
 */
export const Compact: Story = {
  args: {
    campaigns: mockCampaigns,
    view: 'list',
    showFilters: true,
    showViewToggle: true,
    showStats: false,
  },
};

/**
 * Mobile responsive preview
 */
export const MobileView: Story = {
  args: {
    campaigns: mockCampaigns.slice(0, 3),
    view: 'grid',
    showFilters: true,
    showViewToggle: true,
    showStats: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
