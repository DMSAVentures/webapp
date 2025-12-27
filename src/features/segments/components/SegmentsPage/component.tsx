/**
 * SegmentsPage Component
 *
 * Main page for managing segments
 */

import { useNavigate } from "@tanstack/react-router";
import { memo, useCallback, useState } from "react";
import type { Segment } from "@/types/segment";
import { SegmentBuilder } from "../SegmentBuilder/component";
import { SegmentList } from "../SegmentList/component";
import styles from "./component.module.scss";

export interface SegmentsPageProps {
	/** Campaign ID */
	campaignId: string;
}

export const SegmentsPage = memo(function SegmentsPage({
	campaignId,
}: SegmentsPageProps) {
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
				to: "/campaigns/$campaignId/blasts/new",
				params: { campaignId },
				search: { segmentId: segment.id },
			});
		},
		[navigate, campaignId],
	);

	return (
		<div className={styles.root}>
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

SegmentsPage.displayName = "SegmentsPage";
