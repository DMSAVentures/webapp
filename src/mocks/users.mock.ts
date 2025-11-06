/**
 * Mock data for WaitlistUser-related components
 * Used for Storybook stories and testing
 */

import type { WaitlistUser } from "../types/common.types";

// Mock Waitlist Users with various states and scenarios
export const mockWaitlistUsers: WaitlistUser[] = [
	// Top performer - verified, many referrals
	{
		id: "wuser-1",
		campaignId: "campaign-1",
		email: "emma.watson@gmail.com",
		name: "Emma Watson",
		customFields: {
			company: "Tech Innovations Inc",
			role: "Product Manager",
			interests: ["productivity", "collaboration"],
		},
		status: "verified",
		position: 1,
		referralCode: "EMMA2025",
		referredBy: undefined,
		referralCount: 47,
		points: 235,
		source: "twitter",
		utmParams: {
			source: "twitter",
			medium: "social",
			campaign: "launch_announcement",
			content: "founder_tweet",
		},
		metadata: {
			ipAddress: "192.168.1.100",
			userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
			country: "United States",
			device: "desktop",
		},
		createdAt: new Date("2024-09-16T08:15:00Z"),
		verifiedAt: new Date("2024-09-16T08:20:00Z"),
		invitedAt: new Date("2024-11-01T10:00:00Z"),
	},
	// Early adopter - verified, good referrals
	{
		id: "wuser-2",
		campaignId: "campaign-1",
		email: "james.chen@outlook.com",
		name: "James Chen",
		customFields: {
			company: "StartupXYZ",
			role: "CTO",
			hearAboutUs: "Product Hunt",
		},
		status: "verified",
		position: 2,
		referralCode: "JAMES47X",
		referredBy: undefined,
		referralCount: 32,
		points: 180,
		source: "direct",
		utmParams: {},
		metadata: {
			ipAddress: "203.0.113.42",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
			country: "Canada",
			device: "desktop",
		},
		createdAt: new Date("2024-09-17T14:30:00Z"),
		verifiedAt: new Date("2024-09-17T14:35:00Z"),
		invitedAt: new Date("2024-11-01T10:00:00Z"),
	},
	// Referred user - pending verification
	{
		id: "wuser-3",
		campaignId: "campaign-1",
		email: "sophia.martinez@yahoo.com",
		name: "Sophia Martinez",
		customFields: {
			role: "Designer",
			toolsUsed: ["Figma", "Sketch"],
		},
		status: "pending",
		position: 58,
		referralCode: "SOPHIA9K2",
		referredBy: "wuser-1",
		referralCount: 3,
		points: 15,
		source: "referral",
		utmParams: {
			source: "referral",
			medium: "link",
			campaign: "viral_sharing",
		},
		metadata: {
			ipAddress: "198.51.100.78",
			userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
			country: "United States",
			device: "mobile",
		},
		createdAt: new Date("2024-09-25T11:45:00Z"),
		verifiedAt: undefined,
		invitedAt: undefined,
	},
	// Active user with moderate referrals
	{
		id: "wuser-4",
		campaignId: "campaign-1",
		email: "oliver.brown@gmail.com",
		name: "Oliver Brown",
		customFields: {
			company: "Digital Agency Co",
			employees: "50-100",
		},
		status: "active",
		position: 12,
		referralCode: "OLIVER88",
		referredBy: "wuser-2",
		referralCount: 18,
		points: 95,
		source: "referral",
		utmParams: {
			source: "referral",
			medium: "email",
			campaign: "friend_invite",
		},
		metadata: {
			ipAddress: "192.0.2.146",
			userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
			country: "United Kingdom",
			device: "desktop",
		},
		createdAt: new Date("2024-09-20T16:20:00Z"),
		verifiedAt: new Date("2024-09-20T17:05:00Z"),
		invitedAt: new Date("2024-10-15T09:30:00Z"),
	},
	// Rejected user
	{
		id: "wuser-5",
		campaignId: "campaign-1",
		email: "spam.account@tempmail.com",
		name: undefined,
		customFields: {},
		status: "rejected",
		position: 9999,
		referralCode: "SPAM123",
		referredBy: undefined,
		referralCount: 0,
		points: 0,
		source: "direct",
		utmParams: {},
		metadata: {
			ipAddress: "172.16.0.1",
			userAgent: "Python-urllib/3.8",
			country: "Unknown",
			device: "desktop",
		},
		createdAt: new Date("2024-10-05T03:22:00Z"),
		verifiedAt: undefined,
		invitedAt: undefined,
	},
	// Mid-tier user from LinkedIn
	{
		id: "wuser-6",
		campaignId: "campaign-1",
		email: "isabella.garcia@linkedin.com",
		name: "Isabella Garcia",
		customFields: {
			company: "Enterprise Solutions Ltd",
			role: "Marketing Director",
			budget: "$50k-$100k",
		},
		status: "verified",
		position: 156,
		referralCode: "ISABELLA2K",
		referredBy: undefined,
		referralCount: 8,
		points: 48,
		source: "linkedin",
		utmParams: {
			source: "linkedin",
			medium: "social",
			campaign: "b2b_outreach",
			content: "sponsored_post",
		},
		metadata: {
			ipAddress: "203.0.113.95",
			userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
			country: "Spain",
			device: "desktop",
		},
		createdAt: new Date("2024-10-02T09:10:00Z"),
		verifiedAt: new Date("2024-10-02T09:25:00Z"),
		invitedAt: undefined,
	},
	// Mobile user from Facebook
	{
		id: "wuser-7",
		campaignId: "campaign-1",
		email: "liam.johnson@hotmail.com",
		name: "Liam Johnson",
		customFields: {
			age: "25-34",
			interests: ["tech", "startups", "investing"],
		},
		status: "verified",
		position: 423,
		referralCode: "LIAM99PRO",
		referredBy: "wuser-6",
		referralCount: 5,
		points: 30,
		source: "facebook",
		utmParams: {
			source: "facebook",
			medium: "social",
			campaign: "paid_ads",
			content: "video_ad_v2",
		},
		metadata: {
			ipAddress: "198.51.100.201",
			userAgent: "Mozilla/5.0 (Linux; Android 12; SM-G998B)",
			country: "Australia",
			device: "mobile",
		},
		createdAt: new Date("2024-10-08T13:42:00Z"),
		verifiedAt: new Date("2024-10-08T14:10:00Z"),
		invitedAt: undefined,
	},
	// Tablet user with no referrals yet
	{
		id: "wuser-8",
		campaignId: "campaign-1",
		email: "ava.lee@icloud.com",
		name: "Ava Lee",
		customFields: {
			devicePreference: "tablet",
			newsletter: true,
		},
		status: "verified",
		position: 1247,
		referralCode: "AVALEE777",
		referredBy: "wuser-1",
		referralCount: 0,
		points: 5,
		source: "referral",
		utmParams: {
			source: "referral",
			medium: "whatsapp",
			campaign: "viral_sharing",
		},
		metadata: {
			ipAddress: "192.0.2.88",
			userAgent: "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)",
			country: "Singapore",
			device: "tablet",
		},
		createdAt: new Date("2024-10-15T07:30:00Z"),
		verifiedAt: new Date("2024-10-15T08:05:00Z"),
		invitedAt: undefined,
	},
	// Just signed up, not verified
	{
		id: "wuser-9",
		campaignId: "campaign-1",
		email: "noah.wilson@protonmail.com",
		name: "Noah Wilson",
		customFields: {
			company: "Freelance",
			projectSize: "small",
		},
		status: "pending",
		position: 2891,
		referralCode: "NOAH2025X",
		referredBy: undefined,
		referralCount: 0,
		points: 5,
		source: "google",
		utmParams: {
			source: "google",
			medium: "cpc",
			campaign: "search_ads",
			term: "project management tool",
		},
		metadata: {
			ipAddress: "203.0.113.199",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
			country: "Germany",
			device: "desktop",
		},
		createdAt: new Date("2025-11-04T18:45:00Z"),
		verifiedAt: undefined,
		invitedAt: undefined,
	},
	// International user from India
	{
		id: "wuser-10",
		campaignId: "campaign-1",
		email: "priya.patel@gmail.com",
		name: "Priya Patel",
		customFields: {
			company: "Tech Solutions Pvt Ltd",
			role: "Team Lead",
			teamSize: "10-25",
		},
		status: "verified",
		position: 789,
		referralCode: "PRIYA2K25",
		referredBy: "wuser-4",
		referralCount: 12,
		points: 68,
		source: "referral",
		utmParams: {
			source: "referral",
			medium: "slack",
			campaign: "team_invite",
		},
		metadata: {
			ipAddress: "103.21.244.0",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
			country: "India",
			device: "desktop",
		},
		createdAt: new Date("2024-09-28T11:20:00Z"),
		verifiedAt: new Date("2024-09-28T11:55:00Z"),
		invitedAt: undefined,
	},
	// Campaign 2 users (Mobile App Beta)
	{
		id: "wuser-11",
		campaignId: "campaign-2",
		email: "fitness.enthusiast@gmail.com",
		name: "Marcus Johnson",
		customFields: {
			fitnessGoals: ["weight loss", "muscle gain"],
			currentApp: "MyFitnessPal",
		},
		status: "verified",
		position: 5,
		referralCode: "MARCUS99",
		referredBy: undefined,
		referralCount: 15,
		points: 85,
		source: "instagram",
		utmParams: {
			source: "instagram",
			medium: "social",
			campaign: "fitness_influencer",
		},
		metadata: {
			ipAddress: "198.51.100.42",
			userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
			country: "United States",
			device: "mobile",
		},
		createdAt: new Date("2024-10-21T06:30:00Z"),
		verifiedAt: new Date("2024-10-21T06:45:00Z"),
		invitedAt: new Date("2024-11-02T14:00:00Z"),
	},
	{
		id: "wuser-12",
		campaignId: "campaign-2",
		email: "gym.trainer@fitnesscenter.com",
		name: "Sarah Thompson",
		customFields: {
			profession: "Personal Trainer",
			clients: "50+",
		},
		status: "invited",
		position: 1,
		referralCode: "SARAHPT",
		referredBy: undefined,
		referralCount: 28,
		points: 150,
		source: "direct",
		utmParams: {},
		metadata: {
			ipAddress: "192.0.2.167",
			userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X)",
			country: "United Kingdom",
			device: "mobile",
		},
		createdAt: new Date("2024-10-20T08:45:00Z"),
		verifiedAt: new Date("2024-10-20T09:00:00Z"),
		invitedAt: new Date("2024-10-25T10:00:00Z"),
	},
	// Campaign 4 users (AI Writing Assistant)
	{
		id: "wuser-13",
		campaignId: "campaign-4",
		email: "content.creator@blogger.com",
		name: "Alex Rivera",
		customFields: {
			profession: "Content Writer",
			monthlyArticles: "20+",
			niche: "technology",
		},
		status: "verified",
		position: 3,
		referralCode: "ALEXWRITE",
		referredBy: undefined,
		referralCount: 56,
		points: 295,
		source: "producthunt",
		utmParams: {
			source: "producthunt",
			medium: "community",
			campaign: "launch_day",
		},
		metadata: {
			ipAddress: "203.0.113.77",
			userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
			country: "United States",
			device: "desktop",
		},
		createdAt: new Date("2024-08-11T10:00:00Z"),
		verifiedAt: new Date("2024-08-11T10:05:00Z"),
		invitedAt: new Date("2024-09-01T08:00:00Z"),
	},
	{
		id: "wuser-14",
		campaignId: "campaign-4",
		email: "marketing.pro@agency.io",
		name: "Jessica Park",
		customFields: {
			company: "Marketing Masters Agency",
			role: "Content Strategist",
			teamSize: "15",
		},
		status: "verified",
		position: 8,
		referralCode: "JESSICAAI",
		referredBy: "wuser-13",
		referralCount: 34,
		points: 185,
		source: "referral",
		utmParams: {
			source: "referral",
			medium: "twitter",
			campaign: "viral_sharing",
		},
		metadata: {
			ipAddress: "192.0.2.234",
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
			country: "Canada",
			device: "desktop",
		},
		createdAt: new Date("2024-08-15T14:22:00Z"),
		verifiedAt: new Date("2024-08-15T14:30:00Z"),
		invitedAt: new Date("2024-09-10T11:00:00Z"),
	},
	// Additional varied users
	{
		id: "wuser-15",
		campaignId: "campaign-1",
		email: "startup.founder@newcompany.com",
		name: "David Kim",
		customFields: {
			company: "Stealth Startup",
			role: "Founder & CEO",
			fundingStage: "Pre-seed",
			lookingFor: "collaboration tools",
		},
		status: "verified",
		position: 24,
		referralCode: "DAVIDKIM",
		referredBy: undefined,
		referralCount: 22,
		points: 120,
		source: "ycombinator",
		utmParams: {
			source: "ycombinator",
			medium: "forum",
			campaign: "community_post",
		},
		metadata: {
			ipAddress: "198.51.100.123",
			userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
			country: "United States",
			device: "desktop",
		},
		createdAt: new Date("2024-09-22T09:15:00Z"),
		verifiedAt: new Date("2024-09-22T09:20:00Z"),
		invitedAt: new Date("2024-10-20T12:00:00Z"),
	},
];

