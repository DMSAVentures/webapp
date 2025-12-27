import { createFileRoute } from "@tanstack/react-router";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { FormBuilderPage } from "@/features/form-builder/components/FormBuilderPage/component";

export const Route = createFileRoute("/campaigns/$campaignId/form-builder")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign } = useCampaignContext();

	if (!campaign) {
		return null;
	}

	return <FormBuilderPage campaignId={campaignId} campaign={campaign} />;
}
