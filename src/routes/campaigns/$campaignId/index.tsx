import { createFileRoute } from "@tanstack/react-router";
import { CampaignOverview } from "@/features/campaigns/components/CampaignOverview/component";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";

export const Route = createFileRoute("/campaigns/$campaignId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign, refetch } = useCampaignContext();

	if (!campaign) {
		return null;
	}

	return (
		<CampaignOverview
			campaignId={campaignId}
			campaign={campaign}
			onRefetch={refetch}
		/>
	);
}
