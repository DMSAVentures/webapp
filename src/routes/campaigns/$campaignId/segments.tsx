import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useTier } from "@/contexts/tier";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { SegmentsPage } from "@/features/segments/components/SegmentsPage/component";

export const Route = createFileRoute("/campaigns/$campaignId/segments")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign } = useCampaignContext();
	const { isAtLeast } = useTier();

	// Gate access to pro tier
	if (!isAtLeast("pro")) {
		return <Navigate to="/billing/plans" />;
	}

	if (!campaign) {
		return null;
	}

	return <SegmentsPage campaignId={campaignId} />;
}
