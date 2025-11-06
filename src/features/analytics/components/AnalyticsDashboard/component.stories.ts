import type { Meta, StoryObj } from '@storybook/react';
import { AnalyticsDashboard } from './component';
import type { Analytics } from '@/types/common.types';

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

// Sample analytics data
const sampleAnalytics: Analytics = {
  campaignId: 'campaign-123',
  dateRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  },
  overview: {
    totalSignups: 5234,
    todaySignups: 127,
    verificationRate: 78.5,
    referralRate: 45.2,
    viralCoefficient: 1.2,
    avgReferralsPerUser: 2.4,
  },
  funnel: {
    impressions: 50000,
    started: 25000,
    submitted: 18750,
    verified: 14063,
    referred: 7031,
  },
  trafficSources: [
    { source: 'Direct', count: 1570, percentage: 30.0 },
    { source: 'Google', count: 1465, percentage: 28.0 },
    { source: 'Facebook', count: 1047, percentage: 20.0 },
    { source: 'Twitter', count: 628, percentage: 12.0 },
    { source: 'LinkedIn', count: 314, percentage: 6.0 },
    { source: 'Other', count: 210, percentage: 4.0 },
  ],
  referralSources: [
    { platform: 'Twitter', clicks: 1234, conversions: 567, conversionRate: 45.9 },
    { platform: 'Facebook', clicks: 2345, conversions: 890, conversionRate: 37.9 },
    { platform: 'Email', clicks: 987, conversions: 654, conversionRate: 66.3 },
  ],
  geographic: [
    { country: 'United States', count: 2093, percentage: 40.0 },
    { country: 'United Kingdom', count: 1047, percentage: 20.0 },
    { country: 'Canada', count: 785, percentage: 15.0 },
    { country: 'Germany', count: 523, percentage: 10.0 },
    { country: 'Other', count: 786, percentage: 15.0 },
  ],
  devices: [
    { type: 'mobile', count: 3140, percentage: 60.0 },
    { type: 'desktop', count: 1570, percentage: 30.0 },
    { type: 'tablet', count: 524, percentage: 10.0 },
  ],
  timeline: [
    { date: '2024-01-01', signups: 145, referrals: 52, verifications: 114 },
    { date: '2024-01-08', signups: 189, referrals: 78, verifications: 151 },
    { date: '2024-01-15', signups: 234, referrals: 102, verifications: 187 },
    { date: '2024-01-22', signups: 312, referrals: 145, verifications: 249 },
    { date: '2024-01-29', signups: 398, referrals: 198, verifications: 318 },
  ],
};

const viralCampaign: Analytics = {
  ...sampleAnalytics,
  overview: {
    totalSignups: 12567,
    todaySignups: 523,
    verificationRate: 85.2,
    referralRate: 68.5,
    viralCoefficient: 2.3,
    avgReferralsPerUser: 4.8,
  },
  timeline: [
    { date: '2024-01-01', signups: 234, referrals: 89, verifications: 198 },
    { date: '2024-01-08', signups: 456, referrals: 234, verifications: 389 },
    { date: '2024-01-15', signups: 892, referrals: 534, verifications: 759 },
    { date: '2024-01-22', signups: 1567, referrals: 1123, verifications: 1334 },
    { date: '2024-01-29', signups: 2345, referrals: 1987, verifications: 1993 },
  ],
};

const earlyCampaign: Analytics = {
  ...sampleAnalytics,
  overview: {
    totalSignups: 127,
    todaySignups: 12,
    verificationRate: 45.3,
    referralRate: 23.6,
    viralCoefficient: 0.4,
    avgReferralsPerUser: 0.8,
  },
  funnel: {
    impressions: 5000,
    started: 1250,
    submitted: 625,
    verified: 313,
    referred: 94,
  },
  trafficSources: [
    { source: 'Direct', count: 64, percentage: 50.4 },
    { source: 'Google', count: 38, percentage: 29.9 },
    { source: 'Facebook', count: 25, percentage: 19.7 },
  ],
  timeline: [
    { date: '2024-01-01', signups: 12, referrals: 2, verifications: 5 },
    { date: '2024-01-08', signups: 18, referrals: 4, verifications: 8 },
    { date: '2024-01-15', signups: 23, referrals: 7, verifications: 10 },
    { date: '2024-01-22', signups: 34, referrals: 12, verifications: 15 },
    { date: '2024-01-29', signups: 40, referrals: 15, verifications: 18 },
  ],
};

/**
 * Default analytics dashboard with typical campaign data
 */
export const Default: Story = {
  args: {
    campaignId: 'campaign-123',
    analytics: sampleAnalytics,
    dateRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31'),
    },
  },
};

/**
 * Viral campaign with high K-factor
 */
export const ViralCampaign: Story = {
  args: {
    campaignId: 'campaign-viral',
    analytics: viralCampaign,
    dateRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31'),
    },
  },
};

/**
 * Early stage campaign with low numbers
 */
export const EarlyCampaign: Story = {
  args: {
    campaignId: 'campaign-early',
    analytics: earlyCampaign,
    dateRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31'),
    },
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    campaignId: 'campaign-loading',
    analytics: sampleAnalytics,
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
    campaignId: 'campaign-export',
    analytics: sampleAnalytics,
    dateRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31'),
    },
    onExport: () => {
      alert('Exporting analytics data...');
    },
  },
};
