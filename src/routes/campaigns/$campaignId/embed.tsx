import { createFileRoute } from "@tanstack/react-router";
import { EmbedCodePage } from "@/features/campaigns/components/EmbedCodePage/component";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";

export const Route = createFileRoute("/campaigns/$campaignId/embed")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign } = useCampaignContext();

	if (!campaign) {
		return null;
	}

	return <EmbedCodePage campaignId={campaignId} campaign={campaign} />;
}
