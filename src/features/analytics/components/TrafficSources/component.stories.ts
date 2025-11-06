import type { Meta, StoryObj } from '@storybook/react';
import { TrafficSources } from './component';

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

// Sample data
const defaultSources = [
  { source: 'Direct', count: 3542, percentage: 35.42 },
  { source: 'Google', count: 2845, percentage: 28.45 },
  { source: 'Facebook', count: 1523, percentage: 15.23 },
  { source: 'Twitter', count: 987, percentage: 9.87 },
  { source: 'LinkedIn', count: 654, percentage: 6.54 },
  { source: 'Other', count: 449, percentage: 4.49 },
];

const socialDominant = [
  { source: 'Facebook', count: 4523, percentage: 45.23 },
  { source: 'Instagram', count: 2345, percentage: 23.45 },
  { source: 'Twitter', count: 1567, percentage: 15.67 },
  { source: 'LinkedIn', count: 890, percentage: 8.9 },
  { source: 'TikTok', count: 456, percentage: 4.56 },
  { source: 'Other', count: 219, percentage: 2.19 },
];

const organicDominant = [
  { source: 'Google', count: 5678, percentage: 56.78 },
  { source: 'Direct', count: 2345, percentage: 23.45 },
  { source: 'Bing', count: 890, percentage: 8.9 },
  { source: 'Facebook', count: 567, percentage: 5.67 },
  { source: 'Other', count: 520, percentage: 5.2 },
];

const twoSources = [
  { source: 'Direct', count: 7500, percentage: 75.0 },
  { source: 'Referral', count: 2500, percentage: 25.0 },
];

const manySources = [
  { source: 'Google', count: 2345, percentage: 23.45 },
  { source: 'Facebook', count: 1890, percentage: 18.9 },
  { source: 'Twitter', count: 1234, percentage: 12.34 },
  { source: 'LinkedIn', count: 987, percentage: 9.87 },
  { source: 'Instagram', count: 876, percentage: 8.76 },
  { source: 'YouTube', count: 654, percentage: 6.54 },
  { source: 'Reddit', count: 543, percentage: 5.43 },
  { source: 'Other', count: 1471, percentage: 14.71 },
];

/**
 * Default pie chart view with typical traffic distribution
 */
export const Default: Story = {
  args: {
    data: defaultSources,
    chartType: 'pie',
  },
};

/**
 * Bar chart view
 */
export const BarChart: Story = {
  args: {
    data: defaultSources,
    chartType: 'bar',
  },
};

/**
 * Social media dominated traffic
 */
export const SocialDominant: Story = {
  args: {
    data: socialDominant,
    chartType: 'pie',
  },
};

/**
 * Organic search dominated traffic
 */
export const OrganicDominant: Story = {
  args: {
    data: organicDominant,
    chartType: 'pie',
  },
};

/**
 * Only two traffic sources
 */
export const TwoSources: Story = {
  args: {
    data: twoSources,
    chartType: 'pie',
  },
};

/**
 * Many traffic sources (8+)
 */
export const ManySources: Story = {
  args: {
    data: manySources,
    chartType: 'pie',
  },
};

/**
 * Bar chart with many sources
 */
export const ManySourcesBar: Story = {
  args: {
    data: manySources,
    chartType: 'bar',
  },
};
