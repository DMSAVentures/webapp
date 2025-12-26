import { createContext, useContext } from "react";
import type { Campaign } from "@/types/campaign";

interface CampaignContextValue {
	campaign: Campaign | null;
	loading: boolean;
	error: { error: string } | null;
	refetch: () => void;
}

export const CampaignContext = createContext<CampaignContextValue | null>(null);

/**
 * Hook to access the current campaign from context.
 * Must be used within a CampaignContext.Provider.
 */
export const useCampaignContext = () => {
	const context = useContext(CampaignContext);
	if (!context) {
		throw new Error(
			"useCampaignContext must be used within a CampaignContext.Provider",
		);
	}
	return context;
};
