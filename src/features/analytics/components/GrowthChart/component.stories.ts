import type { Meta, StoryObj } from '@storybook/react';
import { GrowthChart } from './component';

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

// Sample data
const sampleData = [
  { date: '2024-01-01', signups: 45, referrals: 12 },
  { date: '2024-01-02', signups: 52, referrals: 18 },
  { date: '2024-01-03', signups: 61, referrals: 24 },
  { date: '2024-01-04', signups: 58, referrals: 22 },
  { date: '2024-01-05', signups: 73, referrals: 31 },
  { date: '2024-01-06', signups: 89, referrals: 42 },
  { date: '2024-01-07', signups: 102, referrals: 55 },
];

const weeklyData = [
  { date: '2024-01-01', signups: 234, referrals: 89 },
  { date: '2024-01-08', signups: 312, referrals: 124 },
  { date: '2024-01-15', signups: 428, referrals: 187 },
  { date: '2024-01-22', signups: 567, referrals: 245 },
  { date: '2024-01-29', signups: 691, referrals: 312 },
  { date: '2024-02-05', signups: 823, referrals: 401 },
  { date: '2024-02-12', signups: 945, referrals: 478 },
];

const flatData = [
  { date: '2024-01-01', signups: 50, referrals: 10 },
  { date: '2024-01-02', signups: 52, referrals: 11 },
  { date: '2024-01-03', signups: 51, referrals: 10 },
  { date: '2024-01-04', signups: 53, referrals: 12 },
  { date: '2024-01-05', signups: 52, referrals: 11 },
  { date: '2024-01-06', signups: 54, referrals: 13 },
  { date: '2024-01-07', signups: 53, referrals: 12 },
];

/**
 * Default growth chart with 7 days of data
 */
export const Default: Story = {
  args: {
    data: sampleData,
    height: 300,
  },
};

/**
 * Growth chart with strong upward trend
 */
export const StrongGrowth: Story = {
  args: {
    data: sampleData,
    height: 350,
  },
};

/**
 * Weekly data over 2 months
 */
export const WeeklyData: Story = {
  args: {
    data: weeklyData,
    height: 400,
  },
};

/**
 * Flat growth with minimal changes
 */
export const FlatGrowth: Story = {
  args: {
    data: flatData,
    height: 300,
  },
};

/**
 * Larger chart for detailed view
 */
export const LargeChart: Story = {
  args: {
    data: weeklyData,
    height: 500,
  },
};

/**
 * Compact chart for dashboard widget
 */
export const Compact: Story = {
  args: {
    data: sampleData,
    height: 200,
  },
};
