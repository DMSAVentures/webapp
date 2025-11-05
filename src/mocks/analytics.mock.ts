/**
 * Mock data for Analytics components
 * Used for Storybook stories and testing
 */

import type { Analytics } from '../types/common.types';

// Helper function to generate dates for the last N days
const generateDateRange = (days: number): Date[] => {
  const dates: Date[] = [];
  const today = new Date('2025-11-05T00:00:00Z');

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  return dates;
};

// Helper function to format date as string
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate timeline data for various scenarios
const generateTimeline = (
  days: number,
  signupsRange: [number, number],
  referralsMultiplier: number = 0.6,
  verificationsMultiplier: number = 0.8
) => {
  const dates = generateDateRange(days);
  return dates.map((date) => {
    const signups = Math.floor(
      Math.random() * (signupsRange[1] - signupsRange[0]) + signupsRange[0]
    );
    const referrals = Math.floor(signups * referralsMultiplier);
    const verifications = Math.floor(signups * verificationsMultiplier);

    return {
      date: formatDate(date),
      signups,
      referrals,
      verifications,
    };
  });
};

// Mock Analytics Data - High Performance Campaign
export const mockAnalyticsHighPerformance: Analytics = {
  campaignId: 'campaign-1',
  dateRange: {
    start: new Date('2025-10-06T00:00:00Z'),
    end: new Date('2025-11-05T23:59:59Z'),
  },
  overview: {
    totalSignups: 2847,
    todaySignups: 142,
    verificationRate: 84.2,
    referralRate: 68.5,
    viralCoefficient: 2.8,
    avgReferralsPerUser: 3.2,
  },
  funnel: {
    impressions: 125430,
    started: 18745,
    submitted: 14892,
    verified: 12547,
    referred: 8932,
  },
  trafficSources: [
    { source: 'Twitter', count: 8245, percentage: 28.9 },
    { source: 'Direct', count: 6892, percentage: 24.2 },
    { source: 'Referral', count: 5124, percentage: 18.0 },
    { source: 'LinkedIn', count: 4231, percentage: 14.9 },
    { source: 'Product Hunt', count: 2145, percentage: 7.5 },
    { source: 'Google', count: 1210, percentage: 4.2 },
    { source: 'Facebook', count: 656, percentage: 2.3 },
  ],
  referralSources: [
    { platform: 'Twitter', clicks: 15420, conversions: 8245, conversionRate: 53.5 },
    { platform: 'Email', clicks: 9845, conversions: 4892, conversionRate: 49.7 },
    { platform: 'WhatsApp', clicks: 7234, conversions: 4123, conversionRate: 57.0 },
    { platform: 'LinkedIn', clicks: 6123, conversions: 3456, conversionRate: 56.4 },
    { platform: 'Facebook', clicks: 4567, conversions: 2134, conversionRate: 46.7 },
    { platform: 'Copy Link', clicks: 12456, conversions: 5678, conversionRate: 45.6 },
    { platform: 'Telegram', clicks: 3245, conversions: 1892, conversionRate: 58.3 },
  ],
  geographic: [
    { country: 'United States', count: 1243, percentage: 43.7 },
    { country: 'United Kingdom', count: 456, percentage: 16.0 },
    { country: 'Canada', count: 342, percentage: 12.0 },
    { country: 'India', count: 287, percentage: 10.1 },
    { country: 'Germany', count: 198, percentage: 7.0 },
    { country: 'Australia', count: 145, percentage: 5.1 },
    { country: 'France', count: 89, percentage: 3.1 },
    { country: 'Spain', count: 87, percentage: 3.0 },
  ],
  devices: [
    { type: 'desktop', count: 1623, percentage: 57.0 },
    { type: 'mobile', count: 1082, percentage: 38.0 },
    { type: 'tablet', count: 142, percentage: 5.0 },
  ],
  timeline: generateTimeline(30, [50, 150], 0.65, 0.85),
};

