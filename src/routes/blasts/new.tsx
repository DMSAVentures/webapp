import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { BlastWizard } from "@/features/blasts/components/BlastWizard/component";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Select } from "@/proto-design-system/components/forms/Select";
import { LinkButton } from "@/proto-design-system/components/primitives/Button";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import styles from "./index.module.scss";

interface BlastNewSearch {
	campaignId?: string;
	segmentId?: string;
}

export const Route = createFileRoute("/blasts/new")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>): BlastNewSearch => ({
		campaignId: (search.campaignId as string) || undefined,
		segmentId: (search.segmentId as string) || undefined,
	}),
});

function RouteComponent() {
	const { campaignId: searchCampaignId, segmentId } = Route.useSearch();
	const { data, loading } = useGetCampaigns();
	const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
		searchCampaignId || "",
	);

	// Set campaign from search or first campaign as default when data loads
	if (!selectedCampaignId && data?.campaigns?.length) {
		setSelectedCampaignId(searchCampaignId || data.campaigns[0].id);
	}

	if (loading) {
		return <Spinner size="lg" label="Loading campaigns..." />;
	}

	if (!data?.campaigns?.length) {
		return (
			<motion.div
				className={styles.page}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<EmptyState
					icon={<Send />}
					title="No campaigns"
					description="Create a campaign first to create email blasts."
					action={
						<LinkButton variant="primary" href="/campaigns/new">
							Create Campaign
						</LinkButton>
					}
				/>
			</motion.div>
		);
	}

	const campaignOptions = data.campaigns.map((c) => ({
		value: c.id,
		label: c.name,
	}));

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div className={styles.headerContent}>
					<h1 className={styles.pageTitle}>Create Email Blast</h1>
					<p className={styles.pageDescription}>
						Configure and send a new email blast to your audience
					</p>
				</div>
			</div>

			<div className={styles.campaignSelector}>
				<Select
					id="campaign-select"
					label="Campaign"
					value={selectedCampaignId}
					onChange={(e) => setSelectedCampaignId(e.target.value)}
					options={campaignOptions}
				/>
			</div>

			{selectedCampaignId && (
				<div className={styles.pageContent}>
					<BlastWizard campaignId={selectedCampaignId} segmentId={segmentId} />
				</div>
			)}
		</motion.div>
	);
}
