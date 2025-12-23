import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
	WebhookForm,
	type WebhookFormData,
} from "@/features/webhooks/components/WebhookForm/component";
import { useCreateWebhook } from "@/hooks/useCreateWebhook";
import Banner from "@/proto-design-system/banner/banner";
import { Button } from "@/proto-design-system/Button/button";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import styles from "./new.module.scss";

export const Route = createFileRoute("/webhooks/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { createWebhook, loading, error } = useCreateWebhook();
	const [webhookSecret, setWebhookSecret] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const handleCopySecret = async () => {
		if (webhookSecret) {
			await navigator.clipboard.writeText(webhookSecret);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleSubmit = async (data: WebhookFormData) => {
		const webhook = await createWebhook({
			url: data.url,
			events: data.events,
			retry_enabled: true,
			max_retries: 5,
		});

		if (webhook) {
			setWebhookSecret(webhook.secret);
		}
	};

	const handleCancel = () => {
		navigate({ to: "/webhooks" });
	};

	const handleSecretAcknowledged = () => {
		navigate({ to: "/webhooks" });
	};

	// Show secret acknowledgment screen after successful creation
	if (webhookSecret) {
		return (
			<motion.div
				className={styles.page}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<div className={styles.pageHeader}>
					<div className={styles.headerContent}>
						<h1 className={styles.pageTitle}>Webhook Created</h1>
						<p className={styles.pageDescription}>
							Your webhook has been created successfully
						</p>
					</div>
				</div>

				<div className={styles.pageContent}>
					<div className={styles.secretDisplay}>
						<Banner
							bannerType="warning"
							variant="filled"
							alertTitle="Save your webhook secret"
							alertDescription="This is the only time you'll see this secret. Copy it now and store it securely."
						/>

						<div className={styles.secretCard}>
							<span className={styles.secretLabel}>
								Webhook Signing Secret
							</span>
							<div className={styles.secretValueContainer}>
								<code className={styles.secretValue}>
									{webhookSecret}
								</code>
								<IconOnlyButton
									ariaLabel={copied ? "Copied!" : "Copy secret"}
									variant="secondary"
									iconClass={copied ? "check-line" : "file-copy-line"}
									onClick={handleCopySecret}
								/>
							</div>
							<p className={styles.secretHint}>
								Use this secret to verify webhook signatures in
								your server. All webhook requests include an
								X-Webhook-Signature header that you can validate
								using HMAC-SHA256.
							</p>
						</div>

						<Button
							variant="primary"
							onClick={handleSecretAcknowledged}
						>
							I've saved the secret
						</Button>
					</div>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div className={styles.headerContent}>
					<h1 className={styles.pageTitle}>Create Webhook</h1>
					<p className={styles.pageDescription}>
						Configure a new webhook endpoint to receive real-time
						notifications
					</p>
				</div>
			</div>

			{error && (
				<Banner
					bannerType="error"
					variant="filled"
					alertTitle="Failed to create webhook"
					alertDescription={error.error}
				/>
			)}

			<div className={styles.pageContent}>
				<WebhookForm
					onSubmit={handleSubmit}
					onCancel={handleCancel}
					loading={loading}
					submitText="Create Webhook"
				/>
			</div>
		</motion.div>
	);
}
