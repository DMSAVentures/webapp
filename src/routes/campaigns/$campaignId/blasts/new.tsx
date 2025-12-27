import { createFileRoute } from "@tanstack/react-router";
import { BlastWizard } from "@/features/blasts/components/BlastWizard/component";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";

interface BlastNewSearch {
	segmentId?: string;
}

export const Route = createFileRoute("/campaigns/$campaignId/blasts/new")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>): BlastNewSearch => ({
		segmentId: (search.segmentId as string) || undefined,
	}),
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { segmentId } = Route.useSearch();
	const { campaign } = useCampaignContext();

	if (!campaign) {
		return null;
	}

	return <BlastWizard campaignId={campaignId} segmentId={segmentId} />;
}
