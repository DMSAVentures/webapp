/**
 * Blast Email Template UI Types
 *
 * UI types (camelCase) for blast email templates.
 * These are account-level templates used for manual email blasts to segments.
 */

import type { EmailBlocksJson } from "./campaignEmailTemplate";

/**
 * Blast Email Template - account-level, reusable template for email blasts
 */
export interface BlastEmailTemplate {
	id: string;
	accountId: string;
	name: string;
	subject: string;
	htmlBody: string;
	blocksJson?: EmailBlocksJson;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Input for creating a blast email template
 */
export interface CreateBlastEmailTemplateInput {
	name: string;
	subject: string;
	htmlBody: string;
	blocksJson?: EmailBlocksJson;
}

/**
 * Input for updating a blast email template
 */
export interface UpdateBlastEmailTemplateInput {
	name?: string;
	subject?: string;
	htmlBody?: string;
	blocksJson?: EmailBlocksJson;
}
