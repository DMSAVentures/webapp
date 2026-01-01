import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Filter, Plus, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { GatedEmptyState } from "@/components/gating";
import { SegmentBuilder } from "@/features/segments/components/SegmentBuilder/component";
import { SegmentList } from "@/features/segments/components/SegmentList/component";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { useGetSegments } from "@/hooks/useSegments";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Select } from "@/proto-design-system/components/forms/Select";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import {
	Button,
	LinkButton,
} from "@/proto-design-system/components/primitives/Button";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { Segment } from "@/types/segment";
import styles from "./index.module.scss";

export const Route = createFileRoute("/segments/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { hasAccess } = useFeatureAccess("email_blasts");

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
				search: { segmentId: segment.id },
			});
		},
		[navigate],
	);

	// Show gated empty state for users without access
	if (!hasAccess) {
		return (
			<Stack gap="lg" className={styles.page} animate>
				<Stack gap="xs">
					<Text as="h1" size="2xl" weight="bold">
						Segments
					</Text>
					<Text color="muted">
						Create and manage audience segments for targeted email campaigns
					</Text>
				</Stack>
				<GatedEmptyState
					feature="email_blasts"
					icon={<Users />}
					title="Segments"
					description="Create audience segments to target specific groups with your campaigns."
					bannerDescription="Upgrade to Team to create audience segments for targeted campaigns."
				/>
			</Stack>
		);
	}

	if (loadingCampaigns) {
		return <Spinner size="lg" label="Loading campaigns..." />;
	}

	if (!data?.campaigns?.length) {
		return (
			<Stack gap="lg" className={styles.page} animate>
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
			</Stack>
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
		<Stack gap="lg" className={styles.page} animate>
			<Stack direction="row" justify="between" align="start" wrap>
				<Stack gap="xs">
					<Text as="h1" size="2xl" weight="bold">
						Segments
					</Text>
					<Text color="muted">
						Create and manage audience segments for targeted email campaigns
					</Text>
				</Stack>
				{!showBuilder && segments && segments.length > 0 && (
					<Button
						variant="primary"
						leftIcon={<Plus size={16} />}
						onClick={handleCreate}
					>
						Create Segment
					</Button>
				)}
			</Stack>

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
		</Stack>
	);
}
