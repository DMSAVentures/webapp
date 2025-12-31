import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Filter } from "lucide-react";
import { motion } from "motion/react";
import { memo, useCallback, useState } from "react";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Select } from "@/proto-design-system/components/forms/Select";
import { LinkButton } from "@/proto-design-system/components/primitives/Button";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import type { Segment } from "@/types/segment";
import { SegmentBuilder } from "@/features/segments/components/SegmentBuilder/component";
import { SegmentList } from "@/features/segments/components/SegmentList/component";
import styles from "./index.module.scss";

export const Route = createFileRoute("/segments/")({
	component: RouteComponent,
});

const SegmentsContent = memo(function SegmentsContent({
	campaignId,
}: {
	campaignId: string;
}) {
	const navigate = useNavigate();
	const [showBuilder, setShowBuilder] = useState(false);
	const [editingSegment, setEditingSegment] = useState<Segment | null>(null);

	const handleCreate = useCallback(() => {
		setEditingSegment(null);
		setShowBuilder(true);
	}, []);

	const handleEdit = useCallback((segment: Segment) => {
		setEditingSegment(segment);
		setShowBuilder(true);
	}, []);

	const handleClose = useCallback(() => {
		setShowBuilder(false);
		setEditingSegment(null);
	}, []);

	const handleCreateBlast = useCallback(
		(segment: Segment) => {
			navigate({
				to: "/blasts/new",
				search: { campaignId, segmentId: segment.id },
			});
		},
		[navigate, campaignId],
	);

	return (
		<div className={styles.pageContent}>
			{showBuilder ? (
				<SegmentBuilder
					campaignId={campaignId}
					segment={editingSegment}
					onClose={handleClose}
					onSave={handleClose}
				/>
			) : (
				<SegmentList
					campaignId={campaignId}
					onCreate={handleCreate}
					onEdit={handleEdit}
					onCreateBlast={handleCreateBlast}
				/>
			)}
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
					icon={<Filter />}
					title="No campaigns"
					description="Create a campaign first to manage segments."
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
					<h1 className={styles.pageTitle}>Segments</h1>
					<p className={styles.pageDescription}>
						Create and manage audience segments for targeted email campaigns
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
				<SegmentsContent campaignId={selectedCampaignId} />
			)}
		</motion.div>
	);
}
