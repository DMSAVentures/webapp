/**
 * BlastsPage Component
 *
 * Main page for managing email blasts
 */

import { useNavigate } from "@tanstack/react-router";
import { memo, useCallback } from "react";
import type { EmailBlast } from "@/types/blast";
import { BlastList } from "../BlastList/component";
import styles from "./component.module.scss";

export interface BlastsPageProps {
	/** Campaign ID */
	campaignId: string;
}

export const BlastsPage = memo(function BlastsPage({
	campaignId,
}: BlastsPageProps) {
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
		<div className={styles.root}>
			<BlastList
				campaignId={campaignId}
				onCreate={handleCreate}
				onView={handleView}
			/>
		</div>
	);
});

BlastsPage.displayName = "BlastsPage";
