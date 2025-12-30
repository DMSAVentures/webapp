import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { ErrorState } from "@/components/error/error";
import { CampaignTabNav } from "@/features/campaigns/components/CampaignTabNav/component";
import { CampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { useGlobalBanner } from "@/contexts/globalBanner";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import { useUpdateCampaignStatus } from "@/hooks/useUpdateCampaignStatus";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Breadcrumb } from "@/proto-design-system/components/navigation/Breadcrumb";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import type { Campaign } from "@/types/campaign";
import styles from "./$campaignId/campaignLayout.module.scss";
import {Divider} from "@/proto-design-system/components/layout/Divider";

export const Route = createFileRoute("/campaigns/$campaignId")({
	component: CampaignLayout,
});

/** Get badge variant based on campaign status */
function getStatusVariant(status: Campaign["status"]): "success" | "warning" | "secondary" | "primary" {
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
	const navigate = useNavigate();
	const { showBanner } = useGlobalBanner();
	const {
		data: campaign,
		loading,
		error,
		refetch,
	} = useGetCampaign(campaignId);
	const { updateStatus, loading: updatingStatus, error: updateError } = useUpdateCampaignStatus();

	// Handle update errors
	useEffect(() => {
		if (updateError) {
			showBanner({
				type: "error",
				title: "Failed to update campaign",
				description: updateError.error,
			});
		}
	}, [updateError, showBanner]);

	const handleGoLive = useCallback(async () => {
		if (!campaign) return;
		const updated = await updateStatus(campaignId, { status: "active" });
		if (updated) {
			showBanner({ type: "success", title: "Campaign is now live!" });
			refetch();
		}
	}, [campaignId, campaign, updateStatus, showBanner, refetch]);

	const handleSaveDraft = useCallback(() => {
		// Navigate to edit page for saving
		navigate({ to: `/campaigns/${campaignId}/edit` });
	}, [navigate, campaignId]);

	if (loading) {
		return (
			<Spinner
				size="lg"
				label="Loading campaign..."
			/>
		);
	}

	if (error) {
		return <ErrorState message={`Failed to load campaign: ${error.error}`} />;
	}

	if (!campaign) {
		return <EmptyState title="Campaign not found" icon="megaphone-line" />;
	}

	const isDraft = campaign.status === "draft";

	return (
		<CampaignContext.Provider value={{ campaign, loading, error, refetch }}>
					<Stack direction={"row"} gap={"2xl"} className={styles.header}>
                        <div>
						<Stack direction="row" gap="sm" align="center">
							<Breadcrumb
								items={[
									{ label: "Campaigns", href: "/campaigns" },
									{ label: campaign.name },
								]}
                                size={'lg'}
							/>
							<Badge variant={getStatusVariant(campaign.status)}>
								{formatStatus(campaign.status)}
							</Badge>
						</Stack>
						{isDraft && (
							<Stack direction="row" gap="sm">
								<Button variant="outline" onClick={handleSaveDraft}>
									Save Draft
								</Button>
								<Button onClick={handleGoLive} disabled={updatingStatus}>
									{updatingStatus ? <Loader2 size={16} className={styles.spin} /> : null}
									Go Live
								</Button>
							</Stack>
						)}
                        </div>
                        <Divider/>
                    <CampaignTabNav campaignId={campaignId} />
                    </Stack>
				<main className={styles.content}>
					<Outlet />
				</main>
		</CampaignContext.Provider>
	);
}
