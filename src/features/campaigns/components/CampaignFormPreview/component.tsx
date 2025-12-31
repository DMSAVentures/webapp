/**
 * CampaignFormPreview Component
 * Displays the form preview on campaign detail page with device toggle
 */

import { memo, useState } from "react";
import { FormPreview } from "@/features/form-builder/components/FormPreview/component";
import { useFormConfigFromCampaign } from "@/hooks/useFormConfigFromCampaign";
import {
	Button,
	ButtonGroup,
} from "@/proto-design-system/components/primitives/Button";
import type { Campaign } from "@/types/campaign";
import styles from "./component.module.scss";

export interface CampaignFormPreviewProps {
	/** Campaign data */
	campaign: Campaign;
}

type DeviceType = "desktop" | "mobile";

/**
 * CampaignFormPreview renders the form preview section with device toggle
 */
export const CampaignFormPreview = memo<CampaignFormPreviewProps>(
	function CampaignFormPreview({ campaign }) {
		const formConfig = useFormConfigFromCampaign(campaign);
		const [device, setDevice] = useState<DeviceType>("desktop");

		if (!formConfig) {
			return null;
		}

		return (
			<div className={styles.root}>
				<div className={styles.header}>
					<div>
						<h3 className={styles.title}>Form Preview</h3>
						<p className={styles.description}>
							See how your form will look when embedded
						</p>
					</div>
					<ButtonGroup isAttached>
						<Button
							variant={device === "desktop" ? "outline" : "ghost"}
							size="sm"
							onClick={() => setDevice("desktop")}
						>
							Desktop
						</Button>
						<Button
							variant={device === "mobile" ? "outline" : "ghost"}
							size="sm"
							onClick={() => setDevice("mobile")}
						>
							Mobile
						</Button>
					</ButtonGroup>
				</div>
				<div className={styles.previewContainer}>
					<FormPreview config={formConfig} device={device} />
				</div>
			</div>
		);
	},
);

CampaignFormPreview.displayName = "CampaignFormPreview";
