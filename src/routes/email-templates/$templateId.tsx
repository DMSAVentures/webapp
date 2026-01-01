import { createFileRoute } from "@tanstack/react-router";
import { EditBlastEmailTemplatePage } from "@/features/email-builder/components/EditBlastEmailTemplatePage/component";
import { EditCampaignEmailTemplatePage } from "@/features/email-builder/components/EditCampaignEmailTemplatePage/component";

type TemplateType = "campaign" | "blast";

interface TemplateSearchParams {
	type?: TemplateType;
}

export const Route = createFileRoute("/email-templates/$templateId")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>): TemplateSearchParams => ({
		type: (search.type as TemplateType) || undefined,
	}),
});

function RouteComponent() {
	const { templateId } = Route.useParams();
	const { type } = Route.useSearch();

	if (type === "blast") {
		return <EditBlastEmailTemplatePage templateId={templateId} />;
	}

	// Default to campaign for backwards compatibility (when type is undefined or "campaign")
	return <EditCampaignEmailTemplatePage templateId={templateId} />;
}
