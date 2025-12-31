/**
 * WebhookForm Component
 * Form for creating or editing webhooks
 */

import { Check, Loader2 } from "lucide-react";
import { type FormEvent, type HTMLAttributes, memo, useState } from "react";
import { Checkbox } from "@/proto-design-system/components/forms/Checkbox";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Divider } from "@/proto-design-system/components/layout/Divider";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { WEBHOOK_EVENTS } from "@/types/webhook";
import { validateRequired, validateUrl } from "@/utils/validation";
import styles from "./component.module.scss";

// Group events by category
const EVENT_CATEGORIES = {
	User: [
		"user.created",
		"user.verified",
		"user.updated",
		"user.deleted",
		"user.position_changed",
		"user.converted",
	],
	Referral: ["referral.created", "referral.verified", "referral.converted"],
	Reward: ["reward.earned", "reward.delivered", "reward.redeemed"],
	Campaign: ["campaign.milestone", "campaign.launched", "campaign.completed"],
} as const;

export interface WebhookFormData {
	url: string;
	events: string[];
}

export interface WebhookFormProps
	extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
	/** Initial form data for editing */
	initialData?: Partial<WebhookFormData>;
	/** Submit handler */
	onSubmit: (data: WebhookFormData) => Promise<void> | void;
	/** Cancel handler */
	onCancel?: () => void;
	/** Loading state */
	loading?: boolean;
	/** Submit button text */
	submitText?: string;
	/** Additional CSS class name */
	className?: string;
}

interface FormErrors {
	url?: string;
	events?: string;
}

/**
 * WebhookForm for creating/editing webhooks
 */
export const WebhookForm = memo<WebhookFormProps>(function WebhookForm({
	initialData,
	onSubmit,
	onCancel,
	loading = false,
	submitText = "Create Webhook",
	className: customClassName,
	...props
}) {
	// Form state
	const [formData, setFormData] = useState<WebhookFormData>({
		url: initialData?.url || "",
		events: initialData?.events || [],
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	// Validation
	const validateField = (
		name: keyof FormErrors,
		value: string | string[],
	): string | null => {
		switch (name) {
			case "url":
				return (
					validateRequired(value as string, "Endpoint URL") ||
					validateUrl(value as string)
				);
			case "events":
				return (value as string[]).length === 0
					? "Please select at least one event"
					: null;
			default:
				return null;
		}
	};

	const handleBlur = (field: keyof FormErrors) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
		const value = field === "events" ? formData.events : formData.url;
		const error = validateField(field, value);
		setErrors((prev) => ({ ...prev, [field]: error || undefined }));
	};

	const handleUrlChange = (value: string) => {
		setFormData((prev) => ({ ...prev, url: value }));
		if (touched.url) {
			const error = validateField("url", value);
			setErrors((prev) => ({ ...prev, url: error || undefined }));
		}
	};

	const handleEventToggle = (event: string) => {
		setFormData((prev) => {
			const newEvents = prev.events.includes(event)
				? prev.events.filter((e) => e !== event)
				: [...prev.events, event];

			if (touched.events) {
				const error = validateField("events", newEvents);
				setErrors((prevErrors) => ({
					...prevErrors,
					events: error || undefined,
				}));
			}

			return { ...prev, events: newEvents };
		});
	};

	const handleSelectAllCategory = (categoryEvents: readonly string[]) => {
		setFormData((prev) => {
			const allSelected = categoryEvents.every((e) => prev.events.includes(e));
			let newEvents: string[];
			if (allSelected) {
				newEvents = prev.events.filter((e) => !categoryEvents.includes(e));
			} else {
				newEvents = [
					...prev.events,
					...categoryEvents.filter((e) => !prev.events.includes(e)),
				];
			}

			if (touched.events) {
				const error = validateField("events", newEvents);
				setErrors((prevErrors) => ({
					...prevErrors,
					events: error || undefined,
				}));
			}

			return { ...prev, events: newEvents };
		});
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		// Validate all fields
		const urlError = validateField("url", formData.url);
		const eventsError = validateField("events", formData.events);

		if (urlError || eventsError) {
			setErrors({
				url: urlError || undefined,
				events: eventsError || undefined,
			});
			setTouched({ url: true, events: true });
			return;
		}

		await onSubmit(formData);
	};

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	return (
		<form className={classNames} onSubmit={handleSubmit} {...props}>
			{/* Endpoint URL */}
			<Input
				id="webhook-url"
				type="url"
				value={formData.url}
				onChange={(e) => handleUrlChange(e.target.value)}
				onBlur={() => handleBlur("url")}
				placeholder="https://your-server.com/webhook"
				disabled={loading}
				required
				isError={!!(touched.url && errors.url)}
			/>

			{/* Events Section */}
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Events to Subscribe</h3>
				<p className={styles.sectionDescription}>
					Select which events should trigger this webhook
				</p>

				{touched.events && errors.events && (
					<span className={styles.eventsError}>{errors.events}</span>
				)}

				<div className={styles.eventCategories}>
					{Object.entries(EVENT_CATEGORIES).map(([category, events]) => {
						const allSelected = events.every((e) =>
							formData.events.includes(e),
						);

						return (
							<div key={category} className={styles.eventCategory}>
								<div className={styles.categoryHeader}>
									<Checkbox
										checked={allSelected}
										onChange={() => handleSelectAllCategory(events)}
										disabled={loading}
										label={category}
									/>
								</div>
								<div className={styles.eventsList}>
									{events.map((event) => (
										<Checkbox
											key={event}
											checked={formData.events.includes(event)}
											onChange={() => handleEventToggle(event)}
											disabled={loading}
											label={event}
											description={
												WEBHOOK_EVENTS[event as keyof typeof WEBHOOK_EVENTS]
											}
										/>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Divider */}
			<Divider />

			{/* Form Actions */}
			<div className={styles.actions}>
				{onCancel && (
					<Button
						type="button"
						onClick={onCancel}
						disabled={loading}
						variant="secondary"
					>
						Cancel
					</Button>
				)}
				<Button
					type="submit"
					disabled={loading}
					variant="primary"
					leftIcon={
						loading ? (
							<Loader2 size={16} className={styles.spinIcon} />
						) : (
							<Check size={16} />
						)
					}
				>
					{loading ? "Saving..." : submitText}
				</Button>
			</div>
		</form>
	);
});

WebhookForm.displayName = "WebhookForm";
