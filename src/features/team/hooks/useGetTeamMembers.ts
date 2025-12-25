import { useCallback, useEffect, useState } from "react";
import type { ApiError } from "@/api";
import type { TeamMember } from "@/types/common.types";
import { teamService } from "../services/team.service";

/**
 * Hook to fetch team members
 * Fetches on mount and provides refetch function
 */
export const useGetTeamMembers = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

	const fetchTeamMembers = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			const response = await teamService.list();
			// Convert date strings to Date objects
			const membersWithDates = response.map((member) => ({
				...member,
				invitedAt: new Date(member.invitedAt),
				joinedAt: member.joinedAt ? new Date(member.joinedAt) : undefined,
				lastActiveAt: member.lastActiveAt
					? new Date(member.lastActiveAt)
					: undefined,
			}));
			setTeamMembers(membersWithDates);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Unknown error";
			setError({ error: message });
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchTeamMembers();
	}, [fetchTeamMembers]);

	return {
		refetch: fetchTeamMembers,
		loading,
		error,
		teamMembers,
	};
};
