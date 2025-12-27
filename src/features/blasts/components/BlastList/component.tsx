/**
 * BlastList Component
 *
 * Displays a list of email blasts for a campaign
 */

import { memo, useCallback } from "react";
import { useDeleteBlast, useGetBlasts } from "@/hooks/useBlasts";
import { Button } from "@/proto-design-system/Button/button";
import { Badge } from "@/proto-design-system/badge/badge";
import ProgressBar from "@/proto-design-system/progressbar/progressbar";
import type { EmailBlast, EmailBlastStatus } from "@/types/blast";
import styles from "./component.module.scss";

export interface BlastListProps {
	/** Campaign ID */
	campaignId: string;
	/** Callback when blast is selected for viewing */
	onView?: (blast: EmailBlast) => void;
	/** Callback when create blast is clicked */
	onCreate?: () => void;
}

const STATUS_VARIANTS: Record<
	EmailBlastStatus,
	"gray" | "blue" | "orange" | "red" | "green"
> = {
	draft: "gray",
	scheduled: "blue",
	processing: "orange",
	sending: "orange",
	completed: "green",
	paused: "gray",
	cancelled: "gray",
	failed: "red",
};

const STATUS_LABELS: Record<EmailBlastStatus, string> = {
	draft: "Draft",
	scheduled: "Scheduled",
	processing: "Processing",
	sending: "Sending",
	completed: "Completed",
	paused: "Paused",
	cancelled: "Cancelled",
	failed: "Failed",
};

export const BlastList = memo(function BlastList({
	campaignId,
	onView,
	onCreate,
}: BlastListProps) {
	const { blasts, loading, error, refetch } = useGetBlasts(campaignId);
	const { deleteBlast, loading: deleting } = useDeleteBlast();

	const handleDelete = useCallback(
		async (blast: EmailBlast) => {
			if (window.confirm(`Are you sure you want to delete "${blast.name}"?`)) {
				const success = await deleteBlast(campaignId, blast.id);
				if (success) {
					refetch();
				}
			}
		},
		[campaignId, deleteBlast, refetch],
	);

	const formatDate = (date: Date | undefined) => {
		if (!date) return "-";
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	const getProgress = (blast: EmailBlast) => {
		if (blast.totalRecipients === 0) return 0;
		return Math.round((blast.sentCount / blast.totalRecipients) * 100);
	};

	if (loading) {
		return (
			<div className={styles.root}>
				<div className={styles.loading}>Loading blasts...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.root}>
				<div className={styles.error}>Error loading blasts: {error.error}</div>
			</div>
		);
	}

	return (
		<div className={styles.root}>
			<div className={styles.header}>
				<div className={styles.headerText}>
					<h2 className={styles.title}>Email Blasts</h2>
					<p className={styles.subtitle}>
						Send targeted emails to your audience segments
					</p>
				</div>
				<Button variant="primary" onClick={onCreate}>
					Create Blast
				</Button>
			</div>

			{blasts.length === 0 ? (
				<div className={styles.emptyState}>
					<div className={styles.emptyContent}>
						<i className="ri-mail-send-line" aria-hidden="true" />
						<h3>No email blasts yet</h3>
						<p>Create your first email blast to reach your audience</p>
						<Button variant="secondary" onClick={onCreate}>
							Create Blast
						</Button>
					</div>
				</div>
			) : (
				<div className={styles.list}>
					{blasts.map((blast) => (
						<div
							key={blast.id}
							className={styles.blastCard}
							onClick={() => onView?.(blast)}
						>
							<div className={styles.blastHeader}>
								<div className={styles.blastInfo}>
									<h3 className={styles.blastName}>{blast.name}</h3>
									<p className={styles.blastSubject}>{blast.subject}</p>
								</div>
								<Badge
									variant={STATUS_VARIANTS[blast.status]}
									text={STATUS_LABELS[blast.status]}
								/>
							</div>

							{(blast.status === "sending" ||
								blast.status === "processing") && (
								<div className={styles.progress}>
									<ProgressBar
										progress={getProgress(blast)}
										size="small"
										variant="info"
										showPercentage={false}
									/>
									<span className={styles.progressText}>
										{(blast.sentCount ?? 0).toLocaleString()} /{" "}
										{(blast.totalRecipients ?? 0).toLocaleString()} sent
									</span>
								</div>
							)}

							<div className={styles.blastStats}>
								<div className={styles.stat}>
									<span className={styles.statValue}>
										{(blast.totalRecipients ?? 0).toLocaleString()}
									</span>
									<span className={styles.statLabel}>Recipients</span>
								</div>
								<div className={styles.stat}>
									<span className={styles.statValue}>
										{(blast.sentCount ?? 0).toLocaleString()}
									</span>
									<span className={styles.statLabel}>Sent</span>
								</div>
								<div className={styles.stat}>
									<span className={styles.statValue}>
										{(blast.openedCount ?? 0).toLocaleString()}
									</span>
									<span className={styles.statLabel}>Opened</span>
								</div>
								<div className={styles.stat}>
									<span className={styles.statValue}>
										{(blast.clickedCount ?? 0).toLocaleString()}
									</span>
									<span className={styles.statLabel}>Clicked</span>
								</div>
							</div>

							<div className={styles.blastMeta}>
								{blast.scheduledAt ? (
									<span>Scheduled: {formatDate(blast.scheduledAt)}</span>
								) : blast.startedAt ? (
									<span>Started: {formatDate(blast.startedAt)}</span>
								) : (
									<span>Created: {formatDate(blast.createdAt)}</span>
								)}
							</div>

							<div
								className={styles.blastActions}
								onClick={(e) => e.stopPropagation()}
							>
								<Button
									variant="secondary"
									size="small"
									onClick={() => onView?.(blast)}
								>
									<i className="ri-eye-line" aria-hidden="true" />
									View
								</Button>
								{blast.status === "draft" && (
									<Button
										variant="secondary"
										size="small"
										onClick={() => handleDelete(blast)}
										disabled={deleting}
									>
										<i className="ri-delete-bin-line" aria-hidden="true" />
										Delete
									</Button>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
});

BlastList.displayName = "BlastList";
