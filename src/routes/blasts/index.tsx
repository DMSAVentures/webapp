import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Plus, Send } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { useTier } from "@/contexts/tier";
import { BlastList } from "@/features/blasts/components/BlastList/component";
import { useGetBlasts } from "@/hooks/useBlasts";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Banner } from "@/proto-design-system/components/feedback/Banner";
import { Select } from "@/proto-design-system/components/forms/Select";
import {
	Button,
	LinkButton,
} from "@/proto-design-system/components/primitives/Button";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import type { EmailBlast } from "@/types/blast";
import styles from "./index.module.scss";

export const Route = createFileRoute("/blasts/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { isAtLeast } = useTier();
	const isPro = isAtLeast("pro");

	const { data, loading: loadingCampaigns } = useGetCampaigns();
	const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

	// Set first campaign as default when data loads
	if (!selectedCampaignId && data?.campaigns?.length) {
		setSelectedCampaignId(data.campaigns[0].id);
	}

	const { blasts, loading: loadingBlasts } = useGetBlasts(selectedCampaignId);

	const handleCreate = useCallback(() => {
		navigate({
			to: "/blasts/new",
			search: { campaignId: selectedCampaignId },
		});
	}, [navigate, selectedCampaignId]);

	const handleView = useCallback(
		(blast: EmailBlast) => {
			navigate({
				to: "/blasts/$blastId",
				params: { blastId: blast.id },
				search: { campaignId: selectedCampaignId },
			});
		},
		[navigate, selectedCampaignId],
	);

	// Show gated empty state for free tier users
	if (!isPro) {
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
				<Banner
					type="feature"
					variant="lighter"
					title="Team Feature"
					description="Upgrade to Team to send email blasts to your audience."
					action={<a href="/billing/plans">Upgrade</a>}
					dismissible={false}
				/>
				<EmptyState
					icon={<Send />}
					title="Email Blasts"
					description="Send targeted emails to your audience segments. This feature is available on the Team plan."
					action={
						<LinkButton variant="primary" href="/billing/plans">
							Upgrade to Team
						</LinkButton>
					}
				/>
			</motion.div>
		);
	}

	if (loadingCampaigns) {
		return <Spinner size="lg" label="Loading campaigns..." />;
	}

	if (!data?.campaigns?.length) {
		return (
			<motion.div
				className={styles.page}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<EmptyState
					icon={<Send />}
					title="No campaigns"
					description="Create a campaign first to manage email blasts."
					action={
						<LinkButton variant="primary" href="/campaigns/new">
							Create Campaign
						</LinkButton>
					}
				/>
			</motion.div>
		);
	}

	const campaignOptions = data.campaigns.map((c) => ({
		value: c.id,
		label: c.name,
	}));

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

		return (
			<BlastList
				campaignId={selectedCampaignId}
				onCreate={handleCreate}
				onView={handleView}
				hideHeader
			/>
		);
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

			<div className={styles.campaignSelector}>
				<Select
					id="campaign-select"
					label="Campaign"
					value={selectedCampaignId}
					onChange={(e) => setSelectedCampaignId(e.target.value)}
					options={campaignOptions}
				/>
			</div>

			{selectedCampaignId && (
				<div className={styles.pageContent}>{renderContent()}</div>
			)}
		</motion.div>
	);
}
