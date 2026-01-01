/**
 * SegmentMultiSelect Component
 *
 * Multi-select for choosing segments across campaigns for email blasts.
 * Groups segments by campaign and shows user counts.
 */

import { ChevronDown, ChevronRight, Users } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { useGetSegments } from "@/hooks/useSegments";
import { Checkbox } from "@/proto-design-system/components/forms/Checkbox";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { Campaign } from "@/types/campaign";
import type { Segment } from "@/types/segment";
import styles from "./component.module.scss";

export interface SegmentMultiSelectProps {
	/** Currently selected segment IDs */
	selectedIds: string[];
	/** Callback when selection changes */
	onChange: (segmentIds: string[]) => void;
	/** Optional: Pre-selected campaign ID to expand by default */
	defaultExpandedCampaignId?: string;
	/** Disabled state */
	disabled?: boolean;
}

interface CampaignSegmentsProps {
	campaign: Campaign;
	selectedIds: string[];
	onChange: (segmentIds: string[]) => void;
	defaultExpanded?: boolean;
	disabled?: boolean;
}

const CampaignSegments = memo(function CampaignSegments({
	campaign,
	selectedIds,
	onChange,
	defaultExpanded = false,
	disabled = false,
}: CampaignSegmentsProps) {
	const [expanded, setExpanded] = useState(defaultExpanded);
	const { segments, loading } = useGetSegments(campaign.id);

	const selectedInCampaign = useMemo(
		() => segments.filter((s) => selectedIds.includes(s.id)),
		[segments, selectedIds],
	);

	const allSelected =
		segments.length > 0 && selectedInCampaign.length === segments.length;
	const someSelected =
		selectedInCampaign.length > 0 &&
		selectedInCampaign.length < segments.length;

	const handleToggleAll = useCallback(() => {
		if (allSelected) {
			// Deselect all segments from this campaign
			const newIds = selectedIds.filter(
				(id) => !segments.some((s) => s.id === id),
			);
			onChange(newIds);
		} else {
			// Select all segments from this campaign
			const campaignSegmentIds = segments.map((s) => s.id);
			const otherIds = selectedIds.filter(
				(id) => !segments.some((s) => s.id === id),
			);
			onChange([...otherIds, ...campaignSegmentIds]);
		}
	}, [allSelected, segments, selectedIds, onChange]);

	const handleToggleSegment = useCallback(
		(segment: Segment) => {
			if (selectedIds.includes(segment.id)) {
				onChange(selectedIds.filter((id) => id !== segment.id));
			} else {
				onChange([...selectedIds, segment.id]);
			}
		},
		[selectedIds, onChange],
	);

	const toggleExpanded = useCallback(() => {
		setExpanded((prev) => !prev);
	}, []);

	const totalUsersInCampaign = useMemo(
		() => segments.reduce((sum, s) => sum + (s.cachedUserCount ?? 0), 0),
		[segments],
	);

	const selectedUsersInCampaign = useMemo(
		() =>
			selectedInCampaign.reduce((sum, s) => sum + (s.cachedUserCount ?? 0), 0),
		[selectedInCampaign],
	);

	return (
		<div className={styles.campaignGroup}>
			<button
				type="button"
				className={styles.campaignHeader}
				onClick={toggleExpanded}
				disabled={disabled}
			>
				<span className={styles.expandIcon}>
					{expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
				</span>
				<Checkbox
					checked={allSelected}
					indeterminate={someSelected}
					onChange={handleToggleAll}
					disabled={disabled || loading || segments.length === 0}
					onClick={(e) => e.stopPropagation()}
				/>
				<span className={styles.campaignName}>{campaign.name}</span>
				<span className={styles.campaignStats}>
					{loading ? (
						<Spinner size="sm" />
					) : (
						<>
							<Users size={14} />
							<span>
								{selectedUsersInCampaign > 0
									? `${selectedUsersInCampaign.toLocaleString()} / `
									: ""}
								{totalUsersInCampaign.toLocaleString()}
							</span>
						</>
					)}
				</span>
			</button>

			{expanded && (
				<div className={styles.segmentList}>
					{loading ? (
						<div className={styles.loadingSegments}>
							<Spinner size="sm" label="Loading segments..." />
						</div>
					) : segments.length === 0 ? (
						<Text size="sm" color="muted" className={styles.emptySegments}>
							No segments in this campaign
						</Text>
					) : (
						segments.map((segment) => (
							<label key={segment.id} className={styles.segmentItem}>
								<Checkbox
									checked={selectedIds.includes(segment.id)}
									onChange={() => handleToggleSegment(segment)}
									disabled={disabled}
								/>
								<span className={styles.segmentName}>{segment.name}</span>
								<span className={styles.segmentCount}>
									{(segment.cachedUserCount ?? 0).toLocaleString()} users
								</span>
							</label>
						))
					)}
				</div>
			)}
		</div>
	);
});

export const SegmentMultiSelect = memo(function SegmentMultiSelect({
	selectedIds,
	onChange,
	defaultExpandedCampaignId,
	disabled = false,
}: SegmentMultiSelectProps) {
	const { data: campaignsData, loading: loadingCampaigns } = useGetCampaigns();

	const campaigns = useMemo(
		() => campaignsData?.campaigns ?? [],
		[campaignsData],
	);

	if (loadingCampaigns) {
		return (
			<Stack align="center" justify="center" className={styles.root}>
				<Spinner size="md" label="Loading campaigns..." />
			</Stack>
		);
	}

	if (campaigns.length === 0) {
		return (
			<Stack align="center" justify="center" className={styles.root}>
				<Text color="muted">No campaigns available</Text>
			</Stack>
		);
	}

	return (
		<div className={styles.root}>
			<div className={styles.campaignsList}>
				{campaigns.map((campaign) => (
					<CampaignSegments
						key={campaign.id}
						campaign={campaign}
						selectedIds={selectedIds}
						onChange={onChange}
						defaultExpanded={campaign.id === defaultExpandedCampaignId}
						disabled={disabled}
					/>
				))}
			</div>

			{selectedIds.length > 0 && (
				<div className={styles.selectionSummary}>
					<Text size="sm" weight="medium">
						{selectedIds.length} segment{selectedIds.length !== 1 ? "s" : ""}{" "}
						selected
					</Text>
					<Text size="xs" color="muted">
						Duplicate recipients will be automatically removed when sending
					</Text>
				</div>
			)}
		</div>
	);
});

SegmentMultiSelect.displayName = "SegmentMultiSelect";
