/**
 * User Status Utility Hook
 *
 * Provides utility functions for working with waitlist user statuses
 */

import { useCallback, useMemo } from "react";
import type { WaitlistUserStatus } from "@/types/users.types";

/**
 * Maps waitlist user status to Badge variant
 */
export const useUserStatusVariant = () => {
	return useCallback(
		(
			status: WaitlistUserStatus,
		): "success" | "warning" | "error" | "secondary" => {
			switch (status) {
				case "verified":
				case "active":
					return "success";
				case "pending":
				case "invited":
					return "warning";
				case "rejected":
					return "error";
				default:
					return "warning";
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
