/**
 * Campaign Email Template Transformers
 *
 * Transform between API (snake_case) and UI (camelCase) campaign email template types
 */

import type { CampaignEmailTemplate } from "@/types/campaignEmailTemplate";
import type { ApiCampaignEmailTemplate } from "../types/campaignEmailTemplate";
import { parseDate } from "./base";

// ============================================================================
// API → UI Transformers
// ============================================================================

export function toUiCampaignEmailTemplate(
	api: ApiCampaignEmailTemplate,
): CampaignEmailTemplate {
	return {
		id: api.id,
		campaignId: api.campaign_id,
		name: api.name,
		type: api.type,
		subject: api.subject,
		htmlBody: api.html_body,
		blocksJson: api.blocks_json,
		enabled: api.enabled,
		sendAutomatically: api.send_automatically,
		variantName: api.variant_name,
		variantWeight: api.variant_weight,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiCampaignEmailTemplates(
	api: ApiCampaignEmailTemplate[],
): CampaignEmailTemplate[] {
	return api.map(toUiCampaignEmailTemplate);
}
