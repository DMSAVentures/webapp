/**
 * Campaign Email Template UI Types
 *
 * UI types (camelCase) for campaign email templates.
 * These are used for automated campaign emails (verification, welcome, etc.)
 */

/**
 * Email blocks JSON structure with blocks and design settings
 */
export interface EmailBlocksJson {
	blocks: unknown[];
	design?: unknown;
}

/**
 * Campaign email template types
 */
export type CampaignEmailTemplateType =
	| "verification"
	| "welcome"
	| "position_update"
	| "reward_earned"
	| "milestone"
	| "custom";

/**
 * Campaign Email Template - tied to a specific campaign
 */
export interface CampaignEmailTemplate {
	id: string;
	campaignId: string;
	name: string;
	type: CampaignEmailTemplateType;
	subject: string;
	htmlBody: string;
	blocksJson?: EmailBlocksJson;
	enabled: boolean;
	sendAutomatically: boolean;
	variantName?: string;
	variantWeight?: number;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Input for creating a campaign email template
 */
export interface CreateCampaignEmailTemplateInput {
	name: string;
	type: CampaignEmailTemplateType;
	subject: string;
	htmlBody: string;
	blocksJson?: EmailBlocksJson;
	enabled?: boolean;
	sendAutomatically?: boolean;
}

/**
 * Input for updating a campaign email template
 */
export interface UpdateCampaignEmailTemplateInput {
	name?: string;
	subject?: string;
	htmlBody?: string;
	blocksJson?: EmailBlocksJson;
	enabled?: boolean;
	sendAutomatically?: boolean;
}

/**
 * Input for sending a test email
 */
export interface SendTestEmailInput {
	recipientEmail: string;
	testData?: Record<string, string | number>;
}
