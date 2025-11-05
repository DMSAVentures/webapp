/**
 * CampaignStats Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { CampaignStats } from './component';
import { mockCampaignStats } from '@/mocks/campaigns.mock';

const meta = {
  title: 'Features/Campaigns/CampaignStats',
  component: CampaignStats,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    stats: {
      description: 'Campaign statistics to display',
      control: 'object',
    },
    loading: {
      description: 'Show loading state',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof CampaignStats>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * High performance campaign stats (viral)
 */
export const HighPerformance: Story = {
  args: {
    stats: mockCampaignStats.highPerformance,
  },
};

/**
 * Medium performance campaign stats
 */
export const MediumPerformance: Story = {
  args: {
    stats: mockCampaignStats.mediumPerformance,
  },
};

/**
 * Early stage campaign stats
 */
export const EarlyStage: Story = {
  args: {
    stats: mockCampaignStats.earlyStage,
  },
};

/**
 * Struggling campaign stats (sub-viral)
 */
export const Struggling: Story = {
  args: {
    stats: mockCampaignStats.struggling,
  },
};

/**
 * Viral campaign with exceptional stats
 */
export const Viral: Story = {
  args: {
    stats: mockCampaignStats.viral,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    stats: mockCampaignStats.highPerformance,
    loading: true,
  },
};

/**
 * Stats with different K-Factor values
 */
export const KFactorComparison: Story = {
  render: () => ({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      },
      children: [
        {
          type: 'div',
          props: {
            children: [
              {
                type: 'h3',
                props: {
                  style: { marginBottom: '8px', fontSize: '14px', color: '#666' },
                  children: 'Viral (K > 1)',
                },
              },
              {
                type: CampaignStats,
                props: {
                  stats: mockCampaignStats.viral,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            children: [
              {
                type: 'h3',
                props: {
                  style: { marginBottom: '8px', fontSize: '14px', color: '#666' },
                  children: 'Sub-viral (K < 1)',
                },
              },
              {
                type: CampaignStats,
                props: {
                  stats: mockCampaignStats.struggling,
                },
              },
            ],
          },
        },
      ],
    },
  }),
};

/**
 * Stats progression from early stage to viral
 */
export const ProgressionStory: Story = {
  render: () => ({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      },
      children: [
        {
          type: 'div',
          props: {
            children: [
              {
                type: 'h3',
                props: {
                  style: {
                    marginBottom: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111'
                  },
                  children: 'Early Stage',
                },
              },
              {
                type: CampaignStats,
                props: {
                  stats: mockCampaignStats.earlyStage,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            children: [
              {
                type: 'h3',
                props: {
                  style: {
                    marginBottom: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111'
                  },
                  children: 'Medium Performance',
                },
              },
              {
                type: CampaignStats,
                props: {
                  stats: mockCampaignStats.mediumPerformance,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            children: [
              {
                type: 'h3',
                props: {
                  style: {
                    marginBottom: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111'
                  },
                  children: 'High Performance',
                },
              },
              {
                type: CampaignStats,
                props: {
                  stats: mockCampaignStats.highPerformance,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            children: [
              {
                type: 'h3',
                props: {
                  style: {
                    marginBottom: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111'
                  },
                  children: 'Viral Campaign',
                },
              },
              {
                type: CampaignStats,
                props: {
                  stats: mockCampaignStats.viral,
                },
              },
            ],
          },
        },
      ],
    },
  }),
};
