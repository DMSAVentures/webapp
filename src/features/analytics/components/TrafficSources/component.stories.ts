import type { Meta, StoryObj } from '@storybook/react';
import { TrafficSources } from './component';
import {
  mockAnalyticsHighPerformance,
  mockAnalyticsMediumPerformance,
  mockAnalyticsViral,
  mockAnalyticsStruggling,
} from '@/mocks';

const meta = {
  title: 'Features/Analytics/TrafficSources',
  component: TrafficSources,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    chartType: {
      control: 'select',
      options: ['pie', 'bar'],
      description: 'Type of chart to display',
    },
  },
} satisfies Meta<typeof TrafficSources>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default pie chart view with high-performance campaign traffic
 */
export const Default: Story = {
  args: {
    data: mockAnalyticsHighPerformance.trafficSources,
    chartType: 'pie',
  },
};

/**
 * Bar chart view
 */
export const BarChart: Story = {
  args: {
    data: mockAnalyticsHighPerformance.trafficSources,
    chartType: 'bar',
  },
};

/**
 * Viral campaign with referral-dominated traffic
 */
export const ReferralDominant: Story = {
  args: {
    data: mockAnalyticsViral.trafficSources,
    chartType: 'pie',
  },
};

/**
 * Medium performance campaign with social media focus
 */
export const SocialMediaFocus: Story = {
  args: {
    data: mockAnalyticsMediumPerformance.trafficSources,
    chartType: 'pie',
  },
};

/**
 * Early stage campaign with limited sources
 */
export const LimitedSources: Story = {
  args: {
    data: mockAnalyticsStruggling.trafficSources,
    chartType: 'pie',
  },
};

/**
 * Viral campaign bar chart with many sources
 */
export const ManySourcesBar: Story = {
  args: {
    data: mockAnalyticsViral.trafficSources,
    chartType: 'bar',
  },
};
