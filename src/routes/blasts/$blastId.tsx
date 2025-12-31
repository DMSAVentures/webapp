import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { BlastDetail } from "@/features/blasts/components/BlastDetail/component";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Select } from "@/proto-design-system/components/forms/Select";
import { LinkButton } from "@/proto-design-system/components/primitives/Button";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import styles from "./index.module.scss";

interface BlastDetailSearch {
	campaignId?: string;
}

export const Route = createFileRoute("/blasts/$blastId")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>): BlastDetailSearch => ({
		campaignId: (search.campaignId as string) || undefined,
	}),
});

function RouteComponent() {
	const { blastId } = Route.useParams();
	const { campaignId: searchCampaignId } = Route.useSearch();
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
					description="Create a campaign first to view blast details."
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
				<BlastDetail campaignId={selectedCampaignId} blastId={blastId} />
			)}
		</motion.div>
	);
}
