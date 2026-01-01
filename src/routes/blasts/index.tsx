import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Plus, Send } from "lucide-react";
import { useCallback } from "react";
import { GatedEmptyState } from "@/components/gating";
import { BlastList } from "@/features/blasts/components/BlastList/component";
import { useGetBlasts } from "@/hooks/useBlasts";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { EmailBlast } from "@/types/blast";
import styles from "./index.module.scss";

export const Route = createFileRoute("/blasts/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { hasAccess } = useFeatureAccess("email_blasts");

	// Blasts are now account-level, no campaign selection needed
	const { blasts, loading: loadingBlasts } = useGetBlasts();

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

	// Show gated empty state for users without access
	if (!hasAccess) {
		return (
			<Stack gap="lg" className={styles.page} animate>
				<Stack gap="xs">
					<Text as="h1" size="2xl" weight="bold">
						Email Blasts
					</Text>
					<Text color="muted">
						Send targeted email campaigns to your audience segments
					</Text>
				</Stack>
				<GatedEmptyState
					feature="email_blasts"
					icon={<Send />}
					title="Email Blasts"
					description="Send targeted emails to your audience segments."
					bannerDescription="Upgrade to Team to send email blasts to your audience."
				/>
			</Stack>
		);
	}

	const renderContent = () => {
		if (loadingBlasts) {
			return <Spinner size="lg" label="Loading blasts..." />;
		}

		if (!blasts || blasts.length === 0) {
			return (
				<EmptyState
					icon={<Mail />}
					title="No email blasts yet"
					description="Create your first email blast to reach your audience."
					action={
						<Button variant="primary" onClick={handleCreate}>
							Create Blast
						</Button>
					}
				/>
			);
		}

		return <BlastList onCreate={handleCreate} onView={handleView} hideHeader />;
	};

	return (
		<Stack gap="lg" className={styles.page} animate>
			<Stack direction="row" justify="between" align="start" wrap>
				<Stack gap="xs">
					<Text as="h1" size="2xl" weight="bold">
						Email Blasts
					</Text>
					<Text color="muted">
						Send targeted email campaigns to your audience segments
					</Text>
				</Stack>
				{blasts && blasts.length > 0 && (
					<Button
						variant="primary"
						leftIcon={<Plus size={16} />}
						onClick={handleCreate}
					>
						Create Blast
					</Button>
				)}
			</Stack>

			<div className={styles.pageContent}>{renderContent()}</div>
		</Stack>
	);
}
