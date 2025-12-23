/**
 * CampaignForm Component
 * Form for creating or editing campaigns
 */

import { type FormEvent, type HTMLAttributes, memo, useState } from "react";
import { Button } from "@/proto-design-system/Button/button";
import CheckboxWithLabel from "@/proto-design-system/checkbox/checkboxWithLabel";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";
import Dropdown from "@/proto-design-system/dropdown/dropdown";
import { TextArea } from "@/proto-design-system/TextArea/textArea";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
import type { CampaignSettings } from "@/types/common.types";
import { validateLength, validateRequired } from "@/utils/validation";
import styles from "./component.module.scss";

export interface CampaignFormData {
	name: string;
	description?: string;
	settings: {
		emailVerificationRequired: boolean;
		duplicateHandling: "block" | "update" | "allow";
		enableReferrals: boolean;
		enableRewards: boolean;
	};
	referralConfig?: {
		pointsPerReferral: number;
		verifiedOnly: boolean;
		positionsToJump: number;
		sharingChannels: string[];
	};
	formConfig?: {
		captchaEnabled: boolean;
	};
}

export interface CampaignFormProps
	extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
	/** Initial form data for editing */
	initialData?: Partial<CampaignFormData>;
	/** Submit handler */
	onSubmit: (data: CampaignFormData) => Promise<void> | void;
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
	name?: string;
	description?: string;
}

/**
 * CampaignForm for creating/editing campaigns
 */
