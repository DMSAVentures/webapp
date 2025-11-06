import { useCallback, useState } from 'react';
import { teamService } from '../services/team.service';

/**
 * Hook to remove a team member
 * Operation hook - does not fetch on mount
 */
export const useRemoveTeamMember = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const removeTeamMember = useCallback(async (
    memberId: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await teamService.remove(memberId);
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    removeTeamMember,
    loading,
    error,
  };
};
