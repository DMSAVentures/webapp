/**
 * BlastDetail Component
 *
 * Display details and analytics for an email blast
 */

import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { memo, useCallback, useEffect } from "react";
import {
	useCancelBlast,
	useGetBlast,
	useGetBlastAnalytics,
	usePauseBlast,
	useResumeBlast,
	useSendBlast,
} from "@/hooks/useBlasts";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Progress } from "@/proto-design-system/components/feedback/Progress";
import type { EmailBlastStatus } from "@/types/blast";
import styles from "./component.module.scss";

export interface BlastDetailProps {
	/** Campaign ID */
	campaignId: string;
	/** Blast ID */
	blastId: string;
}

const STATUS_VARIANTS: Record<
	EmailBlastStatus,
	"secondary" | "primary" | "warning" | "error" | "success"
> = {
	draft: "secondary",
	scheduled: "primary",
	processing: "warning",
	sending: "warning",
	completed: "success",
	paused: "secondary",
	cancelled: "secondary",
	failed: "error",
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

export const BlastDetail = memo(function BlastDetail({
	campaignId,
	blastId,
}: BlastDetailProps) {
	const navigate = useNavigate();

	const { blast, loading, error, refetch } = useGetBlast(campaignId, blastId);
	const { analytics, refetch: refetchAnalytics } = useGetBlastAnalytics(
		campaignId,
		blastId,
	);
	const { sendBlast, loading: sending } = useSendBlast();
	const { pauseBlast, loading: pausing } = usePauseBlast();
	const { resumeBlast, loading: resuming } = useResumeBlast();
	const { cancelBlast, loading: cancelling } = useCancelBlast();

	// Refresh data periodically when sending
	useEffect(() => {
		if (blast?.status === "sending" || blast?.status === "processing") {
			const interval = setInterval(() => {
				refetch();
				refetchAnalytics();
			}, 5000);
			return () => clearInterval(interval);
		}
	}, [blast?.status, refetch, refetchAnalytics]);

	const handleBack = useCallback(() => {
		navigate({
			to: "/campaigns/$campaignId/blasts",
			params: { campaignId },
		});
	}, [navigate, campaignId]);

	const handleSend = useCallback(async () => {
		if (window.confirm("Are you sure you want to send this blast now?")) {
			await sendBlast(campaignId, blastId);
			refetch();
		}
	}, [campaignId, blastId, sendBlast, refetch]);

	const handlePause = useCallback(async () => {
		await pauseBlast(campaignId, blastId);
		refetch();
	}, [campaignId, blastId, pauseBlast, refetch]);

	const handleResume = useCallback(async () => {
		await resumeBlast(campaignId, blastId);
		refetch();
	}, [campaignId, blastId, resumeBlast, refetch]);

	const handleCancel = useCallback(async () => {
		if (window.confirm("Are you sure you want to cancel this blast?")) {
			await cancelBlast(campaignId, blastId);
			refetch();
		}
	}, [campaignId, blastId, cancelBlast, refetch]);

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

	const getProgress = () => {
		if (!blast || blast.totalRecipients === 0) return 0;
		return Math.round((blast.sentCount / blast.totalRecipients) * 100);
	};

	if (loading) {
		return (
			<div className={styles.root}>
				<div className={styles.loading}>Loading blast details...</div>
			</div>
		);
	}

	if (error || !blast) {
		return (
			<div className={styles.root}>
				<div className={styles.error}>
					Error loading blast: {error?.error || "Blast not found"}
				</div>
			</div>
		);
	}

	return (
		<div className={styles.root}>
			<div className={styles.header}>
				<Button variant="secondary" onClick={handleBack} leftIcon={<ArrowLeft size={16} />}>
					Back to Blasts
				</Button>
				<div className={styles.headerContent}>
					<div className={styles.headerInfo}>
						<h2 className={styles.title}>{blast.name}</h2>
						<p className={styles.subject}>{blast.subject}</p>
					</div>
					<Badge variant={STATUS_VARIANTS[blast.status]}>
						{STATUS_LABELS[blast.status]}
					</Badge>
				</div>
			</div>

			{(blast.status === "sending" || blast.status === "processing") && (
				<div className={styles.progressCard}>
					<div className={styles.progressHeader}>
						<span className={styles.progressTitle}>Sending Progress</span>
						<span className={styles.progressPercent}>{getProgress()}%</span>
					</div>
					<Progress
						value={getProgress()}
						size="md"
						variant="default"
					/>
					<div className={styles.progressStats}>
						<span>{(blast.sentCount ?? 0).toLocaleString()} sent</span>
						<span>
							of {(blast.totalRecipients ?? 0).toLocaleString()} recipients
						</span>
					</div>
				</div>
			)}

			<div className={styles.content}>
				<div className={styles.statsCard}>
					<h3 className={styles.sectionTitle}>Analytics</h3>
					<div className={styles.statsGrid}>
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
								{(blast.deliveredCount ?? 0).toLocaleString()}
							</span>
							<span className={styles.statLabel}>Delivered</span>
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
						<div className={styles.stat}>
							<span className={styles.statValue}>
								{(blast.bouncedCount ?? 0).toLocaleString()}
							</span>
							<span className={styles.statLabel}>Bounced</span>
						</div>
					</div>
					{analytics && (
						<div className={styles.rates}>
							<div className={styles.rate}>
								<span className={styles.rateValue}>
									{analytics.openRate.toFixed(1)}%
								</span>
								<span className={styles.rateLabel}>Open Rate</span>
							</div>
							<div className={styles.rate}>
								<span className={styles.rateValue}>
									{analytics.clickRate.toFixed(1)}%
								</span>
								<span className={styles.rateLabel}>Click Rate</span>
							</div>
							<div className={styles.rate}>
								<span className={styles.rateValue}>
									{analytics.bounceRate.toFixed(1)}%
								</span>
								<span className={styles.rateLabel}>Bounce Rate</span>
							</div>
						</div>
					)}
				</div>

				<div className={styles.detailsCard}>
					<h3 className={styles.sectionTitle}>Details</h3>
					<div className={styles.detailsList}>
						<div className={styles.detailItem}>
							<span className={styles.detailLabel}>Created</span>
							<span className={styles.detailValue}>
								{formatDate(blast.createdAt)}
							</span>
						</div>
						{blast.scheduledAt && (
							<div className={styles.detailItem}>
								<span className={styles.detailLabel}>Scheduled</span>
								<span className={styles.detailValue}>
									{formatDate(blast.scheduledAt)}
								</span>
							</div>
						)}
						{blast.startedAt && (
							<div className={styles.detailItem}>
								<span className={styles.detailLabel}>Started</span>
								<span className={styles.detailValue}>
									{formatDate(blast.startedAt)}
								</span>
							</div>
						)}
						{blast.completedAt && (
							<div className={styles.detailItem}>
								<span className={styles.detailLabel}>Completed</span>
								<span className={styles.detailValue}>
									{formatDate(blast.completedAt)}
								</span>
							</div>
						)}
						{blast.errorMessage && (
							<div className={styles.detailItem}>
								<span className={styles.detailLabel}>Error</span>
								<span className={styles.detailValue + " " + styles.errorText}>
									{blast.errorMessage}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className={styles.actions}>
				{blast.status === "draft" && (
					<Button variant="primary" onClick={handleSend} disabled={sending}>
						{sending ? "Sending..." : "Send Now"}
					</Button>
				)}
				{blast.status === "scheduled" && (
					<>
						<Button variant="primary" onClick={handleSend} disabled={sending}>
							{sending ? "Sending..." : "Send Now"}
						</Button>
						<Button
							variant="secondary"
							onClick={handleCancel}
							disabled={cancelling}
						>
							{cancelling ? "Cancelling..." : "Cancel"}
						</Button>
					</>
				)}
				{blast.status === "sending" && (
					<Button variant="secondary" onClick={handlePause} disabled={pausing}>
						{pausing ? "Pausing..." : "Pause"}
					</Button>
				)}
				{blast.status === "paused" && (
					<>
						<Button
							variant="primary"
							onClick={handleResume}
							disabled={resuming}
						>
							{resuming ? "Resuming..." : "Resume"}
						</Button>
						<Button
							variant="secondary"
							onClick={handleCancel}
							disabled={cancelling}
						>
							{cancelling ? "Cancelling..." : "Cancel"}
						</Button>
					</>
				)}
			</div>
		</div>
	);
});

BlastDetail.displayName = "BlastDetail";
