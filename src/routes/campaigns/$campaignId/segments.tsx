import { createFileRoute } from "@tanstack/react-router";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { SegmentsPage } from "@/features/segments/components/SegmentsPage/component";

export const Route = createFileRoute("/campaigns/$campaignId/segments")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign } = useCampaignContext();

	if (!campaign) {
		return null;
	}

	return <SegmentsPage campaignId={campaignId} />;
}
