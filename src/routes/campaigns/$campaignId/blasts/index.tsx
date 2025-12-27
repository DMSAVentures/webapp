import { createFileRoute } from "@tanstack/react-router";
import { BlastsPage } from "@/features/blasts/components/BlastsPage/component";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";

export const Route = createFileRoute("/campaigns/$campaignId/blasts/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign } = useCampaignContext();

	if (!campaign) {
		return null;
	}

	return <BlastsPage campaignId={campaignId} />;
}
