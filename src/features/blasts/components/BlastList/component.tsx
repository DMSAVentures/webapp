/**
 * BlastList Component
 *
 * Displays a list of email blasts for a campaign
 */

import { Eye, Mail, Trash2 } from "lucide-react";
import { memo, useCallback } from "react";
import { useDeleteBlast, useGetBlasts } from "@/hooks/useBlasts";
import { Progress } from "@/proto-design-system/components/feedback/Progress";
import { Card } from "@/proto-design-system/components/layout/Card";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Text } from "@/proto-design-system/components/primitives/Text";
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
			<Stack align="center" justify="center" className={styles.root}>
				<Spinner size="lg" label="Loading blasts..." />
			</Stack>
		);
	}

	if (error) {
		return (
			<Stack align="center" justify="center" className={styles.root}>
				<Text color="error">Error loading blasts: {error.error}</Text>
			</Stack>
		);
	}

	return (
		<Stack gap="lg" className={styles.root}>
			<Stack direction="row" justify="between" align="start" wrap>
				<Stack gap="xs">
					<Text as="h2" size="xl" weight="semibold">
						Email Blasts
					</Text>
					<Text color="secondary">
						Send targeted emails to your audience segments
					</Text>
				</Stack>
				<Button variant="primary" onClick={onCreate}>
					Create Blast
				</Button>
			</Stack>

			{blasts.length === 0 ? (
				<Stack gap="md" align="center" className={styles.emptyState}>
					<Icon icon={Mail} size="2xl" color="muted" />
					<Text as="h3" size="lg" weight="semibold">
						No email blasts yet
					</Text>
					<Text color="secondary">
						Create your first email blast to reach your audience
					</Text>
					<Button variant="secondary" onClick={onCreate}>
						Create Blast
					</Button>
				</Stack>
			) : (
				<Stack gap="md" className={styles.list}>
					{blasts.map((blast) => (
						<Card
							key={blast.id}
							padding="md"
							className={styles.blastCard}
							onClick={() => onView?.(blast)}
						>
							<Stack gap="md">
								<Stack direction="row" justify="between" align="start">
									<Stack gap="xs">
										<Text weight="semibold">{blast.name}</Text>
										<Text size="sm" color="secondary">
											{blast.subject}
										</Text>
									</Stack>
									<Badge variant={STATUS_VARIANTS[blast.status]}>
										{STATUS_LABELS[blast.status]}
									</Badge>
								</Stack>

								{(blast.status === "sending" ||
									blast.status === "processing") && (
									<Stack gap="xs">
										<Progress
											value={getProgress(blast)}
											size="sm"
											variant="default"
										/>
										<Text size="xs" color="muted">
											{(blast.sentCount ?? 0).toLocaleString()} /{" "}
											{(blast.totalRecipients ?? 0).toLocaleString()} sent
										</Text>
									</Stack>
								)}

								<Stack direction="row" gap="lg" className={styles.blastStats}>
									<Stack gap="0" align="center">
										<Text weight="semibold">
											{(blast.totalRecipients ?? 0).toLocaleString()}
										</Text>
										<Text size="xs" color="muted">
											Recipients
										</Text>
									</Stack>
									<Stack gap="0" align="center">
										<Text weight="semibold">
											{(blast.sentCount ?? 0).toLocaleString()}
										</Text>
										<Text size="xs" color="muted">
											Sent
										</Text>
									</Stack>
									<Stack gap="0" align="center">
										<Text weight="semibold">
											{(blast.openedCount ?? 0).toLocaleString()}
										</Text>
										<Text size="xs" color="muted">
											Opened
										</Text>
									</Stack>
									<Stack gap="0" align="center">
										<Text weight="semibold">
											{(blast.clickedCount ?? 0).toLocaleString()}
										</Text>
										<Text size="xs" color="muted">
											Clicked
										</Text>
									</Stack>
								</Stack>

								<Text size="xs" color="muted">
									{blast.scheduledAt ? (
										<>Scheduled: {formatDate(blast.scheduledAt)}</>
									) : blast.startedAt ? (
										<>Started: {formatDate(blast.startedAt)}</>
									) : (
										<>Created: {formatDate(blast.createdAt)}</>
									)}
								</Text>

								<div
									className={styles.blastActions}
									onClick={(e) => e.stopPropagation()}
								>
									<Stack direction="row" gap="sm">
										<Button
											variant="secondary"
											size="sm"
											leftIcon={<Eye size={14} />}
											onClick={() => onView?.(blast)}
										>
											View
										</Button>
										{blast.status === "draft" && (
											<Button
												variant="secondary"
												size="sm"
												leftIcon={<Trash2 size={14} />}
												onClick={() => handleDelete(blast)}
												disabled={deleting}
											>
												Delete
											</Button>
										)}
									</Stack>
								</div>
							</Stack>
						</Card>
					))}
				</Stack>
			)}
		</Stack>
	);
});

BlastList.displayName = "BlastList";
