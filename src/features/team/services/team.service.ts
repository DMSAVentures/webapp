/**
 * Team Service
 * API calls for team member management using the centralized fetcher
 */

import { fetcher } from "@/hooks/fetcher";
import type { TeamMember } from "@/types/common.types";

const API_BASE = import.meta.env.VITE_API_URL;

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
 * Team service
 * All API operations for team members
 */
export const teamService = {
	/**
	 * Get list of team members
	 */
	list: async (): Promise<TeamMember[]> => {
		return fetcher<TeamMember[]>(`${API_BASE}/api/team`);
	},

	/**
	 * Get single team member by ID
	 */
	get: async (id: string): Promise<TeamMember> => {
		return fetcher<TeamMember>(`${API_BASE}/api/team/${id}`);
	},

	/**
	 * Invite new team member
	 */
	invite: async (data: InviteTeamMemberRequest): Promise<TeamMember> => {
		return fetcher<TeamMember>(`${API_BASE}/api/team/invite`, {
			method: "POST",
			body: JSON.stringify(data),
		});
	},

	/**
	 * Update team member role
	 */
	updateRole: async (
		id: string,
		data: UpdateTeamMemberRoleRequest,
	): Promise<TeamMember> => {
		return fetcher<TeamMember>(`${API_BASE}/api/team/${id}/role`, {
			method: "PATCH",
			body: JSON.stringify(data),
		});
	},

	/**
	 * Remove team member
	 */
	remove: async (id: string): Promise<void> => {
		return fetcher<void>(`${API_BASE}/api/team/${id}`, {
			method: "DELETE",
		});
	},

	/**
	 * Resend invitation to team member
	 */
	resendInvite: async (id: string): Promise<void> => {
		return fetcher<void>(`${API_BASE}/api/team/${id}/resend-invite`, {
			method: "POST",
		});
	},
};
