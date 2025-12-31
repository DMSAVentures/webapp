import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { motion } from "motion/react";
import { memo, useCallback, useState } from "react";
import { BlastList } from "@/features/blasts/components/BlastList/component";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Select } from "@/proto-design-system/components/forms/Select";
import { LinkButton } from "@/proto-design-system/components/primitives/Button";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import type { EmailBlast } from "@/types/blast";
import styles from "./index.module.scss";

export const Route = createFileRoute("/blasts/")({
	component: RouteComponent,
});

const BlastsContent = memo(function BlastsContent({
	campaignId,
}: {
	campaignId: string;
}) {
	const navigate = useNavigate();

	const handleCreate = useCallback(() => {
		navigate({
			to: "/blasts/new",
			search: { campaignId },
		});
	}, [navigate, campaignId]);

	const handleView = useCallback(
		(blast: EmailBlast) => {
			navigate({
				to: "/blasts/$blastId",
				params: { blastId: blast.id },
				search: { campaignId },
			});
		},
		[navigate, campaignId],
	);

	return (
		<div className={styles.pageContent}>
			<BlastList
				campaignId={campaignId}
				onCreate={handleCreate}
				onView={handleView}
			/>
		</div>
	);
});

function RouteComponent() {
	const { data, loading } = useGetCampaigns();
	const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

	// Set first campaign as default when data loads
	if (!selectedCampaignId && data?.campaigns?.length) {
		setSelectedCampaignId(data.campaigns[0].id);
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
					description="Create a campaign first to manage email blasts."
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
					<h1 className={styles.pageTitle}>Email Blasts</h1>
					<p className={styles.pageDescription}>
						Send targeted email campaigns to your audience segments
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

			{selectedCampaignId && <BlastsContent campaignId={selectedCampaignId} />}
		</motion.div>
	);
}
