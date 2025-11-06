/**
 * User personas define role-based access to features and pages
 */
export type UserPersona =
	| 'admin'           // Full access to all features
	| 'marketing'       // Access to analytics, campaigns, email marketing
	| 'developer'       // Access to technical features and API
	| 'sales'           // Access to CRM and analytics
	| 'content_creator' // Access to content creation tools
	| 'viewer';         // Read-only access

export interface UserResponse {
	first_name: string;
	last_name: string;
	external_id: string;
	persona?: UserPersona;
}

export type User = UserResponse;