// Helper functions
export const getMockUserById = (id: string): WaitlistUser | undefined => {
	return mockWaitlistUsers.find((user) => user.id === id);
};

export const getMockUsersByCampaign = (campaignId: string): WaitlistUser[] => {
	return mockWaitlistUsers.filter((user) => user.campaignId === campaignId);
};

export const getMockUsersByStatus = (
	status: WaitlistUser["status"],
): WaitlistUser[] => {
	return mockWaitlistUsers.filter((user) => user.status === status);
};

export const getMockTopReferrers = (
	campaignId: string,
	limit: number = 10,
): WaitlistUser[] => {
	return mockWaitlistUsers
		.filter((user) => user.campaignId === campaignId)
		.sort((a, b) => b.referralCount - a.referralCount)
		.slice(0, limit);
};

// Mock user groups by status
export const mockUsersByStatus = {
	pending: mockWaitlistUsers.filter((u) => u.status === "pending"),
	verified: mockWaitlistUsers.filter((u) => u.status === "verified"),
	invited: mockWaitlistUsers.filter((u) => u.status === "invited"),
	active: mockWaitlistUsers.filter((u) => u.status === "active"),
	rejected: mockWaitlistUsers.filter((u) => u.status === "rejected"),
};

// Mock user groups by device
export const mockUsersByDevice = {
	mobile: mockWaitlistUsers.filter((u) => u.metadata.device === "mobile"),
	tablet: mockWaitlistUsers.filter((u) => u.metadata.device === "tablet"),
	desktop: mockWaitlistUsers.filter((u) => u.metadata.device === "desktop"),
};

// Mock user groups by source
export const mockUsersBySource = {
	direct: mockWaitlistUsers.filter((u) => u.source === "direct"),
	referral: mockWaitlistUsers.filter((u) => u.source === "referral"),
	twitter: mockWaitlistUsers.filter((u) => u.source === "twitter"),
	facebook: mockWaitlistUsers.filter((u) => u.source === "facebook"),
	linkedin: mockWaitlistUsers.filter((u) => u.source === "linkedin"),
	google: mockWaitlistUsers.filter((u) => u.source === "google"),
	instagram: mockWaitlistUsers.filter((u) => u.source === "instagram"),
	producthunt: mockWaitlistUsers.filter((u) => u.source === "producthunt"),
};
