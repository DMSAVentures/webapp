import { createFileRoute } from "@tanstack/react-router";
import { NewEmailTemplatePage } from "@/features/email-builder/components/NewEmailTemplatePage/component";

export const Route = createFileRoute("/email-templates/new")({
	component: RouteComponent,
});

function RouteComponent() {
	return <NewEmailTemplatePage />;
}
