import { Check, Copy } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useGlobalBanner } from "@/contexts/globalBanner";
import {
	WebhookForm,
	type WebhookFormData,
} from "@/features/webhooks/components/WebhookForm/component";
import { useCreateWebhook } from "@/hooks/useCreateWebhook";
import { Button, Banner } from "@/proto-design-system";
import styles from "./new.module.scss";

export const Route = createFileRoute("/webhooks/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { createWebhook, loading, error } = useCreateWebhook();
	const { showBanner } = useGlobalBanner();
	const [webhookSecret, setWebhookSecret] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (error) {
			showBanner({
				type: "error",
				title: "Failed to create webhook",
				description: error.error,
			});
		}
	}, [error, showBanner]);

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
							type="warning"
							variant="filled"
							title="Save your webhook secret"
							description="This is the only time you'll see this secret. Copy it now and store it securely."
						/>

						<div className={styles.secretCard}>
							<span className={styles.secretLabel}>Webhook Signing Secret</span>
							<div className={styles.secretValueContainer}>
								<code className={styles.secretValue}>{webhookSecret}</code>
								<Button
									aria-label={copied ? "Copied!" : "Copy secret"}
									variant="secondary"
									leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
									onClick={handleCopySecret}
								/>
							</div>
							<p className={styles.secretHint}>
								Use this secret to verify webhook signatures in your server. All
								webhook requests include an X-Webhook-Signature header that you
								can validate using HMAC-SHA256.
							</p>
						</div>

						<Button variant="primary" onClick={handleSecretAcknowledged}>
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
						Configure a new webhook endpoint to receive real-time notifications
					</p>
				</div>
			</div>

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
