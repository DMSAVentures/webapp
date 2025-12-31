import { createFileRoute } from "@tanstack/react-router";
import { EditEmailTemplatePage } from "@/features/email-builder/components/EditEmailTemplatePage/component";

export const Route = createFileRoute("/email-templates/$templateId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { templateId } = Route.useParams();
	return <EditEmailTemplatePage templateId={templateId} />;
}
