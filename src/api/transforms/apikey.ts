/**
 * API Key Transformers
 *
 * Transform between API (snake_case) and UI (camelCase) API key types
 */

import type { APIKey, CreateAPIKeyResponse } from "@/types/apikey";
import type { ApiAPIKey, ApiCreateAPIKeyResponse } from "../types/apikey";
import { parseDate } from "./base";

// ============================================================================
// API → UI Transformers
// ============================================================================

export function toUiAPIKey(api: ApiAPIKey): APIKey {
	return {
		id: api.id,
		name: api.name,
		keyPrefix: api.key_prefix,
		scopes: api.scopes,
		status: api.status,
		lastUsedAt: parseDate(api.last_used_at),
		totalRequests: api.total_requests,
		expiresAt: parseDate(api.expires_at),
		createdAt: parseDate(api.created_at)!,
		revokedAt: parseDate(api.revoked_at),
	};
}

export function toUiCreateAPIKeyResponse(
	api: ApiCreateAPIKeyResponse,
): CreateAPIKeyResponse {
	return {
		id: api.id,
		name: api.name,
		key: api.key,
		keyPrefix: api.key_prefix,
		scopes: api.scopes,
		expiresAt: parseDate(api.expires_at),
		createdAt: parseDate(api.created_at)!,
	};
}
