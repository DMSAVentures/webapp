import { createFileRoute } from "@tanstack/react-router";
import { CampaignsListPage } from "@/features/campaigns/components/CampaignsListPage/component";

export const Route = createFileRoute("/campaigns/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <CampaignsListPage />;
}
