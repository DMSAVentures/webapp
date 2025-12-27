import { createFileRoute } from "@tanstack/react-router";
import { PublicFormEmbed } from "@/features/form-builder/components/PublicFormEmbed/component";

export const Route = createFileRoute("/embed/$campaignId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();

	return <PublicFormEmbed campaignId={campaignId} />;
}
