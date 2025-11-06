import type { Meta, StoryObj } from '@storybook/react';
import { AnalyticsDashboard } from './component';
import {
  mockAnalyticsHighPerformance,
  mockAnalyticsMediumPerformance,
  mockAnalyticsViral,
  mockAnalyticsEarlyStage,
  mockAnalyticsStruggling,
} from '@/mocks';

const meta = {
  title: 'Features/Analytics/AnalyticsDashboard',
  component: AnalyticsDashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
  },
} satisfies Meta<typeof AnalyticsDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default analytics dashboard with high-performance campaign data
 */
export const Default: Story = {
  args: {
    campaignId: mockAnalyticsHighPerformance.campaignId,
    analytics: mockAnalyticsHighPerformance,
    dateRange: mockAnalyticsHighPerformance.dateRange,
  },
};

/**
 * Viral campaign with exceptional K-factor and high growth
 */
export const ViralCampaign: Story = {
  args: {
    campaignId: mockAnalyticsViral.campaignId,
    analytics: mockAnalyticsViral,
    dateRange: mockAnalyticsViral.dateRange,
  },
};

/**
 * Medium performance campaign with moderate growth
 */
export const MediumPerformance: Story = {
  args: {
    campaignId: mockAnalyticsMediumPerformance.campaignId,
    analytics: mockAnalyticsMediumPerformance,
    dateRange: mockAnalyticsMediumPerformance.dateRange,
  },
};

/**
 * Early stage campaign with initial traction
 */
export const EarlyCampaign: Story = {
  args: {
    campaignId: mockAnalyticsEarlyStage.campaignId,
    analytics: mockAnalyticsEarlyStage,
    dateRange: mockAnalyticsEarlyStage.dateRange,
  },
};

/**
 * Struggling campaign with low engagement
 */
export const StrugglingCampaign: Story = {
  args: {
    campaignId: mockAnalyticsStruggling.campaignId,
    analytics: mockAnalyticsStruggling,
    dateRange: mockAnalyticsStruggling.dateRange,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    campaignId: mockAnalyticsHighPerformance.campaignId,
    analytics: mockAnalyticsHighPerformance,
    loading: true,
  },
};

/**
 * Empty state (no analytics data)
 */
export const EmptyState: Story = {
  args: {
    campaignId: 'campaign-empty',
    analytics: undefined,
  },
};

/**
 * With export callback
 */
export const WithExport: Story = {
  args: {
    campaignId: mockAnalyticsHighPerformance.campaignId,
    analytics: mockAnalyticsHighPerformance,
    dateRange: mockAnalyticsHighPerformance.dateRange,
    onExport: () => {
      alert('Exporting analytics data...');
    },
  },
};
