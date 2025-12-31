import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ErrorState } from "@/components/error/error";
import { CampaignTabNav } from "@/features/campaigns/components/CampaignTabNav/component";
import { CampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Divider } from "@/proto-design-system/components/layout/Divider";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Breadcrumb } from "@/proto-design-system/components/navigation/Breadcrumb";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import type { Campaign } from "@/types/campaign";
import styles from "./$campaignId/campaignLayout.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId")({
	component: CampaignLayout,
});

/** Get badge variant based on campaign status */
function getStatusVariant(
	status: Campaign["status"],
): "success" | "warning" | "secondary" | "primary" {
	switch (status) {
		case "active":
			return "success";
		case "completed":
			return "primary";
		case "paused":
			return "secondary";
		default:
			return "warning";
	}
}

/** Format status text */
function formatStatus(status: string): string {
	return status.charAt(0).toUpperCase() + status.slice(1);
}

function CampaignLayout() {
	const { campaignId } = Route.useParams();
	const {
		data: campaign,
		loading,
		error,
		refetch,
	} = useGetCampaign(campaignId);

	if (loading) {
		return <Spinner size="lg" label="Loading campaign..." />;
	}

	if (error) {
		return <ErrorState message={`Failed to load campaign: ${error.error}`} />;
	}

	if (!campaign) {
		return <EmptyState title="Campaign not found" icon="megaphone-line" />;
	}

	return (
		<CampaignContext.Provider value={{ campaign, loading, error, refetch }}>
			<Stack direction="row" gap="2xl" className={styles.header}>
				<Stack direction="row" gap="sm" align="center">
					<Breadcrumb
						items={[
							{ label: "Campaigns", href: "/campaigns" },
							{ label: campaign.name },
						]}
						size="lg"
					/>
					<Badge variant={getStatusVariant(campaign.status)}>
						{formatStatus(campaign.status)}
					</Badge>
				</Stack>
				<Divider />
				<CampaignTabNav campaignId={campaignId} />
			</Stack>
			<main className={styles.content}>
				<Outlet />
			</main>
		</CampaignContext.Provider>
	);
}
