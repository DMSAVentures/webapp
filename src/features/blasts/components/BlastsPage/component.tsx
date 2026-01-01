/**
 * BlastsPage Component
 *
 * Main page for managing email blasts (account-level)
 */

import { useNavigate } from "@tanstack/react-router";
import { memo, useCallback } from "react";
import type { EmailBlast } from "@/types/blast";
import { BlastList } from "../BlastList/component";
import styles from "./component.module.scss";

export const BlastsPage = memo(function BlastsPage() {
	const navigate = useNavigate();

	const handleCreate = useCallback(() => {
		navigate({
			to: "/blasts/new",
		});
	}, [navigate]);

	const handleView = useCallback(
		(blast: EmailBlast) => {
			navigate({
				to: "/blasts/$blastId",
				params: { blastId: blast.id },
			});
		},
		[navigate],
	);

	return (
		<div className={styles.root}>
			<BlastList onCreate={handleCreate} onView={handleView} />
		</div>
	);
});

BlastsPage.displayName = "BlastsPage";
