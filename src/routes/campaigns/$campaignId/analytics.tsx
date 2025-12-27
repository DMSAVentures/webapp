import { createFileRoute } from "@tanstack/react-router";
import { CampaignAnalyticsPage } from "@/features/analytics/components/CampaignAnalyticsPage/component";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";

export const Route = createFileRoute("/campaigns/$campaignId/analytics")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaign } = useCampaignContext();

	if (!campaign) {
		return null;
	}

	return <CampaignAnalyticsPage campaign={campaign} />;
}
