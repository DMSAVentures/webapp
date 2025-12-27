import { createFileRoute } from "@tanstack/react-router";
import { BlastDetail } from "@/features/blasts/components/BlastDetail/component";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";

export const Route = createFileRoute("/campaigns/$campaignId/blasts/$blastId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId, blastId } = Route.useParams();
	const { campaign } = useCampaignContext();

	if (!campaign) {
		return null;
	}

	return <BlastDetail campaignId={campaignId} blastId={blastId} />;
}