// Mock Analytics Data - Medium Performance Campaign
export const mockAnalyticsMediumPerformance: Analytics = {
  campaignId: 'campaign-2',
  dateRange: {
    start: new Date('2025-10-06T00:00:00Z'),
    end: new Date('2025-11-05T23:59:59Z'),
  },
  overview: {
    totalSignups: 892,
    todaySignups: 23,
    verificationRate: 76.8,
    referralRate: 54.2,
    viralCoefficient: 1.5,
    avgReferralsPerUser: 2.1,
  },
  funnel: {
    impressions: 45230,
    started: 5847,
    submitted: 4234,
    verified: 3421,
    referred: 1843,
  },
  trafficSources: [
    { source: 'Instagram', count: 312, percentage: 35.0 },
    { source: 'Direct', count: 223, percentage: 25.0 },
    { source: 'Referral', count: 178, percentage: 20.0 },
    { source: 'Facebook', count: 89, percentage: 10.0 },
    { source: 'Twitter', count: 62, percentage: 7.0 },
    { source: 'Google', count: 28, percentage: 3.0 },
  ],
  referralSources: [
    { platform: 'Instagram', clicks: 4523, conversions: 2341, conversionRate: 51.7 },
    { platform: 'WhatsApp', clicks: 3245, conversions: 1892, conversionRate: 58.3 },
    { platform: 'Facebook', clicks: 2845, conversions: 1234, conversionRate: 43.4 },
    { platform: 'Copy Link', clicks: 5678, conversions: 2456, conversionRate: 43.3 },
    { platform: 'Email', clicks: 2134, conversions: 987, conversionRate: 46.3 },
    { platform: 'Twitter', clicks: 1892, conversions: 823, conversionRate: 43.5 },
  ],
  geographic: [
    { country: 'United States', count: 456, percentage: 51.1 },
    { country: 'United Kingdom', count: 178, percentage: 20.0 },
    { country: 'Canada', count: 89, percentage: 10.0 },
    { country: 'Australia', count: 67, percentage: 7.5 },
    { country: 'Germany', count: 45, percentage: 5.0 },
    { country: 'France', count: 34, percentage: 3.8 },
    { country: 'Spain', count: 23, percentage: 2.6 },
  ],
  devices: [
    { type: 'mobile', count: 589, percentage: 66.0 },
    { type: 'desktop', count: 268, percentage: 30.0 },
    { type: 'tablet', count: 35, percentage: 4.0 },
  ],
  timeline: generateTimeline(30, [15, 45], 0.55, 0.78),
};

// Mock Analytics Data - Early Stage Campaign
export const mockAnalyticsEarlyStage: Analytics = {
  campaignId: 'campaign-3',
  dateRange: {
    start: new Date('2025-10-15T00:00:00Z'),
    end: new Date('2025-11-05T23:59:59Z'),
  },
  overview: {
    totalSignups: 189,
    todaySignups: 12,
    verificationRate: 80.4,
    referralRate: 61.3,
    viralCoefficient: 1.8,
    avgReferralsPerUser: 1.6,
  },
  funnel: {
    impressions: 8934,
    started: 1245,
    submitted: 892,
    verified: 734,
    referred: 445,
  },
  trafficSources: [
    { source: 'Direct', count: 67, percentage: 35.4 },
    { source: 'Product Hunt', count: 45, percentage: 23.8 },
    { source: 'Twitter', count: 34, percentage: 18.0 },
    { source: 'Referral', count: 23, percentage: 12.2 },
    { source: 'LinkedIn', count: 15, percentage: 7.9 },
    { source: 'Google', count: 5, percentage: 2.7 },
  ],
  referralSources: [
    { platform: 'Twitter', clicks: 1234, conversions: 678, conversionRate: 54.9 },
    { platform: 'Copy Link', clicks: 2345, conversions: 1123, conversionRate: 47.9 },
    { platform: 'Email', clicks: 987, conversions: 456, conversionRate: 46.2 },
    { platform: 'WhatsApp', clicks: 678, conversions: 345, conversionRate: 50.9 },
    { platform: 'LinkedIn', clicks: 567, conversions: 234, conversionRate: 41.3 },
    { platform: 'Facebook', clicks: 456, conversions: 178, conversionRate: 39.0 },
  ],
  geographic: [
    { country: 'United States', count: 89, percentage: 47.1 },
    { country: 'United Kingdom', count: 34, percentage: 18.0 },
    { country: 'Canada', count: 23, percentage: 12.2 },
    { country: 'India', count: 18, percentage: 9.5 },
    { country: 'Germany', count: 12, percentage: 6.3 },
    { country: 'Australia', count: 9, percentage: 4.8 },
    { country: 'France', count: 4, percentage: 2.1 },
  ],
  devices: [
    { type: 'desktop', count: 123, percentage: 65.1 },
    { type: 'mobile', count: 56, percentage: 29.6 },
    { type: 'tablet', count: 10, percentage: 5.3 },
  ],
  timeline: generateTimeline(21, [3, 15], 0.6, 0.8),
};

