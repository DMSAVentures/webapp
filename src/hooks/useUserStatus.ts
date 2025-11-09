/**
 * User Status Utility Hook
 *
 * Provides utility functions for working with waitlist user statuses
 */

import { useCallback, useMemo } from "react";
import type { WaitlistUserStatus } from "@/types/users.types";

/**
 * Maps waitlist user status to StatusBadge variant
 */
export const useUserStatusVariant = () => {
	return useCallback(
		(
			status: WaitlistUserStatus,
		): "completed" | "pending" | "failed" | "disabled" => {
			switch (status) {
				case "verified":
				case "active":
					return "completed";
				case "pending":
				case "invited":
					return "pending";
				case "rejected":
					return "failed";
				default:
					return "pending";
			}
		},
		[],
	);
};

/**
 * Formats status text for display
 */
export const useFormatStatus = () => {
	return useCallback((status: string): string => {
		return status.charAt(0).toUpperCase() + status.slice(1);
	}, []);
};

/**
 * Combined hook that provides all user status utilities
 */
export const useUserHelpers = () => {
	const getStatusVariant = useUserStatusVariant();
	const formatStatus = useFormatStatus();

	return useMemo(
		() => ({
			getStatusVariant,
			formatStatus,
		}),
		[getStatusVariant, formatStatus],
	);
};
