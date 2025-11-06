/**
 * Mock data for Email Template and Email Campaign components
 * Used for Storybook stories and testing
 */

import type { EmailCampaign, EmailTemplate } from "../types/common.types";

// Mock Email Templates
export const mockEmailTemplates: EmailTemplate[] = [
	{
		id: "template-1",
		campaignId: "campaign-1",
		name: "Welcome Email",
		subject: "Welcome to {{campaign_name}}! 🎉",
		preheader: "Thank you for joining our waitlist",
		htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome, {{first_name}}!</h1>
          </div>
          <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 16px;">Hi {{first_name}},</p>
            <p style="font-size: 16px;">Thank you for joining the {{campaign_name}} waitlist! We're thrilled to have you on board.</p>
            <p style="font-size: 16px;">You're currently at position <strong>#{{position}}</strong> in the waitlist.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #667eea;">Want to move up faster?</h3>
              <p style="margin-bottom: 15px;">Share your unique referral link and move up the waitlist for every friend who joins!</p>
              <a href="{{referral_link}}" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Share Your Link</a>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">Best regards,<br>The {{campaign_name}} Team</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>You received this email because you signed up for {{campaign_name}}.</p>
            <p><a href="{{unsubscribe_link}}" style="color: #999;">Unsubscribe</a></p>
          </div>
        </body>
      </html>
    `,
		textContent: `Welcome, {{first_name}}!\n\nThank you for joining the {{campaign_name}} waitlist! We're thrilled to have you on board.\n\nYou're currently at position #{{position}} in the waitlist.\n\nWant to move up faster? Share your unique referral link: {{referral_link}}\n\nBest regards,\nThe {{campaign_name}} Team`,
		type: "welcome",
		variables: [
			"first_name",
			"campaign_name",
			"position",
			"referral_link",
			"unsubscribe_link",
		],
		status: "active",
		createdAt: new Date("2024-09-15T10:00:00Z"),
		updatedAt: new Date("2024-09-20T14:30:00Z"),
	},
	{
		id: "template-2",
		campaignId: "campaign-1",
		name: "Email Verification",
		subject: "Please verify your email address",
		preheader: "One more step to secure your spot",
		htmlContent: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 40px 20px;">
            <h1 style="color: #333; margin-bottom: 20px;">Verify Your Email</h1>
            <p style="font-size: 16px; color: #666;">Hi {{first_name}}, please verify your email address to secure your spot on the waitlist.</p>
            <a href="{{verification_link}}" style="display: inline-block; margin: 30px 0; background: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
            <p style="font-size: 14px; color: #999;">This link will expire in 24 hours.</p>
            <p style="font-size: 14px; color: #999; margin-top: 30px;">If you didn't sign up for {{campaign_name}}, you can safely ignore this email.</p>
          </div>
        </body>
      </html>
    `,
		textContent: `Hi {{first_name}},\n\nPlease verify your email address to secure your spot on the waitlist.\n\nVerification link: {{verification_link}}\n\nThis link will expire in 24 hours.\n\nIf you didn't sign up for {{campaign_name}}, you can safely ignore this email.`,
		type: "verification",
		variables: ["first_name", "campaign_name", "verification_link"],
		status: "active",
		createdAt: new Date("2024-09-15T10:30:00Z"),
		updatedAt: new Date("2024-09-15T10:30:00Z"),
	},
	{
		id: "template-3",
		campaignId: "campaign-1",
		name: "Position Update - Milestone Reached",
		subject: "You're in the top {{percentile}}%! 🚀",
		preheader: "Your referrals are paying off",
		htmlContent: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center; border-radius: 10px;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Congrats, {{first_name}}! 🎉</h1>
          </div>
          <div style="background: white; padding: 40px 30px;">
            <p style="font-size: 18px;">You've moved up to position <strong style="color: #f5576c; font-size: 24px;">#{{position}}</strong>!</p>
            <p style="font-size: 16px;">That puts you in the top <strong>{{percentile}}%</strong> of all waitlist members.</p>
            <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c;">
              <p style="margin: 0; font-size: 16px;"><strong>{{referral_count}}</strong> people joined using your link!</p>
            </div>
            <p style="font-size: 16px;">Keep sharing to move up even faster:</p>
            <a href="{{referral_link}}" style="display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">Share Your Link</a>
          </div>
        </body>
      </html>
    `,
		textContent: `Congrats, {{first_name}}!\n\nYou've moved up to position #{{position}}!\n\nThat puts you in the top {{percentile}}% of all waitlist members.\n\n{{referral_count}} people joined using your link!\n\nKeep sharing to move up even faster: {{referral_link}}`,
		type: "milestone",
		variables: [
			"first_name",
			"position",
			"percentile",
			"referral_count",
			"referral_link",
		],
		status: "active",
		createdAt: new Date("2024-09-18T09:00:00Z"),
		updatedAt: new Date("2024-09-25T11:15:00Z"),
	},
	{
		id: "template-4",
		campaignId: "campaign-1",
		name: "Launch Announcement",
		subject: "We're Live! Your Early Access Code Inside 🎊",
		preheader: "Thank you for being an early supporter",
		htmlContent: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 40px 20px;">
            <h1 style="color: #333; font-size: 36px; margin-bottom: 10px;">We're Live! 🎉</h1>
            <p style="font-size: 18px; color: #666;">{{campaign_name}} is officially launching today!</p>
          </div>
          <div style="background: white; padding: 30px; border: 2px solid #10b981; border-radius: 10px; margin: 20px 0;">
            <p style="font-size: 16px; margin-top: 0;">Hi {{first_name}},</p>
            <p style="font-size: 16px;">Thank you for being one of our early supporters. As promised, here's your exclusive early access code:</p>
            <div style="background: #f0fdf4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <code style="font-size: 24px; font-weight: bold; color: #10b981; letter-spacing: 2px;">{{access_code}}</code>
            </div>
            <a href="{{launch_url}}" style="display: block; text-align: center; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; margin: 20px 0;">Get Started Now</a>
            <p style="font-size: 14px; color: #666;">This early access code gives you:</p>
            <ul style="color: #666;">
              <li>3 months free premium access</li>
              <li>Priority support</li>
              <li>Exclusive features for early adopters</li>
            </ul>
          </div>
        </body>
      </html>
    `,
		textContent: `We're Live!\n\nHi {{first_name}},\n\nThank you for being one of our early supporters. As promised, here's your exclusive early access code:\n\n{{access_code}}\n\nGet started: {{launch_url}}\n\nThis early access code gives you:\n- 3 months free premium access\n- Priority support\n- Exclusive features for early adopters`,
		type: "launch",
		variables: ["first_name", "campaign_name", "access_code", "launch_url"],
		status: "draft",
		createdAt: new Date("2024-10-01T14:00:00Z"),
		updatedAt: new Date("2024-10-28T16:30:00Z"),
	},
	{
		id: "template-5",
		campaignId: "campaign-2",
		name: "Beta Invitation",
		subject: "You're invited to join our Beta! 🎯",
		preheader: "Download the app and start testing",
		htmlContent: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #8b5cf6; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">You're In! 🎉</h1>
          </div>
          <div style="background: white; padding: 40px 30px;">
            <p style="font-size: 16px;">Hey {{first_name}},</p>
            <p style="font-size: 16px;">Great news! You've been selected to join our exclusive beta program.</p>
            <div style="background: #f5f3ff; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #8b5cf6;">Download the App</h3>
              <div style="display: flex; gap: 10px; justify-content: center; margin: 20px 0;">
                <a href="{{ios_download_link}}" style="display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">📱 iOS</a>
                <a href="{{android_download_link}}" style="display: inline-block; background: #3ddc84; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">🤖 Android</a>
              </div>
            </div>
            <p style="font-size: 14px; color: #666;"><strong>Beta Access Code:</strong> {{beta_code}}</p>
            <p style="font-size: 14px; color: #666;">We'd love to hear your feedback as you test the app!</p>
          </div>
        </body>
      </html>
    `,
		textContent: `Hey {{first_name}},\n\nGreat news! You've been selected to join our exclusive beta program.\n\nDownload the app:\niOS: {{ios_download_link}}\nAndroid: {{android_download_link}}\n\nBeta Access Code: {{beta_code}}\n\nWe'd love to hear your feedback as you test the app!`,
		type: "invitation",
		variables: [
			"first_name",
			"ios_download_link",
			"android_download_link",
			"beta_code",
		],
		status: "active",
		createdAt: new Date("2024-10-20T08:30:00Z"),
		updatedAt: new Date("2024-10-22T10:15:00Z"),
	},
	{
		id: "template-6",
		campaignId: "campaign-4",
		name: "Inactive User Re-engagement",
		subject: "We miss you, {{first_name}}! Come back? 💌",
		preheader: "Exciting updates since you last visited",
		htmlContent: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 30px 20px;">
            <h1 style="color: #14b8a6; margin-bottom: 20px;">We Miss You! 💌</h1>
            <p style="font-size: 16px; color: #666;">Hi {{first_name}}, it's been a while since we last saw you.</p>
          </div>
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px;">A lot has happened since you joined our waitlist:</p>
            <ul style="font-size: 16px; line-height: 2;">
              <li>✨ New AI writing features added</li>
              <li>🚀 Launch date moved up to Q1 2025</li>
              <li>🎁 Early bird pricing extended</li>
            </ul>
            <p style="font-size: 16px;">You're still at position <strong>#{{position}}</strong>. Want to improve your spot?</p>
            <a href="{{referral_link}}" style="display: inline-block; background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">Share & Move Up</a>
          </div>
        </body>
      </html>
    `,
		textContent: `We Miss You!\n\nHi {{first_name}}, it's been a while since we last saw you.\n\nA lot has happened since you joined our waitlist:\n- New AI writing features added\n- Launch date moved up to Q1 2025\n- Early bird pricing extended\n\nYou're still at position #{{position}}. Want to improve your spot?\n\nShare your link: {{referral_link}}`,
		type: "custom",
		variables: ["first_name", "position", "referral_link"],
		status: "active",
		createdAt: new Date("2024-09-15T11:00:00Z"),
		updatedAt: new Date("2024-10-10T09:30:00Z"),
	},
];

