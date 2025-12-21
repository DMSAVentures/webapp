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
// Re-export types for convenience
// ============================================================================
export type {
	AccountUser,
	Analytics,
	Campaign,
	CampaignSettings,
	CampaignStats,
	EmailCampaign,
	EmailTemplate,
	FormBehavior,
	FormConfig,
	FormDesign,
	FormField,
	Integration,
	Leaderboard,
	LeaderboardEntry,
	Referral,
	Reward,
	RewardEarned,
	TeamMember,
	WaitlistUser,
	Webhook,
} from "../types/common.types";
// ============================================================================
// Analytics-related exports
// ============================================================================
export {
	// Helper functions
	getMockAnalyticsByCampaign,
	mockAnalyticsData,
	mockAnalyticsEarlyStage,
	// Mock data
	mockAnalyticsHighPerformance,
	mockAnalyticsMediumPerformance,
	mockAnalyticsStruggling,
	mockAnalyticsViral,
	mockComparisonData,
	mockConversionFunnelData,
	mockDeviceData,
	mockGeographicData,
	mockGrowthChartData,
	mockReferralSourcesData,
	mockTrafficSourcesData,
} from "./analytics.mock";
// ============================================================================
// Campaign-related exports
// ============================================================================
export {
	// Helper functions
	getMockCampaignById,
	getMockCampaignsByUserId,
	mockCampaignDetail,
	mockCampaignSettings,
	mockCampaignStats,
	mockCampaigns,
	mockCampaignsByStatus,
	// Mock data
	mockUsers,
} from "./campaigns.mock";
// ============================================================================
// Email-related exports
// ============================================================================
export {
	getMockEmailCampaignById,
	getMockEmailCampaignsByCampaign,
	getMockEmailCampaignsByStatus,
	// Helper functions
	getMockEmailTemplateById,
	getMockEmailTemplatesByCampaign,
	getMockEmailTemplatesByType,
	mockEmailCampaignStatsAggregated,
	mockEmailCampaigns,
	// Mock data
	mockEmailTemplates,
} from "./emails.mock";
// ============================================================================
// Form Builder-related exports
// ============================================================================
export {
	getMockFormConfigByCampaign,
	// Helper functions
	getMockFormConfigById,
	getMockFormsByLayout,
	mockCustomCss,
	mockFieldTemplates,
	mockFormBehaviors,
	mockFormConfigs,
	mockFormDesigns,
	// Mock data
	mockFormFields,
} from "./forms.mock";
// ============================================================================
// Referral & Leaderboard-related exports
// ============================================================================
export {
	getMockLeaderboard,
	getMockLeaderboardEntry,
	// Helper functions
	getMockReferralById,
	getMockReferralsByCampaign,
	getMockReferralsByReferrer,
	getMockReferralsBySource,
	getMockReferralsByStatus as getMockReferralsByStatusHelper,
	getMockTopReferrersLeaderboard,
	mockLeaderboardEntries,
	mockLeaderboards,
	// Mock data
	mockReferrals,
	mockReferralsBySource,
	mockReferralsByStatus,
} from "./referrals.mock";

// ============================================================================
// Reward-related exports
// ============================================================================
export {
	// Helper functions
	getMockRewardById,
	getMockRewardEarnedById,
	getMockRewardsByCampaign,
	getMockRewardsByStatus,
	getMockRewardsByTier,
	getMockRewardsByType,
	getMockRewardsEarnedByReward,
	getMockRewardsEarnedByStatus,
	getMockRewardsEarnedByUser,
	// Mock data
	mockRewards,
	mockRewardsEarned,
	mockRewardsSortedByTier,
	mockRewardTiersOverview,
	mockUserRewardProgress,
} from "./rewards.mock";

// ============================================================================
// Team & Integration-related exports
// ============================================================================
export {
	getMockActiveTeamMembers,
	getMockActiveWebhooks,
	getMockConnectedIntegrations,
	// Helper functions - Integrations
	getMockIntegrationById,
	getMockIntegrationsByStatus,
	getMockIntegrationsByType,
	getMockPendingInvitations,
	// Helper functions - Team
	getMockTeamMemberById,
	getMockTeamMembersByRole,
	// Helper functions - Webhooks
	getMockWebhookById,
	getMockWebhooksByCampaign,
	getMockWebhooksByStatus,
	mockIntegrationCategories,
	mockIntegrations,
	mockTeamActivityLogs,
	// Mock data
	mockTeamMembers,
	mockWebhookDeliveryLogs,
	mockWebhooks,
} from "./team-integrations.mock";
// ============================================================================
// Waitlist User-related exports
// ============================================================================
export {
	getMockTopReferrers,
	// Helper functions
	getMockUserById,
	getMockUsersByCampaign,
	getMockUsersByStatus,
	mockUsersBySource,
	mockUsersByStatus,
	// Mock data
	mockWaitlistUsers,
} from "./users.mock";
