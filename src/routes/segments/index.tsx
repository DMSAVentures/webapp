import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Filter, Plus, Users } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { useTier } from "@/contexts/tier";
import { SegmentBuilder } from "@/features/segments/components/SegmentBuilder/component";
import { SegmentList } from "@/features/segments/components/SegmentList/component";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { useGetSegments } from "@/hooks/useSegments";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Banner } from "@/proto-design-system/components/feedback/Banner";
import { Select } from "@/proto-design-system/components/forms/Select";
import {
	Button,
	LinkButton,
} from "@/proto-design-system/components/primitives/Button";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import type { Segment } from "@/types/segment";
import styles from "./index.module.scss";

export const Route = createFileRoute("/segments/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { isAtLeast } = useTier();
	const isPro = isAtLeast("pro");

	const { data, loading: loadingCampaigns } = useGetCampaigns();
	const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
	const [showBuilder, setShowBuilder] = useState(false);
	const [editingSegment, setEditingSegment] = useState<Segment | null>(null);

	// Set first campaign as default when data loads
	if (!selectedCampaignId && data?.campaigns?.length) {
		setSelectedCampaignId(data.campaigns[0].id);
	}

	const {
		segments,
		loading: loadingSegments,
		refetch,
	} = useGetSegments(selectedCampaignId);

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
		refetch();
	}, [refetch]);

	const handleCreateBlast = useCallback(
		(segment: Segment) => {
			navigate({
				to: "/blasts/new",
				search: { campaignId: selectedCampaignId, segmentId: segment.id },
			});
		},
		[navigate, selectedCampaignId],
	);

	// Show gated empty state for free tier users
	if (!isPro) {
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
				<Banner
					type="feature"
					variant="lighter"
					title="Team Feature"
					description="Upgrade to Team to create audience segments for targeted campaigns."
					action={<a href="/billing/plans">Upgrade</a>}
					dismissible={false}
				/>
				<EmptyState
					icon={<Users />}
					title="Segments"
					description="Create audience segments to target specific groups with your campaigns. This feature is available on the Team plan."
					action={
						<LinkButton variant="primary" href="/billing/plans">
							Upgrade to Team
						</LinkButton>
					}
				/>
			</motion.div>
		);
	}

	if (loadingCampaigns) {
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

	const renderContent = () => {
		if (loadingSegments) {
			return <Spinner size="lg" label="Loading segments..." />;
		}

		if (showBuilder) {
			return (
				<SegmentBuilder
					campaignId={selectedCampaignId}
					segment={editingSegment}
					onClose={handleClose}
					onSave={handleClose}
				/>
			);
		}

		if (!segments || segments.length === 0) {
			return (
				<EmptyState
					icon={<Users />}
					title="No segments yet"
					description="Create your first segment to start targeting specific audiences."
					action={
						<Button variant="primary" onClick={handleCreate}>
							Create Segment
						</Button>
					}
				/>
			);
		}

		return (
			<SegmentList
				campaignId={selectedCampaignId}
				onCreate={handleCreate}
				onEdit={handleEdit}
				onCreateBlast={handleCreateBlast}
				hideHeader
			/>
		);
	};

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
				{!showBuilder && segments && segments.length > 0 && (
					<Button
						variant="primary"
						leftIcon={<Plus size={16} />}
						onClick={handleCreate}
					>
						Create Segment
					</Button>
				)}
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
				<div className={styles.pageContent}>{renderContent()}</div>
			)}
		</motion.div>
	);
}
