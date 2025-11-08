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

	// Transform API FormConfig to UI FormConfig
	const getInitialFormConfig = (): FormConfig | undefined => {
		if (!campaign?.form_config || !campaign.form_config.fields || campaign.form_config.fields.length === 0) {
			return undefined;
		}

		// Map API fields to UI fields
		const uiFields = campaign.form_config.fields.map((apiField, index) => ({
			id: apiField.name || `field-${index}`,
			type: apiField.type,
			label: apiField.label,
			placeholder: apiField.placeholder || '',
			helpText: '',
			required: apiField.required || false,
			order: index,
			options: apiField.options,
			validation: apiField.validation ? JSON.parse(apiField.validation) : undefined,
		}));

		// Default design config
		const defaultDesign = {
			layout: 'single-column' as const,
			colors: {
				primary: '#3b82f6',
				background: '#ffffff',
				text: '#1f2937',
				border: '#e5e7eb',
				error: '#ef4444',
				success: '#10b981',
			},
			typography: {
				fontFamily: 'Inter, system-ui, sans-serif',
				fontSize: 16,
				fontWeight: 400,
			},
			spacing: {
				padding: 16,
				gap: 16,
			},
			borderRadius: 8,
			customCss: '',
		};

		// Try to parse design from custom_css (we store it as JSON with __DESIGN__ prefix)
		let design = defaultDesign;
		if (campaign.form_config.custom_css) {
			try {
				if (campaign.form_config.custom_css.startsWith('__DESIGN__:')) {
					const designJson = campaign.form_config.custom_css.substring('__DESIGN__:'.length);
					design = JSON.parse(designJson);
				} else {
					// Legacy: just custom CSS without design config
					design = { ...defaultDesign, customCss: campaign.form_config.custom_css };
				}
			} catch (e) {
				// If parsing fails, use default with the CSS as-is
				design = { ...defaultDesign, customCss: campaign.form_config.custom_css };
			}
		}

		return {
			id: `form-${campaignId}`,
			campaignId,
			fields: uiFields,
			design,
			behavior: {
				submitAction: 'inline-message',
				successMessage: 'Thank you for signing up!',
				doubleOptIn: campaign.form_config.double_opt_in || false,
				duplicateHandling: 'block',
			},
		};
	};

	const handleSave = async (config: FormConfig) => {
		setSaveError(null);
		setSaveSuccess(false);

		try {
			// Serialize the entire design config into custom_css with a special prefix
			const designJson = JSON.stringify(config.design);
			const customCssWithDesign = `__DESIGN__:${designJson}`;

			// Transform UI FormConfig to API FormConfig
			const apiFormConfig = {
				fields: config.fields.map(field => ({
					name: field.id, // Use field ID as name
					type: field.type,
					label: field.label,
					placeholder: field.placeholder || undefined,
					required: field.required,
					options: field.options,
					validation: field.validation ? JSON.stringify(field.validation) : undefined,
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
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to save form configuration");
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
					initialConfig={getInitialFormConfig()}
					onSave={handleSave}
				/>
			</div>
		</motion.div>
	);
}
