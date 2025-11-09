/**
 * Team Service
 * API calls for team member management using dependency injection
 * This implementation allows for easy mocking and testing
 */

import type { TeamMember } from "@/types/common.types";
import type {
	ITeamService,
	IFetcher,
	InviteTeamMemberRequest,
	UpdateTeamMemberRoleRequest,
} from "@/interfaces";
import { defaultFetcher } from "@/adapters/fetcher.adapter";

const API_BASE = import.meta.env.VITE_API_URL;

/**
 * Service Dependencies
 * Define all dependencies required by the team service
 */
export interface TeamServiceDependencies {
	fetcher: IFetcher;
	apiBase?: string;
}

/**
 * Create Team Service
 * Factory function that creates a team service with injected dependencies
 *
 * @param dependencies - Service dependencies (fetcher, apiBase)
 * @returns Team service implementation
 *
 * @example
 * // Production usage with default dependencies
 * const service = createTeamService({ fetcher: defaultFetcher });
 *
 * @example
 * // Testing usage with mock dependencies
 * const mockFetcher = { fetch: jest.fn() };
 * const service = createTeamService({ fetcher: mockFetcher });
 */
export function createTeamService(
	dependencies: TeamServiceDependencies,
): ITeamService {
	const { fetcher, apiBase = API_BASE } = dependencies;

	return {
		/**
		 * Get list of team members
		 */
		list: async (): Promise<TeamMember[]> => {
			return fetcher.fetch<TeamMember[]>(`${apiBase}/api/team`);
		},

		/**
		 * Get single team member by ID
		 */
		get: async (id: string): Promise<TeamMember> => {
			return fetcher.fetch<TeamMember>(`${apiBase}/api/team/${id}`);
		},

		/**
		 * Invite new team member
		 */
		invite: async (data: InviteTeamMemberRequest): Promise<TeamMember> => {
			return fetcher.fetch<TeamMember>(`${apiBase}/api/team/invite`, {
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
			return fetcher.fetch<TeamMember>(`${apiBase}/api/team/${id}/role`, {
				method: "PATCH",
				body: JSON.stringify(data),
			});
		},

		/**
		 * Remove team member
		 */
		remove: async (id: string): Promise<void> => {
			return fetcher.fetch<void>(`${apiBase}/api/team/${id}`, {
				method: "DELETE",
			});
		},

		/**
		 * Resend invitation to team member
		 */
		resendInvite: async (id: string): Promise<void> => {
			return fetcher.fetch<void>(`${apiBase}/api/team/${id}/resend-invite`, {
				method: "POST",
			});
		},
	};
}

/**
 * Default team service instance
 * Pre-configured with production dependencies
 * Use this in your application code
 */
export const teamService = createTeamService({
	fetcher: defaultFetcher,
});
