import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { FormBuilderPage } from "@/features/form-builder/components/FormBuilderPage/component";

export const Route = createFileRoute("/campaigns/$campaignId/form-builder")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign } = useCampaignContext();
	const navigate = useNavigate();

	const handleCancel = useCallback(() => {
		navigate({ to: "/campaigns/$campaignId", params: { campaignId } });
	}, [navigate, campaignId]);

	if (!campaign) {
		return null;
	}

	return (
		<FormBuilderPage
			campaignId={campaignId}
			campaign={campaign}
			onCancel={handleCancel}
		/>
	);
}
