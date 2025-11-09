/**
 * Campaign Status Utility Hook
 *
 * Provides utility functions for working with campaign statuses
 */

import { useCallback, useMemo } from "react";
import type { CampaignStatus, CampaignType } from "@/types/campaign";

/**
 * Maps campaign status to Badge color variant
 */
export const useCampaignStatusVariant = () => {
	return useCallback((status: CampaignStatus) => {
		switch (status) {
			case "active":
				return "green";
			case "paused":
				return "orange";
			case "completed":
				return "blue";
			case "draft":
			default:
				return "gray";
		}
	}, []);
};

/**
 * Gets display label for campaign type
 */
export const useCampaignTypeLabel = () => {
	return useCallback((type: CampaignType) => {
		switch (type) {
			case "waitlist":
				return "Waitlist";
			case "referral":
				return "Referral";
			case "contest":
				return "Contest";
			default:
				return type;
		}
	}, []);
};

/**
 * Combined hook that provides all campaign status utilities
 */
export const useCampaignHelpers = () => {
	const getStatusVariant = useCampaignStatusVariant();
	const getTypeLabel = useCampaignTypeLabel();

	return useMemo(
		() => ({
			getStatusVariant,
			getTypeLabel,
		}),
		[getStatusVariant, getTypeLabel],
	);
};
