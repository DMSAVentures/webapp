/**
 * API Key API Types
 *
 * API request/response types for API keys (snake_case)
 */

// ============================================================================
// API Key Types (API Response)
// ============================================================================

export type ApiAPIKeyStatus = "active" | "revoked" | "expired";

export interface ApiAPIKey {
	id: string;
	name: string;
	key_prefix: string;
	scopes: string[];
	status: ApiAPIKeyStatus;
	last_used_at?: string;
	total_requests: number;
	expires_at?: string;
	created_at: string;
	revoked_at?: string;
}

// ============================================================================
// Request Types
// ============================================================================

export interface ApiCreateAPIKeyRequest {
	name: string;
	scopes: string[];
	expires_in_days?: number;
}

export interface ApiCreateAPIKeyResponse {
	id: string;
	name: string;
	key: string; // Only returned once on creation
	key_prefix: string;
	scopes: string[];
	expires_at?: string;
	created_at: string;
}

export interface ApiUpdateAPIKeyRequest {
	name: string;
}

export interface ApiGetScopesResponse {
	scopes: string[];
}

// ============================================================================
// API Key Scopes
// ============================================================================

export const API_KEY_SCOPES = {
	zapier: "Zapier integrations",
	webhooks: "Webhook management",
	read: "Read-only access",
	write: "Write access",
	all: "Full access",
} as const;

export type ApiAPIKeyScope = keyof typeof API_KEY_SCOPES;
