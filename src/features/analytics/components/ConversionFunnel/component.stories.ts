import type { Meta, StoryObj } from '@storybook/react';
import { ConversionFunnel } from './component';

const meta = {
  title: 'Features/Analytics/ConversionFunnel',
  component: ConversionFunnel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ConversionFunnel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default conversion funnel with typical drop-off
 */
export const Default: Story = {
  args: {
    data: {
      impressions: 10000,
      started: 5000,
      submitted: 3500,
      verified: 2800,
      referred: 1400,
    },
  },
};

/**
 * High conversion funnel with minimal drop-off
 */
export const HighConversion: Story = {
  args: {
    data: {
      impressions: 5000,
      started: 4500,
      submitted: 4200,
      verified: 4000,
      referred: 3500,
    },
  },
};

/**
 * Low conversion with significant drop-off at verification
 */
export const LowConversion: Story = {
  args: {
    data: {
      impressions: 20000,
      started: 8000,
      submitted: 4000,
      verified: 1000,
      referred: 200,
    },
  },
};

/**
 * Early campaign with low numbers
 */
export const EarlyCampaign: Story = {
  args: {
    data: {
      impressions: 500,
      started: 250,
      submitted: 180,
      verified: 150,
      referred: 75,
    },
  },
};

/**
 * Mature campaign with high volume
 */
export const MatureCampaign: Story = {
  args: {
    data: {
      impressions: 100000,
      started: 65000,
      submitted: 52000,
      verified: 45000,
      referred: 32000,
    },
  },
};

/**
 * Perfect funnel (unrealistic but shows the ideal)
 */
export const PerfectFunnel: Story = {
  args: {
    data: {
      impressions: 1000,
      started: 1000,
      submitted: 1000,
      verified: 1000,
      referred: 1000,
    },
  },
};
