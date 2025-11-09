/**
 * Service Interfaces
 * Define contracts for all service layer operations
 * This enables dependency injection and mock testing
 */

import type { Campaign, CampaignSettings, TeamMember } from "@/types/common.types";

/**
 * Request type for creating a campaign
 */
export interface CreateCampaignRequest {
	name: string;
	description?: string;
	settings: {
		emailVerificationRequired: boolean;
		duplicateHandling: "block" | "update" | "allow";
		enableReferrals: boolean;
		enableRewards: boolean;
	};
}

/**
 * Request type for updating a campaign
 */
export interface UpdateCampaignRequest {
	name?: string;
	description?: string;
	status?: Campaign["status"];
	settings?: Partial<CampaignSettings>;
}

/**
 * Filters for listing campaigns
 */
export interface CampaignFilters {
	status?: Campaign["status"];
	search?: string;
	page?: number;
	limit?: number;
}

/**
 * Request type for inviting a team member
 */
export interface InviteTeamMemberRequest {
	email: string;
	role: TeamMember["role"];
}

/**
 * Request type for updating a team member's role
 */
export interface UpdateTeamMemberRoleRequest {
	role: TeamMember["role"];
}

/**
 * Campaigns Service Interface
 * Defines all campaign-related operations
 */
export interface ICampaignsService {
	/**
	 * Get list of campaigns with optional filters
	 */
	list(filters?: CampaignFilters): Promise<Campaign[]>;

	/**
	 * Get single campaign by ID
	 */
	get(id: string): Promise<Campaign>;

	/**
	 * Create new campaign
	 */
	create(data: CreateCampaignRequest): Promise<Campaign>;

	/**
	 * Update existing campaign
	 */
	update(id: string, data: UpdateCampaignRequest): Promise<Campaign>;

	/**
	 * Delete campaign
	 */
	delete(id: string): Promise<void>;

	/**
	 * Duplicate campaign
	 */
	duplicate(id: string): Promise<Campaign>;

	/**
	 * Get campaign statistics
	 */
	getStats(id: string): Promise<Campaign["stats"]>;

	/**
	 * Update campaign status
	 */
	updateStatus(id: string, status: Campaign["status"]): Promise<Campaign>;
}

/**
 * Team Service Interface
 * Defines all team member operations
 */
export interface ITeamService {
	/**
	 * Get list of team members
	 */
	list(): Promise<TeamMember[]>;

	/**
	 * Get single team member by ID
	 */
	get(id: string): Promise<TeamMember>;

	/**
	 * Invite new team member
	 */
	invite(data: InviteTeamMemberRequest): Promise<TeamMember>;

	/**
	 * Update team member role
	 */
	updateRole(id: string, data: UpdateTeamMemberRoleRequest): Promise<TeamMember>;

	/**
	 * Remove team member
	 */
	remove(id: string): Promise<void>;

	/**
	 * Resend invitation to team member
	 */
	resendInvite(id: string): Promise<void>;
}