// Mock Analytics Data - Viral Campaign
export const mockAnalyticsViral: Analytics = {
  campaignId: 'campaign-4',
  dateRange: {
    start: new Date('2024-08-10T00:00:00Z'),
    end: new Date('2025-11-05T23:59:59Z'),
  },
  overview: {
    totalSignups: 45782,
    todaySignups: 892,
    verificationRate: 92.0,
    referralRate: 84.4,
    viralCoefficient: 3.5,
    avgReferralsPerUser: 4.7,
  },
  funnel: {
    impressions: 1245789,
    started: 287456,
    submitted: 234567,
    verified: 215890,
    referred: 182345,
  },
  trafficSources: [
    { source: 'Referral', count: 18234, percentage: 39.8 },
    { source: 'Product Hunt', count: 9123, percentage: 19.9 },
    { source: 'Twitter', count: 7892, percentage: 17.2 },
    { source: 'Direct', count: 4567, percentage: 10.0 },
    { source: 'LinkedIn', count: 3234, percentage: 7.1 },
    { source: 'Hacker News', count: 1567, percentage: 3.4 },
    { source: 'Reddit', count: 1165, percentage: 2.6 },
  ],
  referralSources: [
    { platform: 'Twitter', clicks: 234567, conversions: 142345, conversionRate: 60.7 },
    { platform: 'Copy Link', clicks: 198765, conversions: 112456, conversionRate: 56.6 },
    { platform: 'Email', clicks: 145678, conversions: 87234, conversionRate: 59.9 },
    { platform: 'WhatsApp', clicks: 123456, conversions: 78123, conversionRate: 63.3 },
    { platform: 'LinkedIn', clicks: 98765, conversions: 54321, conversionRate: 55.0 },
    { platform: 'Facebook', clicks: 87654, conversions: 43278, conversionRate: 49.4 },
    { platform: 'Telegram', clicks: 65432, conversions: 38765, conversionRate: 59.3 },
  ],
  geographic: [
    { country: 'United States', count: 18312, percentage: 40.0 },
    { country: 'India', count: 9156, percentage: 20.0 },
    { country: 'United Kingdom', count: 6867, percentage: 15.0 },
    { country: 'Canada', count: 4578, percentage: 10.0 },
    { country: 'Germany', count: 2289, percentage: 5.0 },
    { country: 'Australia', count: 1831, percentage: 4.0 },
    { country: 'France', count: 1374, percentage: 3.0 },
    { country: 'Singapore', count: 1374, percentage: 3.0 },
  ],
  devices: [
    { type: 'desktop', count: 27469, percentage: 60.0 },
    { type: 'mobile', count: 15943, percentage: 34.8 },
    { type: 'tablet', count: 2370, percentage: 5.2 },
  ],
  timeline: generateTimeline(90, [300, 700], 0.85, 0.92),
};

