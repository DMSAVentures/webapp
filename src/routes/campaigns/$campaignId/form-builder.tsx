import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ErrorState } from "@/components/error/error";
import { FormBuilder } from "@/features/form-builder/components/FormBuilder/component";
import { useFormConfigFromCampaign } from "@/hooks/useFormConfigFromCampaign";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import Banner from "@/proto-design-system/banner/banner";
import Breadcrumb from "@/proto-design-system/breadcrumb/breadcrumb";
import BreadcrumbItem from "@/proto-design-system/breadcrumb/breadcrumbitem";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import type { FormConfig } from "@/types/common.types";
import styles from "./campaignDetail.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/form-builder")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { data: campaign, loading, error } = useGetCampaign(campaignId);
	const formConfig = useFormConfigFromCampaign(campaign);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saveSuccess, setSaveSuccess] = useState(false);

	const handleSave = async (config: FormConfig) => {
		setSaveError(null);
		setSaveSuccess(false);

		try {
			// Helper function to convert label to valid field name
			const labelToFieldName = (label: string, type: string): string => {
				// Email fields must always be named "email"
				if (type === "email") {
					return "email";
				}

				return label
					.toLowerCase()
					.trim()
					.replace(/\s+/g, "_") // Replace spaces with underscores
					.replace(/[^a-z0-9_]/g, ""); // Remove special characters
			};

			// Serialize the entire design config into custom_css with a special prefix
			const designJson = JSON.stringify(config.design);
			const customCssWithDesign = `__DESIGN__:${designJson}`;

			// Transform UI FormConfig to API FormConfig
			const apiFormConfig = {
				fields: config.fields.map((field) => ({
					name: labelToFieldName(field.label, field.type), // Convert label to field name
					type: field.type,
					label: field.label,
					placeholder: field.placeholder || undefined,
					required: field.required,
					options: field.options,
					validation: field.validation
						? JSON.stringify(field.validation)
						: undefined,
				})),
				captcha_enabled: false,
				double_opt_in: config.behavior?.doubleOptIn || false,
				custom_css: customCssWithDesign,
			};

			// Update campaign with form_config
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						form_config: apiFormConfig,
					}),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to save form configuration");
			}

			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3000);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to save form configuration";
			setSaveError(errorMessage);
		}
	};

	if (loading) {
		return (
			<LoadingSpinner
				size="large"
				mode="centered"
				message="Loading campaign..."
			/>
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
					initialConfig={formConfig || undefined}
					onSave={handleSave}
				/>
			</div>
		</motion.div>
	);
}
