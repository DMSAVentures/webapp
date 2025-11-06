import { useCallback, useState } from 'react';
import type { TeamMember } from '@/types/common.types';
import { teamService, type UpdateTeamMemberRoleRequest } from '../services/team.service';

/**
 * Hook to update a team member's role
 * Operation hook - does not fetch on mount
 */
export const useUpdateMemberRole = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TeamMember | null>(null);

  const updateMemberRole = useCallback(async (
    memberId: string,
    roleData: UpdateTeamMemberRoleRequest
  ): Promise<TeamMember | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await teamService.updateRole(memberId, roleData);
      // Convert date strings to Date objects
      const memberWithDates = {
        ...response,
        invitedAt: new Date(response.invitedAt),
        joinedAt: response.joinedAt ? new Date(response.joinedAt) : undefined,
        lastActiveAt: response.lastActiveAt ? new Date(response.lastActiveAt) : undefined,
      };
      setData(memberWithDates);
      return memberWithDates;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateMemberRole,
    loading,
    error,
    data,
  };
};
