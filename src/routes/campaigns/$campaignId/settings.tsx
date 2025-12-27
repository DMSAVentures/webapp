import { createFileRoute } from "@tanstack/react-router";
import { CampaignSettings } from "@/features/campaigns/components/CampaignSettings/component";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";

export const Route = createFileRoute("/campaigns/$campaignId/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign, refetch } = useCampaignContext();

	if (!campaign) {
		return null;
	}

	return (
		<CampaignSettings
			campaignId={campaignId}
			campaign={campaign}
			onRefetch={refetch}
		/>
	);
}