// Mock Email Campaigns
export const mockEmailCampaigns: EmailCampaign[] = [
	{
		id: "email-campaign-1",
		campaignId: "campaign-1",
		name: "Welcome Series - New Signups",
		templateId: "template-1",
		segmentId: undefined,
		trigger: "signup",
		triggerConfig: undefined,
		status: "sending",
		scheduledFor: undefined,
		stats: {
			sent: 12547,
			delivered: 12389,
			opened: 9876,
			clicked: 6234,
			bounced: 158,
			unsubscribed: 23,
		},
		createdAt: new Date("2024-09-15T10:00:00Z"),
		sentAt: new Date("2024-09-16T08:00:00Z"),
	},
	{
		id: "email-campaign-2",
		campaignId: "campaign-1",
		name: "Email Verification Required",
		templateId: "template-2",
		segmentId: undefined,
		trigger: "signup",
		triggerConfig: undefined,
		status: "sent",
		scheduledFor: undefined,
		stats: {
			sent: 12547,
			delivered: 12423,
			opened: 11234,
			clicked: 10892,
			bounced: 124,
			unsubscribed: 5,
		},
		createdAt: new Date("2024-09-15T10:30:00Z"),
		sentAt: new Date("2024-09-16T08:05:00Z"),
	},
	{
		id: "email-campaign-3",
		campaignId: "campaign-1",
		name: "Milestone Celebration - Top 10%",
		templateId: "template-3",
		segmentId: "segment-top-10",
		trigger: "milestone",
		triggerConfig: {
			milestoneType: "top_percentile",
			milestoneValue: 10,
		},
		status: "sent",
		scheduledFor: undefined,
		stats: {
			sent: 1254,
			delivered: 1248,
			opened: 1123,
			clicked: 892,
			bounced: 6,
			unsubscribed: 2,
		},
		createdAt: new Date("2024-09-20T14:00:00Z"),
		sentAt: new Date("2024-09-25T09:00:00Z"),
	},
	{
		id: "email-campaign-4",
		campaignId: "campaign-1",
		name: "Launch Announcement - Early Access",
		templateId: "template-4",
		segmentId: "segment-verified",
		trigger: "manual",
		triggerConfig: undefined,
		status: "scheduled",
		scheduledFor: new Date("2025-11-15T10:00:00Z"),
		stats: {
			sent: 0,
			delivered: 0,
			opened: 0,
			clicked: 0,
			bounced: 0,
			unsubscribed: 0,
		},
		createdAt: new Date("2024-10-28T16:30:00Z"),
		sentAt: undefined,
	},
	{
		id: "email-campaign-5",
		campaignId: "campaign-2",
		name: "Beta Invitations - First 100",
		templateId: "template-5",
		segmentId: "segment-top-100",
		trigger: "manual",
		triggerConfig: undefined,
		status: "sent",
		scheduledFor: undefined,
		stats: {
			sent: 100,
			delivered: 100,
			opened: 98,
			clicked: 95,
			bounced: 0,
			unsubscribed: 0,
		},
		createdAt: new Date("2024-10-22T10:00:00Z"),
		sentAt: new Date("2024-10-25T09:00:00Z"),
	},
	{
		id: "email-campaign-6",
		campaignId: "campaign-4",
		name: "Re-engagement - Inactive 30 Days",
		templateId: "template-6",
		segmentId: "segment-inactive",
		trigger: "inactive",
		triggerConfig: {
			days: 30,
		},
		status: "sending",
		scheduledFor: undefined,
		stats: {
			sent: 2456,
			delivered: 2398,
			opened: 1234,
			clicked: 567,
			bounced: 58,
			unsubscribed: 89,
		},
		createdAt: new Date("2024-10-10T09:30:00Z"),
		sentAt: new Date("2024-10-15T08:00:00Z"),
	},
	{
		id: "email-campaign-7",
		campaignId: "campaign-1",
		name: "Weekly Update - Product Progress",
		templateId: "template-1",
		segmentId: undefined,
		trigger: "scheduled",
		triggerConfig: {
			days: 7,
		},
		status: "draft",
		scheduledFor: new Date("2025-11-12T10:00:00Z"),
		stats: {
			sent: 0,
			delivered: 0,
			opened: 0,
			clicked: 0,
			bounced: 0,
			unsubscribed: 0,
		},
		createdAt: new Date("2024-11-01T15:00:00Z"),
		sentAt: undefined,
	},
	{
		id: "email-campaign-8",
		campaignId: "campaign-1",
		name: "Position Update - Daily Digest",
		templateId: "template-3",
		segmentId: undefined,
		trigger: "scheduled",
		triggerConfig: {
			days: 1,
			hours: 9,
		},
		status: "paused",
		scheduledFor: undefined,
		stats: {
			sent: 4567,
			delivered: 4512,
			opened: 3234,
			clicked: 1892,
			bounced: 55,
			unsubscribed: 12,
		},
		createdAt: new Date("2024-09-20T10:00:00Z"),
		sentAt: new Date("2024-10-20T09:00:00Z"),
	},
];

