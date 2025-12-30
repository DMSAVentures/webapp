/**
 * SegmentList Component
 *
 * Displays a list of segments for a campaign in a table format
 */

import { AlertTriangle, Loader2, Pencil, RefreshCw, Send, Trash2, Users } from "lucide-react";
import { memo, useCallback, useState } from "react";
import {
	useDeleteSegment,
	useGetSegments,
	useRefreshSegment,
} from "@/hooks/useSegments";
import {
	Button,
	Modal,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/proto-design-system";
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
						<Users size={48} />
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
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Users</TableHead>
							<TableHead>Last Updated</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{segments.map((segment) => (
							<TableRow key={segment.id}>
								<TableCell>
									<div className={styles.nameCell}>
										<span className={styles.segmentName}>{segment.name}</span>
										{segment.description && (
											<span className={styles.segmentDescription}>
												{segment.description}
											</span>
										)}
									</div>
								</TableCell>
								<TableCell>
									{(segment.cachedUserCount ?? 0).toLocaleString()}
								</TableCell>
								<TableCell>{formatDate(segment.cachedAt)}</TableCell>
								<TableCell>
									<div className={styles.actions}>
										<Button
											variant="secondary"
											isIconOnly
											leftIcon={
												refreshing && refreshingId === segment.id
													? <Loader2 />
													: <RefreshCw />
											}
											aria-label="Refresh count"
											onClick={() => handleRefresh(segment)}
											disabled={refreshing && refreshingId === segment.id}
										/>
										<Button
											variant="secondary"
											isIconOnly
											leftIcon={<Pencil />}
											aria-label="Edit segment"
											onClick={() => onEdit?.(segment)}
										/>
										<Button
											variant="secondary"
											isIconOnly
											leftIcon={<Send />}
											aria-label="Create blast"
											onClick={() => onCreateBlast?.(segment)}
										/>
										<Button
											variant="secondary"
											isIconOnly
											leftIcon={<Trash2 />}
											aria-label="Delete segment"
											onClick={() => handleDeleteClick(segment)}
											disabled={deleting}
										/>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			<Modal
				isOpen={!!segmentToDelete}
				title="Delete Segment"
				description={`Are you sure you want to delete "${segmentToDelete?.name}"? This action cannot be undone.`}
				icon={<AlertTriangle />}
				onClose={handleDeleteCancel}
				footer={
					<>
						<Button variant="secondary" onClick={handleDeleteCancel} disabled={deleting}>
							Cancel
						</Button>
						<Button variant="primary" onClick={handleDeleteConfirm} disabled={deleting}>
							{deleting ? "Deleting..." : "Delete"}
						</Button>
					</>
				}
			>
				<></>
			</Modal>
		</div>
	);
});

SegmentList.displayName = "SegmentList";
