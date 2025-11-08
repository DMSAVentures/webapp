import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import { FormBuilder } from "@/features/form-builder/components/FormBuilder/component";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import { ErrorState } from "@/components/error/error";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import Banner from "@/proto-design-system/banner/banner";
import Breadcrumb from "@/proto-design-system/breadcrumb/breadcrumb";
import BreadcrumbItem from "@/proto-design-system/breadcrumb/breadcrumbitem";
import type { FormConfig } from "@/types/common.types";
import styles from "./campaignDetail.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/form-builder")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { data: campaign, loading, error } = useGetCampaign(campaignId);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saveSuccess, setSaveSuccess] = useState(false);

	const handleSave = async (config: FormConfig) => {
		setSaveError(null);
		setSaveSuccess(false);

		try {
			// TODO: Create API endpoint to save form configuration
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/form`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(config),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to save form configuration");
			}

			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3000);
		} catch (error: any) {
			setSaveError(error.message || "Failed to save form configuration");
		}
	};

	if (loading) {
		return (
			<LoadingSpinner size="large" mode="centered" message="Loading campaign..." />
		);
	}

	if (error) {
		return <ErrorState message={`Failed to load campaign: ${error.error}`} />;
	}

	if (!campaign) {
		return <EmptyState title="Campaign not found" icon="megaphone-line" />;
	}

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div className={styles.headerActions}>
					<Breadcrumb
						items={[
							<BreadcrumbItem key="campaigns" state="default" path="/campaigns">
								Campaigns
							</BreadcrumbItem>,
							<BreadcrumbItem
								key="campaign"
								state="default"
								path={`/campaigns/${campaignId}`}
							>
								{campaign.name}
							</BreadcrumbItem>,
							<BreadcrumbItem key="form-builder" state="active">
								Form Builder
							</BreadcrumbItem>,
						]}
						divider="arrow"
					/>
				</div>
			</div>

			<div className={styles.pageContent}>
				{saveSuccess && (
					<Banner
						bannerType="success"
						variant="filled"
						alertTitle="Form saved successfully!"
						alertDescription="Your waitlist form has been updated."
					/>
				)}

				{saveError && (
					<Banner
						bannerType="error"
						variant="filled"
						alertTitle="Failed to save form"
						alertDescription={saveError}
					/>
				)}

				<FormBuilder
					campaignId={campaignId}
					initialConfig={undefined}
					onSave={handleSave}
				/>
			</div>
		</motion.div>
	);
}
