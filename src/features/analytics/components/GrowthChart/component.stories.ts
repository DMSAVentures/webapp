import type { Meta, StoryObj } from '@storybook/react';
import { GrowthChart } from './component';
import {
  mockAnalyticsHighPerformance,
  mockAnalyticsViral,
  mockAnalyticsEarlyStage,
  mockAnalyticsStruggling,
} from '@/mocks';

const meta = {
  title: 'Features/Analytics/GrowthChart',
  component: GrowthChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    height: {
      control: 'number',
      description: 'Height of the chart in pixels',
    },
  },
} satisfies Meta<typeof GrowthChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default growth chart with high-performance campaign data (30 days)
 */
export const Default: Story = {
  args: {
    data: mockAnalyticsHighPerformance.timeline,
    height: 300,
  },
};

/**
 * Viral campaign with strong exponential growth (90 days)
 */
export const ViralGrowth: Story = {
  args: {
    data: mockAnalyticsViral.timeline,
    height: 350,
  },
};

/**
 * Early stage campaign with steady growth (21 days)
 */
export const EarlyStage: Story = {
  args: {
    data: mockAnalyticsEarlyStage.timeline,
    height: 300,
  },
};

/**
 * Struggling campaign with minimal growth (30 days)
 */
export const LowGrowth: Story = {
  args: {
    data: mockAnalyticsStruggling.timeline,
    height: 300,
  },
};

/**
 * Larger chart for detailed view
 */
export const LargeChart: Story = {
  args: {
    data: mockAnalyticsHighPerformance.timeline,
    height: 500,
  },
};

/**
 * Compact chart for dashboard widget
 */
export const Compact: Story = {
  args: {
    data: mockAnalyticsHighPerformance.timeline.slice(0, 7),
    height: 200,
  },
};
