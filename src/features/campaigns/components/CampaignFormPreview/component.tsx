/**
 * CampaignFormPreview Component
 * Displays the form preview on campaign detail page
 */

import { memo } from "react";
import { FormPreview } from "@/features/form-builder/components/FormPreview/component";
import { useFormConfigFromCampaign } from "@/hooks/useFormConfigFromCampaign";
import type { Campaign } from "@/types/campaign";
import styles from "./component.module.scss";

export interface CampaignFormPreviewProps {
	/** Campaign data */
	campaign: Campaign;
}

/**
 * CampaignFormPreview renders the form preview section
 */
export const CampaignFormPreview = memo<CampaignFormPreviewProps>(
	function CampaignFormPreview({ campaign }) {
		const formConfig = useFormConfigFromCampaign(campaign);

		if (!formConfig) {
			return null;
		}

		return (
			<div className={styles.root}>
				<h3 className={styles.title}>Form Preview</h3>
				<p className={styles.description}>
					See how your form will look when embedded
				</p>
				<div className={styles.previewContainer}>
					<FormPreview config={formConfig} device="desktop" />
				</div>
			</div>
		);
	},
);

CampaignFormPreview.displayName = "CampaignFormPreview";
