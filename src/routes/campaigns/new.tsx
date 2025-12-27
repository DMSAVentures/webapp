import { createFileRoute } from "@tanstack/react-router";
import { NewCampaignPage } from "@/features/campaigns/components/NewCampaignPage/component";

export const Route = createFileRoute("/campaigns/new")({
	component: RouteComponent,
});

function RouteComponent() {
	return <NewCampaignPage />;
}
