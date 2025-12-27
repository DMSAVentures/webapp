/**
 * API Key UI Type Definitions
 *
 * UI types (camelCase) for API keys
 */

// ============================================================================
// API Key Types (UI - camelCase)
// ============================================================================

export type APIKeyStatus = "active" | "revoked" | "expired";

export interface APIKey {
	id: string;
	name: string;
	keyPrefix: string;
	scopes: string[];
	status: APIKeyStatus;
	lastUsedAt?: Date;
	totalRequests: number;
	expiresAt?: Date;
	createdAt: Date;
	revokedAt?: Date;
}

export interface CreateAPIKeyResponse {
	id: string;
	name: string;
	key: string; // Only returned once on creation
	keyPrefix: string;
	scopes: string[];
	expiresAt?: Date;
	createdAt: Date;
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

export type APIKeyScope = keyof typeof API_KEY_SCOPES;