// Helper functions
export const getMockEmailTemplateById = (
	id: string,
): EmailTemplate | undefined => {
	return mockEmailTemplates.find((template) => template.id === id);
};

export const getMockEmailTemplatesByCampaign = (
	campaignId: string,
): EmailTemplate[] => {
	return mockEmailTemplates.filter(
		(template) => template.campaignId === campaignId,
	);
};

export const getMockEmailTemplatesByType = (
	type: EmailTemplate["type"],
): EmailTemplate[] => {
	return mockEmailTemplates.filter((template) => template.type === type);
};

export const getMockEmailCampaignById = (
	id: string,
): EmailCampaign | undefined => {
	return mockEmailCampaigns.find((campaign) => campaign.id === id);
};

export const getMockEmailCampaignsByCampaign = (
	campaignId: string,
): EmailCampaign[] => {
	return mockEmailCampaigns.filter(
		(campaign) => campaign.campaignId === campaignId,
	);
};

export const getMockEmailCampaignsByStatus = (
	status: EmailCampaign["status"],
): EmailCampaign[] => {
	return mockEmailCampaigns.filter((campaign) => campaign.status === status);
};

// Mock email campaign stats aggregated
export const mockEmailCampaignStatsAggregated = {
	totalSent: mockEmailCampaigns.reduce((sum, c) => sum + c.stats.sent, 0),
	totalDelivered: mockEmailCampaigns.reduce(
		(sum, c) => sum + c.stats.delivered,
		0,
	),
	totalOpened: mockEmailCampaigns.reduce((sum, c) => sum + c.stats.opened, 0),
	totalClicked: mockEmailCampaigns.reduce((sum, c) => sum + c.stats.clicked, 0),
	totalBounced: mockEmailCampaigns.reduce((sum, c) => sum + c.stats.bounced, 0),
	totalUnsubscribed: mockEmailCampaigns.reduce(
		(sum, c) => sum + c.stats.unsubscribed,
		0,
	),
	averageOpenRate:
		(mockEmailCampaigns.reduce(
			(sum, c) =>
				sum + (c.stats.delivered > 0 ? c.stats.opened / c.stats.delivered : 0),
			0,
		) /
			mockEmailCampaigns.length) *
		100,
	averageClickRate:
		(mockEmailCampaigns.reduce(
			(sum, c) =>
				sum + (c.stats.delivered > 0 ? c.stats.clicked / c.stats.delivered : 0),
			0,
		) /
			mockEmailCampaigns.length) *
		100,
};
