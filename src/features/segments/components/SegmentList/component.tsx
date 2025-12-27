/**
 * SegmentList Component
 *
 * Displays a list of segments for a campaign in a table format
 */

import { memo, useCallback, useState } from "react";
import {
	useDeleteSegment,
	useGetSegments,
	useRefreshSegment,
} from "@/hooks/useSegments";
import { Button } from "@/proto-design-system/Button/button";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import Modal from "@/proto-design-system/modal/modal";
import { Table } from "@/proto-design-system/Table";
import type { Segment } from "@/types/segment";
import styles from "./component.module.scss";

export interface SegmentListProps {
	/** Campaign ID */
	campaignId: string;
	/** Callback when segment is selected for editing */
	onEdit?: (segment: Segment) => void;
	/** Callback when create segment is clicked */
	onCreate?: () => void;
	/** Callback when segment is selected for blast */
	onCreateBlast?: (segment: Segment) => void;
}

export const SegmentList = memo(function SegmentList({
	campaignId,
	onEdit,
	onCreate,
	onCreateBlast,
}: SegmentListProps) {
	const { segments, loading, error, refetch } = useGetSegments(campaignId);
	const { deleteSegment, loading: deleting } = useDeleteSegment();
	const { refreshSegment, loading: refreshing } = useRefreshSegment();
	const [refreshingId, setRefreshingId] = useState<string | null>(null);
	const [segmentToDelete, setSegmentToDelete] = useState<Segment | null>(null);

	const handleDeleteClick = useCallback((segment: Segment) => {
		setSegmentToDelete(segment);
	}, []);

	const handleDeleteConfirm = useCallback(async () => {
		if (!segmentToDelete) return;
		const success = await deleteSegment(campaignId, segmentToDelete.id);
		if (success) {
			refetch();
		}
		setSegmentToDelete(null);
	}, [campaignId, deleteSegment, refetch, segmentToDelete]);

	const handleDeleteCancel = useCallback(() => {
		setSegmentToDelete(null);
	}, []);

	const handleRefresh = useCallback(
		async (segment: Segment) => {
			setRefreshingId(segment.id);
			await refreshSegment(campaignId, segment.id);
			setRefreshingId(null);
			refetch();
		},
		[campaignId, refreshSegment, refetch],
	);

	const formatDate = (date: Date | undefined) => {
		if (!date) return "Never";
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	if (error) {
		return (
			<div className={styles.root}>
				<div className={styles.error}>
					Error loading segments: {error.error}
				</div>
			</div>
		);
	}

	return (
		<div className={styles.root}>
			<div className={styles.header}>
				<div className={styles.headerText}>
					<h2 className={styles.title}>Segments</h2>
					<p className={styles.subtitle}>
						Create reusable audience segments for targeted email blasts
					</p>
				</div>
				<Button variant="primary" onClick={onCreate}>
					Create Segment
				</Button>
			</div>

			{!loading && segments.length === 0 ? (
				<div className={styles.emptyState}>
					<div className={styles.emptyContent}>
						<i className="ri-group-line" aria-hidden="true" />
						<h3>No segments yet</h3>
						<p>
							Create your first segment to start targeting specific audiences
						</p>
						<Button variant="secondary" onClick={onCreate}>
							Create Segment
						</Button>
					</div>
				</div>
			) : (
				<Table
					loading={loading}
					loadingMessage="Loading segments..."
					minWidth="700px"
				>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Users</Table.HeaderCell>
							<Table.HeaderCell>Last Updated</Table.HeaderCell>
							<Table.HeaderCell>Actions</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{segments.map((segment) => (
							<Table.Row key={segment.id}>
								<Table.Cell>
									<div className={styles.nameCell}>
										<span className={styles.segmentName}>{segment.name}</span>
										{segment.description && (
											<span className={styles.segmentDescription}>
												{segment.description}
											</span>
										)}
									</div>
								</Table.Cell>
								<Table.Cell>
									{(segment.cachedUserCount ?? 0).toLocaleString()}
								</Table.Cell>
								<Table.Cell>{formatDate(segment.cachedAt)}</Table.Cell>
								<Table.Cell fitContent>
									<div className={styles.actions}>
										<IconOnlyButton
											iconClass={
												refreshing && refreshingId === segment.id
													? "loader-4-line"
													: "refresh-line"
											}
											variant="secondary"
											ariaLabel="Refresh count"
											onClick={() => handleRefresh(segment)}
											disabled={refreshing && refreshingId === segment.id}
										/>
										<IconOnlyButton
											iconClass="edit-line"
											variant="secondary"
											ariaLabel="Edit segment"
											onClick={() => onEdit?.(segment)}
										/>
										<IconOnlyButton
											iconClass="mail-send-line"
											variant="secondary"
											ariaLabel="Create blast"
											onClick={() => onCreateBlast?.(segment)}
										/>
										<IconOnlyButton
											iconClass="delete-bin-line"
											variant="secondary"
											ariaLabel="Delete segment"
											onClick={() => handleDeleteClick(segment)}
											disabled={deleting}
										/>
									</div>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			)}

			<Modal
				isOpen={!!segmentToDelete}
				title="Delete Segment"
				description={`Are you sure you want to delete "${segmentToDelete?.name}"? This action cannot be undone.`}
				icon="warning"
				proceedText={deleting ? "Deleting..." : "Delete"}
				cancelText="Cancel"
				onProceed={handleDeleteConfirm}
				onCancel={handleDeleteCancel}
				onClose={handleDeleteCancel}
			/>
		</div>
	);
});

SegmentList.displayName = "SegmentList";
