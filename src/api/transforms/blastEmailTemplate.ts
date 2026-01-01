/**
 * Blast Email Template Transformers
 *
 * Transform between API (snake_case) and UI (camelCase) blast email template types
 */

import type { BlastEmailTemplate } from "@/types/blastEmailTemplate";
import type { ApiBlastEmailTemplate } from "../types/blastEmailTemplate";
import { parseDate } from "./base";

// ============================================================================
// API → UI Transformers
// ============================================================================

export function toUiBlastEmailTemplate(
	api: ApiBlastEmailTemplate,
): BlastEmailTemplate {
	return {
		id: api.id,
		accountId: api.account_id,
		name: api.name,
		subject: api.subject,
		htmlBody: api.html_body,
		blocksJson: api.blocks_json,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiBlastEmailTemplates(
	api: ApiBlastEmailTemplate[],
): BlastEmailTemplate[] {
	return api.map(toUiBlastEmailTemplate);
}