// Mock Analytics Data - Struggling Campaign
export const mockAnalyticsStruggling: Analytics = {
  campaignId: 'campaign-5',
  dateRange: {
    start: new Date('2025-10-06T00:00:00Z'),
    end: new Date('2025-11-05T23:59:59Z'),
  },
  overview: {
    totalSignups: 67,
    todaySignups: 2,
    verificationRate: 50.7,
    referralRate: 17.9,
    viralCoefficient: 0.4,
    avgReferralsPerUser: 0.3,
  },
  funnel: {
    impressions: 12456,
    started: 892,
    submitted: 456,
    verified: 234,
    referred: 42,
  },
  trafficSources: [
    { source: 'Direct', count: 28, percentage: 41.8 },
    { source: 'Google', count: 18, percentage: 26.9 },
    { source: 'Facebook', count: 12, percentage: 17.9 },
    { source: 'Twitter', count: 6, percentage: 9.0 },
    { source: 'LinkedIn', count: 3, percentage: 4.4 },
  ],
  referralSources: [
    { platform: 'Copy Link', clicks: 456, conversions: 178, conversionRate: 39.0 },
    { platform: 'Email', clicks: 234, conversions: 89, conversionRate: 38.0 },
    { platform: 'Facebook', clicks: 189, conversions: 67, conversionRate: 35.4 },
    { platform: 'Twitter', clicks: 123, conversions: 34, conversionRate: 27.6 },
    { platform: 'WhatsApp', clicks: 89, conversions: 28, conversionRate: 31.5 },
  ],
  geographic: [
    { country: 'United States', count: 34, percentage: 50.7 },
    { country: 'United Kingdom', count: 12, percentage: 17.9 },
    { country: 'Canada', count: 9, percentage: 13.4 },
    { country: 'India', count: 6, percentage: 9.0 },
    { country: 'Germany', count: 4, percentage: 6.0 },
    { country: 'Australia', count: 2, percentage: 3.0 },
  ],
  devices: [
    { type: 'desktop', count: 45, percentage: 67.2 },
    { type: 'mobile', count: 19, percentage: 28.4 },
    { type: 'tablet', count: 3, percentage: 4.4 },
  ],
  timeline: generateTimeline(30, [1, 5], 0.2, 0.5),
};

// Collection of all mock analytics
export const mockAnalyticsData = {
  highPerformance: mockAnalyticsHighPerformance,
  mediumPerformance: mockAnalyticsMediumPerformance,
  earlyStage: mockAnalyticsEarlyStage,
  viral: mockAnalyticsViral,
  struggling: mockAnalyticsStruggling,
};

// Helper functions
export const getMockAnalyticsByCampaign = (
  campaignId: string
): Analytics | undefined => {
  return Object.values(mockAnalyticsData).find(
    (analytics) => analytics.campaignId === campaignId
  );
};

// Mock data for specific chart components
export const mockGrowthChartData = mockAnalyticsHighPerformance.timeline;

export const mockConversionFunnelData = {
  impressions: mockAnalyticsHighPerformance.funnel.impressions,
  started: mockAnalyticsHighPerformance.funnel.started,
  submitted: mockAnalyticsHighPerformance.funnel.submitted,
  verified: mockAnalyticsHighPerformance.funnel.verified,
  referred: mockAnalyticsHighPerformance.funnel.referred,
};

export const mockTrafficSourcesData =
  mockAnalyticsHighPerformance.trafficSources;

export const mockReferralSourcesData =
  mockAnalyticsHighPerformance.referralSources;

export const mockGeographicData = mockAnalyticsHighPerformance.geographic;

export const mockDeviceData = mockAnalyticsHighPerformance.devices;

// Mock comparison data (for A/B testing or comparing periods)
export const mockComparisonData = {
  current: mockAnalyticsHighPerformance,
  previous: {
    ...mockAnalyticsHighPerformance,
    dateRange: {
      start: new Date('2025-09-06T00:00:00Z'),
      end: new Date('2025-10-05T23:59:59Z'),
    },
    overview: {
      totalSignups: 2234,
      todaySignups: 98,
      verificationRate: 81.5,
      referralRate: 64.2,
      viralCoefficient: 2.5,
      avgReferralsPerUser: 2.9,
    },
  },
};
