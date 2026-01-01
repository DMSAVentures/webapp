import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Plus, Send } from "lucide-react";
import { motion } from "motion/react";
import { useCallback } from "react";
import { GatedEmptyState } from "@/components/gating";
import { BlastList } from "@/features/blasts/components/BlastList/component";
import { useGetBlasts } from "@/hooks/useBlasts";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
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
			<motion.div
				className={styles.page}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<div className={styles.pageHeader}>
					<div className={styles.headerContent}>
						<h1 className={styles.pageTitle}>Email Blasts</h1>
						<p className={styles.pageDescription}>
							Send targeted email campaigns to your audience segments
						</p>
					</div>
				</div>
				<GatedEmptyState
					feature="email_blasts"
					icon={<Send />}
					title="Email Blasts"
					description="Send targeted emails to your audience segments."
					bannerDescription="Upgrade to Team to send email blasts to your audience."
				/>
			</motion.div>
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
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div className={styles.headerContent}>
					<h1 className={styles.pageTitle}>Email Blasts</h1>
					<p className={styles.pageDescription}>
						Send targeted email campaigns to your audience segments
					</p>
				</div>
				{blasts && blasts.length > 0 && (
					<Button
						variant="primary"
						leftIcon={<Plus size={16} />}
						onClick={handleCreate}
					>
						Create Blast
					</Button>
				)}
			</div>

			<div className={styles.pageContent}>{renderContent()}</div>
		</motion.div>
	);
}
