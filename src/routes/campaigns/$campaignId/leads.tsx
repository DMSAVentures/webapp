import { createFileRoute } from "@tanstack/react-router";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { LeadsPage } from "@/features/users/components/LeadsPage/component";

export const Route = createFileRoute("/campaigns/$campaignId/leads")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign } = useCampaignContext();

	if (!campaign) {
		return null;
	}

	return <LeadsPage campaignId={campaignId} campaign={campaign} />;
}