export const CampaignForm = memo<CampaignFormProps>(function CampaignForm({
	initialData,
	onSubmit,
	onCancel,
	loading = false,
	submitText = "Create Campaign",
	className: customClassName,
	...props
}) {
	// Form state
	const [formData, setFormData] = useState<CampaignFormData>({
		name: initialData?.name || "",
		description: initialData?.description || "",
		settings: {
			emailVerificationRequired:
				initialData?.settings?.emailVerificationRequired ?? false,
			duplicateHandling: initialData?.settings?.duplicateHandling || "block",
			enableReferrals: initialData?.settings?.enableReferrals ?? false,
			enableRewards: initialData?.settings?.enableRewards ?? false,
		},
		referralConfig: {
			pointsPerReferral: initialData?.referralConfig?.pointsPerReferral ?? 1,
			verifiedOnly: initialData?.referralConfig?.verifiedOnly ?? true,
			positionsToJump: initialData?.referralConfig?.positionsToJump ?? 0,
			sharingChannels: initialData?.referralConfig?.sharingChannels ?? [
				"email",
				"twitter",
				"facebook",
				"linkedin",
			],
		},
		formConfig: {
			captchaEnabled: initialData?.formConfig?.captchaEnabled ?? false,
		},
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	// Validation
	const validateField = (
		name: keyof FormErrors,
		value: string,
	): string | null => {
		switch (name) {
			case "name":
				return (
					validateRequired(value, "Campaign name") ||
					validateLength(value, {
						min: 3,
						max: 100,
						fieldName: "Campaign name",
					})
				);
			case "description":
				return validateLength(value, { max: 500, fieldName: "Description" });
			default:
				return null;
		}
	};

	const handleBlur = (field: keyof FormErrors) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
		const error = validateField(field, formData[field] || "");
		setErrors((prev) => ({ ...prev, [field]: error || undefined }));
	};

	const handleChange = (
		field: keyof Pick<CampaignFormData, "name" | "description">,
		value: string,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (touched[field]) {
			const error = validateField(field, value);
			setErrors((prev) => ({ ...prev, [field]: error || undefined }));
		}
	};

	const handleSettingChange = (
		setting: keyof CampaignSettings,
		value: boolean | string,
	) => {
		setFormData((prev) => ({
			...prev,
			settings: {
				...prev.settings,
				[setting]: value,
			},
		}));
	};

	const handleReferralConfigChange = (
		field: keyof NonNullable<CampaignFormData["referralConfig"]>,
		value: number | boolean | string[],
	) => {
		setFormData((prev) => ({
			...prev,
			referralConfig: {
				...prev.referralConfig!,
				[field]: value,
			},
		}));
	};

	const handleSharingChannelToggle = (channel: string) => {
		setFormData((prev) => {
			const currentChannels = prev.referralConfig?.sharingChannels || [];
			const newChannels = currentChannels.includes(channel)
				? currentChannels.filter((c) => c !== channel)
				: [...currentChannels, channel];
			return {
				...prev,
				referralConfig: {
					...prev.referralConfig!,
					sharingChannels: newChannels,
				},
			};
		});
	};

	const handleFormConfigChange = (
		field: keyof NonNullable<CampaignFormData["formConfig"]>,
		value: boolean,
	) => {
		setFormData((prev) => ({
			...prev,
			formConfig: {
				...prev.formConfig!,
				[field]: value,
			},
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		// Validate all fields
		const nameError = validateField("name", formData.name);
		const descriptionError = validateField(
			"description",
			formData.description || "",
		);

		if (nameError || descriptionError) {
			setErrors({
				name: nameError || undefined,
				description: descriptionError || undefined,
			});
			setTouched({ name: true, description: true });
			return;
		}

		await onSubmit(formData);
	};

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	return (
		<form className={classNames} onSubmit={handleSubmit} {...props}>
			{/* Campaign Name */}
			<TextInput
				id="campaign-name"
				label="Campaign Name"
				type="text"
				value={formData.name}
				onChange={(e) => handleChange("name", e.target.value)}
				onBlur={() => handleBlur("name")}
				placeholder="e.g., Product Launch 2025"
				disabled={loading}
				required
				error={touched.name ? errors.name : undefined}
			/>

			{/* Description */}
			<TextArea
				id="campaign-description"
				label="Description"
				value={formData.description}
				onChange={(e) => handleChange("description", e.target.value)}
				onBlur={() => handleBlur("description")}
				placeholder="Describe your campaign..."
				rows={5}
				disabled={loading}
				maxLength={500}
				error={touched.description ? errors.description : undefined}
			/>

			{/* Settings Section */}
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Campaign Settings</h3>

				{/* Email Verification */}
				<CheckboxWithLabel
					checked={
						formData.settings.emailVerificationRequired
							? "checked"
							: "unchecked"
					}
					onChange={(e) =>
						handleSettingChange("emailVerificationRequired", e.target.checked)
					}
					disabled={loading}
					flipCheckboxToRight={false}
					text="Require email verification"
					description="Users must verify their email before being added to waitlist"
				/>

				{/* Enable Referrals */}
				<CheckboxWithLabel
					checked={formData.settings.enableReferrals ? "checked" : "unchecked"}
					onChange={(e) =>
						handleSettingChange("enableReferrals", e.target.checked)
					}
					disabled={loading}
					flipCheckboxToRight={false}
					text="Enable referral system"
					description="Allow users to refer others and track viral growth"
				/>

				{/* Enable Rewards */}
				<CheckboxWithLabel
					checked={formData.settings.enableRewards ? "checked" : "unchecked"}
					onChange={(e) =>
						handleSettingChange("enableRewards", e.target.checked)
					}
					disabled={loading}
					flipCheckboxToRight={false}
					text="Enable reward system"
					description="Reward users for reaching referral milestones"
				/>

				{/* Duplicate Handling */}
				<Dropdown
					label="Duplicate Email Handling"
					placeholderText="Select handling method"
					size="medium"
					options={[
						{
							label: "Block - Reject duplicate signups",
							value: "block",
							description: "Prevent users from signing up multiple times",
							selected: formData.settings.duplicateHandling === "block",
						},
						{
							label: "Update - Replace existing entry",
							value: "update",
							description: "Update the existing user information",
							selected: formData.settings.duplicateHandling === "update",
						},
						{
							label: "Allow - Create new entry",
							value: "allow",
							description: "Allow duplicate signups with separate entries",
							selected: formData.settings.duplicateHandling === "allow",
						},
					]}
					disabled={loading}
					onChange={(option) =>
						handleSettingChange("duplicateHandling", option.value)
					}
				/>

				{/* Enable CAPTCHA */}
				<CheckboxWithLabel
					checked={
						formData.formConfig?.captchaEnabled ? "checked" : "unchecked"
					}
					onChange={(e) =>
						handleFormConfigChange("captchaEnabled", e.target.checked)
					}
					disabled={loading}
					flipCheckboxToRight={false}
					text="Enable CAPTCHA"
					description="Protect your waitlist from bots and spam submissions"
				/>
			</div>

			{/* Referral Configuration Section - Only show if referrals are enabled */}
			{formData.settings.enableReferrals && (
				<div className={styles.section}>
					<h3 className={styles.sectionTitle}>Referral Configuration</h3>
					<p className={styles.sectionDescription}>
						Configure how the referral system works for this campaign
					</p>

					{/* Points Per Referral */}
					<TextInput
						id="points-per-referral"
						label="Points Per Referral"
						type="number"
						value={formData.referralConfig?.pointsPerReferral.toString() || "1"}
						onChange={(e) =>
							handleReferralConfigChange(
								"pointsPerReferral",
								parseInt(e.target.value) || 1,
							)
						}
						placeholder="1"
						disabled={loading}
						min={1}
						max={100}
						hint="Number of points users earn for each successful referral"
					/>

					{/* Verified Only */}
					<CheckboxWithLabel
						checked={
							formData.referralConfig?.verifiedOnly ? "checked" : "unchecked"
						}
						onChange={(e) =>
							handleReferralConfigChange("verifiedOnly", e.target.checked)
						}
						disabled={loading}
						flipCheckboxToRight={false}
						text="Count verified referrals only"
						description="Only count referrals that have verified their email address"
					/>

					{/* Positions to Jump */}
					<TextInput
						id="positions-to-jump"
						label="Positions to Jump"
						type="number"
						value={formData.referralConfig?.positionsToJump.toString() || "0"}
						onChange={(e) =>
							handleReferralConfigChange(
								"positionsToJump",
								parseInt(e.target.value) || 0,
							)
						}
						placeholder="0"
						disabled={loading}
						min={0}
						max={1000}
						hint="Number of positions a referred user jumps ahead in the queue (0 = no jump)"
					/>

					{/* Sharing Channels */}
					<div className={styles.sharingChannels}>
						<label className={styles.sharingChannelsLabel}>
							Sharing Channels
						</label>
						<p className={styles.sharingChannelsHint}>
							Select which platforms users can share their referral link on
						</p>
						<div className={styles.sharingChannelsList}>
							{[
								{ value: "email", label: "Email" },
								{ value: "twitter", label: "Twitter/X" },
								{ value: "facebook", label: "Facebook" },
								{ value: "linkedin", label: "LinkedIn" },
								{ value: "whatsapp", label: "WhatsApp" },
							].map((channel) => (
								<CheckboxWithLabel
									key={channel.value}
									checked={
										formData.referralConfig?.sharingChannels.includes(
											channel.value,
										)
											? "checked"
											: "unchecked"
									}
									onChange={() => handleSharingChannelToggle(channel.value)}
									disabled={loading}
									flipCheckboxToRight={false}
									text={channel.label}
									description=""
								/>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Divider */}
			<ContentDivider size="thin" />

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
					leftIcon={loading ? "ri-loader-4-line ri-spin" : "ri-check-line"}
				>
					{loading ? "Saving..." : submitText}
				</Button>
			</div>
		</form>
	);
});

CampaignForm.displayName = "CampaignForm";
