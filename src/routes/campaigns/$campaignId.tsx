import { createFileRoute, Outlet } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ErrorState } from "@/components/error/error";
import { CampaignTabNav } from "@/features/campaigns/components/CampaignTabNav/component";
import { CampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import { Breadcrumb } from "@/proto-design-system/components/navigation/Breadcrumb";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import styles from "./$campaignId/campaignLayout.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId")({
	component: CampaignLayout,
});

function CampaignLayout() {
	const { campaignId } = Route.useParams();
	const {
		data: campaign,
		loading,
		error,
		refetch,
	} = useGetCampaign(campaignId);

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

	return (
		<CampaignContext.Provider value={{ campaign, loading, error, refetch }}>
			<motion.div
				className={styles.layout}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<header className={styles.header}>
					<Breadcrumb
						items={[
							{ label: "Campaigns", href: "/campaigns" },
							{ label: campaign.name },
						]}
					/>
					<CampaignTabNav campaignId={campaignId} />
				</header>

				<main className={styles.content}>
					<Outlet />
				</main>
			</motion.div>
		</CampaignContext.Provider>
	);
}
