/**
 * EmailCampaignForm Component
 * Form for creating email campaigns with trigger configuration
 */

import {
	type ChangeEvent,
	type FormEvent,
	type HTMLAttributes,
	memo,
	useCallback,
	useState,
} from "react";
import { Button, Dropdown, Input } from "@/proto-design-system";
import type { EmailCampaign } from "@/types/common.types";
import styles from "./component.module.scss";

export interface EmailCampaignFormProps
	extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
	/** Campaign ID this email campaign belongs to */
	campaignId: string;
	/** Submit handler */
	onSubmit: (data: CreateEmailCampaignRequest) => Promise<void>;
	/** Cancel handler */
	onCancel?: () => void;
	/** Additional CSS class name */
	className?: string;
}

export interface CreateEmailCampaignRequest {
	name: string;
	templateId: string;
	segmentId?: string;
	trigger: EmailCampaign["trigger"];
	triggerConfig?: EmailCampaign["triggerConfig"];
	scheduledFor?: Date;
}

/**
 * EmailCampaignForm - Create email campaign form
 */
export const EmailCampaignForm = memo<EmailCampaignFormProps>(
	function EmailCampaignForm({
		campaignId,
		onSubmit,
		onCancel,
		className: customClassName,
		...props
	}) {
		const [name, setName] = useState("");
		const [templateId, setTemplateId] = useState("");
		const [segmentId, setSegmentId] = useState("");
		const [trigger, setTrigger] = useState<EmailCampaign["trigger"]>("manual");
		const [triggerDays, setTriggerDays] = useState("");
		const [triggerHours, setTriggerHours] = useState("");
		const [milestoneType, setMilestoneType] = useState("");
		const [milestoneValue, setMilestoneValue] = useState("");
		const [scheduledDate, setScheduledDate] = useState("");
		const [scheduledTime, setScheduledTime] = useState("");
		const [isSubmitting, setIsSubmitting] = useState(false);
		const [errors, setErrors] = useState<Record<string, string>>({});

		// TODO: Fetch templates and segments from API
		const templates = [
			{ id: "1", label: "Welcome Email" },
			{ id: "2", label: "Verification Email" },
			{ id: "3", label: "Position Update" },
		];

		const segments = [
			{ id: "1", label: "All Users" },
			{ id: "2", label: "Verified Users" },
			{ id: "3", label: "Top Referrers" },
		];

		const triggerOptions = [
			{ id: "manual", label: "Manual (Send now)" },
			{ id: "signup", label: "On Signup" },
			{ id: "verified", label: "On Verification" },
			{ id: "milestone", label: "On Milestone" },
			{ id: "scheduled", label: "Scheduled" },
			{ id: "inactive", label: "After Inactivity" },
		];

		const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

		// Validate form
		const validate = useCallback((): boolean => {
			const newErrors: Record<string, string> = {};

			if (!name.trim()) {
				newErrors.name = "Campaign name is required";
			} else if (name.length < 3) {
				newErrors.name = "Campaign name must be at least 3 characters";
			}

			if (!templateId) {
				newErrors.templateId = "Please select a template";
			}

			if (trigger === "scheduled" && !scheduledDate) {
				newErrors.scheduledDate = "Please select a date";
			}

			if (trigger === "scheduled" && !scheduledTime) {
				newErrors.scheduledTime = "Please select a time";
			}

			if (trigger === "milestone" && !milestoneType) {
				newErrors.milestoneType = "Please select a milestone type";
			}

			if (trigger === "milestone" && !milestoneValue) {
				newErrors.milestoneValue = "Please enter a milestone value";
			}

			if (
				(trigger === "signup" ||
					trigger === "verified" ||
					trigger === "inactive") &&
				!triggerDays &&
				!triggerHours
			) {
				newErrors.triggerConfig = "Please specify delay in days or hours";
			}

			setErrors(newErrors);
			return Object.keys(newErrors).length === 0;
		}, [
			name,
			templateId,
			trigger,
			scheduledDate,
			scheduledTime,
			milestoneType,
			milestoneValue,
			triggerDays,
			triggerHours,
		]);

		// Handle submit
		const handleSubmit = useCallback(
			async (e: FormEvent<HTMLFormElement>) => {
				e.preventDefault();

				if (!validate()) {
					return;
				}

				setIsSubmitting(true);

				try {
					const data: CreateEmailCampaignRequest = {
						name,
						templateId,
						segmentId: segmentId || undefined,
						trigger,
					};

					// Add trigger config based on trigger type
					if (
						trigger === "signup" ||
						trigger === "verified" ||
						trigger === "inactive"
					) {
						data.triggerConfig = {
							days: triggerDays ? parseInt(triggerDays, 10) : undefined,
							hours: triggerHours ? parseInt(triggerHours, 10) : undefined,
						};
					}

					if (trigger === "milestone") {
						data.triggerConfig = {
							milestoneType,
							milestoneValue: milestoneValue
								? parseInt(milestoneValue, 10)
								: undefined,
						};
					}

					if (trigger === "scheduled" && scheduledDate && scheduledTime) {
						data.scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);
					}

					await onSubmit(data);
				} catch (error) {
					console.error("Failed to create email campaign:", error);
				} finally {
					setIsSubmitting(false);
				}
			},
			[
				validate,
				name,
				templateId,
				segmentId,
				trigger,
				triggerDays,
				triggerHours,
				milestoneType,
				milestoneValue,
				scheduledDate,
				scheduledTime,
				onSubmit,
			],
		);

		const handleSendTest = useCallback(() => {
			// TODO: Implement send test email
			const email = prompt("Enter email address to send test:");
			if (email) {
				console.log("Sending test email to:", email);
			}
		}, []);

		const handlePreview = useCallback(() => {
			// TODO: Open preview modal
			console.log("Preview email campaign");
		}, []);

		return (
			<form className={classNames} onSubmit={handleSubmit} {...props}>
				<div className={styles.header}>
					<h2 className={styles.title}>Create Email Campaign</h2>
					<p className={styles.subtitle}>
						Configure your email campaign settings and trigger conditions
					</p>
				</div>

				<div className={styles.formGrid}>
					{/* Campaign Name */}
					<div className={styles.formField}>
						<label htmlFor="campaign-name" className={styles.label}>
							Campaign Name
							<span className={styles.required}>*</span>
						</label>
						<Input
							id="campaign-name"
							placeholder="Enter campaign name"
							value={name}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setName(e.target.value)
							}
							isError={!!errors.name}
						/>
						{errors.name && (
							<span className={styles.error}>{errors.name}</span>
						)}
					</div>

					{/* Template Selector */}
					<div className={styles.formField}>
						<label className={styles.label}>
							Email Template
							<span className={styles.required}>*</span>
						</label>
						<Dropdown
							placeholder="Select a template"
							items={templates}
							value={templateId}
							size="md"
							onChange={(id) => setTemplateId(id)}
						/>
						{errors.templateId && (
							<span className={styles.error}>{errors.templateId}</span>
						)}
					</div>

					{/* Segment Selector */}
					<div className={styles.formField}>
						<label className={styles.label}>Target Segment (Optional)</label>
						<Dropdown
							placeholder="Select a segment"
							items={segments}
							value={segmentId}
							size="md"
							onChange={(id) => setSegmentId(id)}
						/>
					</div>

					{/* Trigger Type */}
					<div className={styles.formField}>
						<label className={styles.label}>
							Trigger
							<span className={styles.required}>*</span>
						</label>
						<Dropdown
							placeholder="Select trigger type"
							items={triggerOptions}
							value={trigger}
							size="md"
							onChange={(id) =>
								setTrigger(id as EmailCampaign["trigger"])
							}
						/>
					</div>

					{/* Conditional Trigger Config */}
					{(trigger === "signup" ||
						trigger === "verified" ||
						trigger === "inactive") && (
						<div className={styles.formField}>
							<div className={styles.triggerConfig}>
								<label className={styles.label}>
									Delay After{" "}
									{trigger === "signup"
										? "Signup"
										: trigger === "verified"
											? "Verification"
											: "Last Activity"}
								</label>
								<div className={styles.delayInputs}>
									<div>
										<label htmlFor="trigger-days">Days</label>
										<Input
											id="trigger-days"
											type="number"
											placeholder="0"
											value={triggerDays}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												setTriggerDays(e.target.value)
											}
											min="0"
										/>
									</div>
									<div>
										<label htmlFor="trigger-hours">Hours</label>
										<Input
											id="trigger-hours"
											type="number"
											placeholder="0"
											value={triggerHours}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												setTriggerHours(e.target.value)
											}
											min="0"
											max="23"
										/>
									</div>
								</div>
								{errors.triggerConfig && (
									<span className={styles.error}>{errors.triggerConfig}</span>
								)}
							</div>
						</div>
					)}

					{trigger === "milestone" && (
						<div className={styles.formField}>
							<div className={styles.triggerConfig}>
								<label className={styles.label}>Milestone Configuration</label>
								<div>
									<label htmlFor="milestone-type">Milestone Type</label>
									<Input
										id="milestone-type"
										placeholder="e.g., referral_count"
										value={milestoneType}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											setMilestoneType(e.target.value)
										}
										isError={!!errors.milestoneType}
									/>
									{errors.milestoneType && (
										<span className={styles.error}>{errors.milestoneType}</span>
									)}
								</div>
								<div>
									<label htmlFor="milestone-value">Milestone Value</label>
									<Input
										id="milestone-value"
										type="number"
										placeholder="e.g., 5"
										value={milestoneValue}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											setMilestoneValue(e.target.value)
										}
										isError={!!errors.milestoneValue}
										min="1"
									/>
									{errors.milestoneValue && (
										<span className={styles.error}>{errors.milestoneValue}</span>
									)}
								</div>
							</div>
						</div>
					)}

					{trigger === "scheduled" && (
						<div className={styles.formField}>
							<div className={styles.triggerConfig}>
								<label className={styles.label}>Schedule</label>
								<div className={styles.scheduleInputs}>
									<div>
										<label htmlFor="scheduled-date">Date</label>
										<Input
											id="scheduled-date"
											type="date"
											value={scheduledDate}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												setScheduledDate(e.target.value)
											}
											isError={!!errors.scheduledDate}
										/>
										{errors.scheduledDate && (
											<span className={styles.error}>{errors.scheduledDate}</span>
										)}
									</div>
									<div>
										<label htmlFor="scheduled-time">Time</label>
										<Input
											id="scheduled-time"
											type="time"
											value={scheduledTime}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												setScheduledTime(e.target.value)
											}
											isError={!!errors.scheduledTime}
										/>
										{errors.scheduledTime && (
											<span className={styles.error}>{errors.scheduledTime}</span>
										)}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className={styles.actions}>
					<div className={styles.actionsLeft}>
						<Button
							type="button"
							variant="secondary"
							size="md"
							leftIcon="eye-line"
							onClick={handlePreview}
							disabled={!templateId}
						>
							Preview
						</Button>
						<Button
							type="button"
							variant="secondary"
							size="md"
							leftIcon="mail-send-line"
							onClick={handleSendTest}
							disabled={!templateId}
						>
							Send Test
						</Button>
					</div>
					<div className={styles.actionsRight}>
						{onCancel && (
							<Button
								type="button"
								variant="secondary"
								size="md"
								onClick={onCancel}
							>
								Cancel
							</Button>
						)}
						<Button
							type="submit"
							variant="primary"
							size="md"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Creating..." : "Create Campaign"}
						</Button>
					</div>
				</div>
			</form>
		);
	},
);

EmailCampaignForm.displayName = "EmailCampaignForm";
