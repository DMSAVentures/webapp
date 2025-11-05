/**
 * Mock Data Library Index
 *
 * Centralized export of all mock data for Storybook stories and testing.
 * Based on the technical design document for the Viral Waitlist & Referral Marketing Platform.
 *
 * Usage in Storybook:
 * ```tsx
 * import { mockCampaigns, mockWaitlistUsers } from '@/mocks';
 *
 * export const Default: Story = {
 *   args: {
 *     campaign: mockCampaigns[0],
 *     users: mockWaitlistUsers.slice(0, 10),
 *   }
 * };
 * ```
 */

// ============================================================================
// Campaign-related exports
// ============================================================================
export {
  // Mock data
  mockUsers,
  mockCampaignSettings,
  mockCampaignStats,
  mockCampaigns,
  mockCampaignsByStatus,
  mockCampaignDetail,
  // Helper functions
  getMockCampaignById,
  getMockCampaignsByUserId,
} from './campaigns.mock';

// ============================================================================
// Waitlist User-related exports
// ============================================================================
export {
  // Mock data
  mockWaitlistUsers,
  mockUsersByStatus,
  mockUsersByDevice,
  mockUsersBySource,
  // Helper functions
  getMockUserById,
  getMockUsersByCampaign,
  getMockUsersByStatus,
  getMockTopReferrers,
} from './users.mock';

// ============================================================================
// Referral & Leaderboard-related exports
// ============================================================================
export {
  // Mock data
  mockReferrals,
  mockReferralsBySource,
  mockReferralsByStatus,
  mockLeaderboardEntries,
  mockLeaderboards,
  // Helper functions
  getMockReferralById,
  getMockReferralsByCampaign,
  getMockReferralsByReferrer,
  getMockReferralsByStatus as getMockReferralsByStatusHelper,
  getMockReferralsBySource,
  getMockLeaderboard,
  getMockLeaderboardEntry,
  getMockTopReferrersLeaderboard,
} from './referrals.mock';

// ============================================================================
// Form Builder-related exports
// ============================================================================
export {
  // Mock data
  mockFormFields,
  mockFormDesigns,
  mockFormBehaviors,
  mockFormConfigs,
  mockFieldTemplates,
  mockCustomCss,
  // Helper functions
  getMockFormConfigById,
  getMockFormConfigByCampaign,
  getMockFormsByLayout,
} from './forms.mock';

// ============================================================================
// Analytics-related exports
// ============================================================================
export {
  // Mock data
  mockAnalyticsHighPerformance,
  mockAnalyticsMediumPerformance,
  mockAnalyticsEarlyStage,
  mockAnalyticsViral,
  mockAnalyticsStruggling,
  mockAnalyticsData,
  mockGrowthChartData,
  mockConversionFunnelData,
  mockTrafficSourcesData,
  mockReferralSourcesData,
  mockGeographicData,
  mockDeviceData,
  mockComparisonData,
  // Helper functions
  getMockAnalyticsByCampaign,
} from './analytics.mock';

// ============================================================================
// Email-related exports
// ============================================================================
export {
  // Mock data
  mockEmailTemplates,
  mockEmailCampaigns,
  mockEmailCampaignStatsAggregated,
  // Helper functions
  getMockEmailTemplateById,
  getMockEmailTemplatesByCampaign,
  getMockEmailTemplatesByType,
  getMockEmailCampaignById,
  getMockEmailCampaignsByCampaign,
  getMockEmailCampaignsByStatus,
} from './emails.mock';

// ============================================================================
// Reward-related exports
// ============================================================================
export {
  // Mock data
  mockRewards,
  mockRewardsEarned,
  // Helper functions
  getMockRewardById,
  getMockRewardsByCampaign,
  getMockRewardsByStatus,
  getMockRewardsByTier,
  getMockRewardsByType,
  getMockRewardEarnedById,
  getMockRewardsEarnedByUser,
  getMockRewardsEarnedByReward,
  getMockRewardsEarnedByStatus,
  mockRewardsSortedByTier,
  mockRewardTiersOverview,
  mockUserRewardProgress,
} from './rewards.mock';

// ============================================================================
// Team & Integration-related exports
// ============================================================================
export {
  // Mock data
  mockTeamMembers,
  mockIntegrations,
  mockWebhooks,
  mockWebhookDeliveryLogs,
  mockIntegrationCategories,
  mockTeamActivityLogs,
  // Helper functions - Team
  getMockTeamMemberById,
  getMockTeamMembersByRole,
  getMockActiveTeamMembers,
  getMockPendingInvitations,
  // Helper functions - Integrations
  getMockIntegrationById,
  getMockIntegrationsByType,
  getMockIntegrationsByStatus,
  getMockConnectedIntegrations,
  // Helper functions - Webhooks
  getMockWebhookById,
  getMockWebhooksByCampaign,
  getMockWebhooksByStatus,
  getMockActiveWebhooks,
} from './team-integrations.mock';

// ============================================================================
// Re-export types for convenience
// ============================================================================
export type {
  User,
  Campaign,
  CampaignSettings,
  CampaignStats,
  WaitlistUser,
  Referral,
  FormConfig,
  FormField,
  FormDesign,
  FormBehavior,
  Reward,
  RewardEarned,
  EmailTemplate,
  EmailCampaign,
  Analytics,
  Leaderboard,
  LeaderboardEntry,
  TeamMember,
  Integration,
  Webhook,
} from '../types/common.types';
