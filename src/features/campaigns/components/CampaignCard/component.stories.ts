/**
 * CampaignCard Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { CampaignCard } from './component';
import { mockCampaigns, mockCampaignsByStatus } from '@/mocks/campaigns.mock';

const meta = {
  title: 'Features/Campaigns/CampaignCard',
  component: CampaignCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    campaign: {
      description: 'Campaign data to display',
      control: 'object',
    },
    showStats: {
      description: 'Show campaign statistics',
      control: 'boolean',
    },
    onClick: {
      description: 'Click handler for the card',
      action: 'clicked',
    },
    actions: {
      description: 'Action handlers for edit, duplicate, delete',
      control: 'object',
    },
  },
} satisfies Meta<typeof CampaignCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default campaign card
 */
export const Default: Story = {
  args: {
    campaign: mockCampaigns[0],
    showStats: false,
  },
};

/**
 * Campaign card with statistics
 */
export const WithStats: Story = {
  args: {
    campaign: mockCampaigns[0],
    showStats: true,
  },
};

/**
 * Campaign card with actions
 */
export const WithActions: Story = {
  args: {
    campaign: mockCampaigns[0],
    showStats: true,
    actions: {
      onEdit: () => console.log('Edit clicked'),
      onDuplicate: () => console.log('Duplicate clicked'),
      onDelete: () => console.log('Delete clicked'),
    },
  },
};

/**
 * Active campaign
 */
export const ActiveCampaign: Story = {
  args: {
    campaign: mockCampaignsByStatus.active[0],
    showStats: true,
    actions: {
      onEdit: () => console.log('Edit clicked'),
      onDuplicate: () => console.log('Duplicate clicked'),
      onDelete: () => console.log('Delete clicked'),
    },
  },
};

/**
 * Draft campaign
 */
export const DraftCampaign: Story = {
  args: {
    campaign: mockCampaignsByStatus.draft[0],
    showStats: true,
    actions: {
      onEdit: () => console.log('Edit clicked'),
      onDuplicate: () => console.log('Duplicate clicked'),
      onDelete: () => console.log('Delete clicked'),
    },
  },
};

/**
 * Paused campaign
 */
export const PausedCampaign: Story = {
  args: {
    campaign: mockCampaignsByStatus.paused[0],
    showStats: true,
    actions: {
      onEdit: () => console.log('Edit clicked'),
      onDuplicate: () => console.log('Duplicate clicked'),
      onDelete: () => console.log('Delete clicked'),
    },
  },
};

/**
 * Completed campaign
 */
export const CompletedCampaign: Story = {
  args: {
    campaign: mockCampaignsByStatus.completed[0],
    showStats: true,
    actions: {
      onEdit: () => console.log('Edit clicked'),
      onDuplicate: () => console.log('Duplicate clicked'),
      onDelete: () => console.log('Delete clicked'),
    },
  },
};

/**
 * High performance campaign (viral)
 */
export const HighPerformance: Story = {
  args: {
    campaign: mockCampaigns[3], // AI Writing Assistant - viral stats
    showStats: true,
    actions: {
      onEdit: () => console.log('Edit clicked'),
      onDuplicate: () => console.log('Duplicate clicked'),
      onDelete: () => console.log('Delete clicked'),
    },
  },
};

/**
 * Early stage campaign
 */
export const EarlyStage: Story = {
  args: {
    campaign: mockCampaigns[2], // E-commerce Platform - early stage
    showStats: true,
    actions: {
      onEdit: () => console.log('Edit clicked'),
      onDuplicate: () => console.log('Duplicate clicked'),
      onDelete: () => console.log('Delete clicked'),
    },
  },
};

/**
 * Campaign without description
 */
export const NoDescription: Story = {
  args: {
    campaign: {
      ...mockCampaigns[0],
      description: undefined,
    },
    showStats: true,
    actions: {
      onEdit: () => console.log('Edit clicked'),
      onDuplicate: () => console.log('Duplicate clicked'),
      onDelete: () => console.log('Delete clicked'),
    },
  },
};

/**
 * Multiple cards in a grid
 */
export const GridLayout: Story = {
  render: () => ({
    type: 'div',
    props: {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '16px',
        padding: '16px',
      },
      children: mockCampaigns.slice(0, 4).map((campaign) => ({
        type: CampaignCard,
        key: campaign.id,
        props: {
          campaign,
          showStats: true,
          actions: {
            onEdit: () => console.log('Edit', campaign.id),
            onDuplicate: () => console.log('Duplicate', campaign.id),
            onDelete: () => console.log('Delete', campaign.id),
          },
        },
      })),
    },
  }),
};
