/**
 * CampaignForm Component
 * Form for creating or editing campaigns
 */

import { type FormEvent, type HTMLAttributes, memo, useState } from "react";
import { Button } from "@/proto-design-system/Button/button";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import CheckboxWithLabel from "@/proto-design-system/checkbox/checkboxWithLabel";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";
import Dropdown from "@/proto-design-system/dropdown/dropdown";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
import type { TrackingIntegrationType } from "@/types/campaign";
import type { CampaignSettings } from "@/types/common.types";

/** Internal form representation of a tracking integration (not the API type) */
interface FormTrackingIntegration {
	type: TrackingIntegrationType;
	enabled: boolean;
	id: string;
	label?: string;
}

import { EmailSettingsSection } from "@/features/campaigns/components/EmailSettingsSection/component";
import { validateLength, validateRequired } from "@/utils/validation";
import styles from "./component.module.scss";

export interface CampaignFormData {
	name: string;
	description?: string;
	settings: {
		emailVerificationRequired: boolean;
		sendWelcomeEmail: boolean;
		duplicateHandling: "block" | "update" | "allow";
		enableReferrals: boolean;
		enableRewards: boolean;
	};
	referralConfig?: {
		pointsPerReferral: number;
		verifiedOnly: boolean;
		positionsToJump: number;
		referrerPositionsToJump: number;
		sharingChannels: string[];
	};
	formConfig?: {
		captchaEnabled: boolean;
	};
	trackingConfig?: {
		integrations: FormTrackingIntegration[];
	};
}

/** Available tracking integration options with validation */
const TRACKING_INTEGRATIONS: {
	type: TrackingIntegrationType;
	label: string;
	icon: string;
	placeholder: string;
	hasLabel?: boolean;
	pattern: RegExp;
	errorMessage: string;
}[] = [
	{
		type: "google_analytics",
		label: "Google Analytics (GA4)",
		icon: "ri-google-line",
		placeholder: "G-XXXXXXXXXX",
		pattern: /^G-[A-Z0-9]{10,}$/i,
		errorMessage: "Must start with G- followed by at least 10 characters",
	},
	{
		type: "meta_pixel",
		label: "Meta Pixel",
		icon: "ri-facebook-line",
		placeholder: "1234567890123456",
		pattern: /^\d{15,16}$/,
		errorMessage: "Must be a 15-16 digit number",
	},
	{
		type: "google_ads",
		label: "Google Ads",
		icon: "ri-advertisement-line",
		placeholder: "AW-XXXXXXXXX",
		hasLabel: true,
		pattern: /^AW-\d{9,11}$/,
		errorMessage: "Must start with AW- followed by 9-11 digits",
	},
	{
		type: "tiktok_pixel",
		label: "TikTok Pixel",
		icon: "ri-tiktok-line",
		placeholder: "XXXXXXXXXXXXXXXXXX",
		pattern: /^[A-Z0-9]{10,25}$/i,
		errorMessage: "Must be 10-25 alphanumeric characters",
	},
	{
		type: "linkedin_insight",
		label: "LinkedIn Insight",
		icon: "ri-linkedin-line",
		placeholder: "1234567",
		pattern: /^\d{5,10}$/,
		errorMessage: "Must be a 5-10 digit number",
	},
];

export interface CampaignFormProps
	extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
	/** Campaign ID (for editing existing campaigns) */
	campaignId?: string;
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

interface TrackingErrors {
	[key: string]: string | undefined;
}

/**
 * CampaignForm for creating/editing campaigns
 */
export const CampaignForm = memo<CampaignFormProps>(function CampaignForm({
	campaignId,
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
			sendWelcomeEmail: initialData?.settings?.sendWelcomeEmail ?? false,
			duplicateHandling: initialData?.settings?.duplicateHandling || "block",
			enableReferrals: initialData?.settings?.enableReferrals ?? false,
			enableRewards: initialData?.settings?.enableRewards ?? false,
		},
		referralConfig: {
			pointsPerReferral: initialData?.referralConfig?.pointsPerReferral ?? 1,
			verifiedOnly: initialData?.referralConfig?.verifiedOnly ?? true,
			positionsToJump: initialData?.referralConfig?.positionsToJump ?? 0,
			referrerPositionsToJump:
				initialData?.referralConfig?.referrerPositionsToJump ?? 1,
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
		trackingConfig: {
			integrations: initialData?.trackingConfig?.integrations ?? [],
		},
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});
	const [trackingErrors, setTrackingErrors] = useState<TrackingErrors>({});
	const [trackingTouched, setTrackingTouched] = useState<
		Record<string, boolean>
	>({});

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

	// Tracking validation
	const validateTrackingId = (
		type: TrackingIntegrationType,
		value: string,
	): string | null => {
		if (!value.trim()) {
			return "Tracking ID is required";
		}
		const integrationInfo = TRACKING_INTEGRATIONS.find((i) => i.type === type);
		if (integrationInfo && !integrationInfo.pattern.test(value)) {
			return integrationInfo.errorMessage;
		}
		return null;
	};

	const validateAllTrackingIntegrations = (): boolean => {
		const integrations = formData.trackingConfig?.integrations ?? [];
		const newErrors: TrackingErrors = {};
		let isValid = true;

		for (const integration of integrations) {
			const error = validateTrackingId(integration.type, integration.id);
			if (error) {
				newErrors[integration.type] = error;
				isValid = false;
			}
		}

		setTrackingErrors(newErrors);
		// Mark all as touched
		const allTouched: Record<string, boolean> = {};
		for (const integration of integrations) {
			allTouched[integration.type] = true;
		}
		setTrackingTouched(allTouched);

		return isValid;
	};

	// Tracking config handlers
	const handleAddTrackingIntegration = (type: TrackingIntegrationType) => {
		// Don't add if already exists
		if (formData.trackingConfig?.integrations.some((i) => i.type === type)) {
			return;
		}
		setFormData((prev) => ({
			...prev,
			trackingConfig: {
				integrations: [
					...(prev.trackingConfig?.integrations ?? []),
					{ type, enabled: true, id: "" },
				],
			},
		}));
	};

	const handleRemoveTrackingIntegration = (type: TrackingIntegrationType) => {
		setFormData((prev) => ({
			...prev,
			trackingConfig: {
				integrations:
					prev.trackingConfig?.integrations.filter((i) => i.type !== type) ??
					[],
			},
		}));
		// Clear errors for removed integration
		setTrackingErrors((prev) => {
			const newErrors = { ...prev };
			delete newErrors[type];
			return newErrors;
		});
		setTrackingTouched((prev) => {
			const newTouched = { ...prev };
			delete newTouched[type];
			return newTouched;
		});
	};

	const handleTrackingIntegrationChange = (
		type: TrackingIntegrationType,
		field: "id" | "label",
		value: string,
	) => {
		setFormData((prev) => ({
			...prev,
			trackingConfig: {
				integrations:
					prev.trackingConfig?.integrations.map((i) =>
						i.type === type ? { ...i, [field]: value } : i,
					) ?? [],
			},
		}));

		// Validate on change if already touched
		if (field === "id" && trackingTouched[type]) {
			const error = validateTrackingId(type, value);
			setTrackingErrors((prev) => ({
				...prev,
				[type]: error || undefined,
			}));
		}
	};

	const handleTrackingIdBlur = (
		type: TrackingIntegrationType,
		value: string,
	) => {
		setTrackingTouched((prev) => ({ ...prev, [type]: true }));
		const error = validateTrackingId(type, value);
		setTrackingErrors((prev) => ({
			...prev,
			[type]: error || undefined,
		}));
	};

	// Get available integrations that haven't been added yet
	const availableIntegrations = TRACKING_INTEGRATIONS.filter(
		(integration) =>
			!formData.trackingConfig?.integrations.some(
				(i) => i.type === integration.type,
			),
	);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		// Validate all fields
		const nameError = validateField("name", formData.name);
		const descriptionError = validateField(
			"description",
			formData.description || "",
		);

		// Validate tracking integrations
		const trackingValid = validateAllTrackingIntegrations();

		if (nameError || descriptionError) {
			setErrors({
				name: nameError || undefined,
				description: descriptionError || undefined,
			});
			setTouched({ name: true, description: true });
			return;
		}

		if (!trackingValid) {
			return;
		}

		await onSubmit(formData);
	};

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	return (
		<form className={classNames} onSubmit={handleSubmit} {...props}>
			{/* General Section */}
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>General</h3>
				<p className={styles.sectionDescription}>
					Basic information about your campaign
				</p>

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

				<TextInput
					id="campaign-description"
					label="Description"
					type="text"
					value={formData.description}
					onChange={(e) => handleChange("description", e.target.value)}
					onBlur={() => handleBlur("description")}
					placeholder="Describe your campaign..."
					disabled={loading}
					error={touched.description ? errors.description : undefined}
				/>
			</div>

			{/* Signup Options Section */}
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Signup Options</h3>
				<p className={styles.sectionDescription}>
					Configure how users sign up for your waitlist
				</p>

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

			{/* Email Settings Section */}
			<EmailSettingsSection
				campaignId={campaignId}
				verificationRequired={formData.settings.emailVerificationRequired}
				sendWelcomeEmail={formData.settings.sendWelcomeEmail}
				onSendWelcomeEmailChange={(value) =>
					handleSettingChange("sendWelcomeEmail", value)
				}
				disabled={loading}
			/>

			{/* Growth Features Section */}
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Growth Features</h3>
				<p className={styles.sectionDescription}>
					Enable viral growth and engagement features
				</p>

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

				{/* Referral Configuration - Only show if referrals are enabled */}
				{formData.settings.enableReferrals && (
					<div className={styles.subsection}>
						<TextInput
							id="points-per-referral"
							label="Points Per Referral"
							type="number"
							value={
								formData.referralConfig?.pointsPerReferral.toString() || "1"
							}
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
							hint="Points earned for each successful referral"
						/>

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
							description="Only count referrals that have verified their email"
						/>

						<TextInput
							id="referrer-positions-to-jump"
							label="Referrer Positions to Jump"
							type="number"
							value={
								formData.referralConfig?.referrerPositionsToJump.toString() ||
								"1"
							}
							onChange={(e) =>
								handleReferralConfigChange(
									"referrerPositionsToJump",
									parseInt(e.target.value) || 1,
								)
							}
							placeholder="1"
							disabled={loading}
							min={1}
							max={1000}
							hint="Positions referrer jumps for each referral"
						/>

						<TextInput
							id="positions-to-jump"
							label="Referee Positions to Jump"
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
							hint="Positions new user jumps when using a referral code"
						/>

						<div className={styles.sharingChannels}>
							<label className={styles.sharingChannelsLabel}>
								Sharing Channels
							</label>
							<p className={styles.sharingChannelsHint}>
								Platforms users can share their referral link on
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
			</div>

			{/* Conversion Tracking Section */}
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Conversion Tracking</h3>
				<p className={styles.sectionDescription}>
					Add tracking pixels to fire when users complete signup
				</p>

				{/* Add Integration Dropdown */}
				{availableIntegrations.length > 0 && (
					<Dropdown
						label="Add Tracking Integration"
						placeholderText="Select a tracking platform..."
						size="medium"
						options={availableIntegrations.map((integration) => ({
							label: integration.label,
							value: integration.type,
							description: `ID format: ${integration.placeholder}`,
							selected: false,
						}))}
						disabled={loading}
						onChange={(option) =>
							handleAddTrackingIntegration(
								option.value as TrackingIntegrationType,
							)
						}
					/>
				)}

				{/* Configured Integrations List */}
				{formData.trackingConfig?.integrations &&
					formData.trackingConfig.integrations.length > 0 && (
						<div className={styles.trackingIntegrations}>
							{formData.trackingConfig.integrations.map((integration) => {
								const integrationInfo = TRACKING_INTEGRATIONS.find(
									(i) => i.type === integration.type,
								);
								if (!integrationInfo) return null;

								return (
									<div
										key={integration.type}
										className={styles.trackingIntegration}
									>
										<div className={styles.trackingIntegrationHeader}>
											<div className={styles.trackingIntegrationInfo}>
												<i
													className={`${integrationInfo.icon} ${styles.trackingIntegrationIcon}`}
													aria-hidden="true"
												/>
												<span className={styles.trackingIntegrationName}>
													{integrationInfo.label}
												</span>
											</div>
											<IconOnlyButton
												iconClass="delete-bin-line"
												variant="secondary"
												ariaLabel={`Remove ${integrationInfo.label}`}
												onClick={() =>
													handleRemoveTrackingIntegration(integration.type)
												}
												disabled={loading}
											/>
										</div>
										<div className={styles.trackingIntegrationFields}>
											<TextInput
												id={`tracking-${integration.type}-id`}
												label="Tracking ID"
												type="text"
												value={integration.id}
												onChange={(e) =>
													handleTrackingIntegrationChange(
														integration.type,
														"id",
														e.target.value,
													)
												}
												onBlur={() =>
													handleTrackingIdBlur(integration.type, integration.id)
												}
												placeholder={integrationInfo.placeholder}
												disabled={loading}
												required
												error={
													trackingTouched[integration.type]
														? trackingErrors[integration.type]
														: undefined
												}
												hint={`Format: ${integrationInfo.placeholder}`}
											/>
											{integrationInfo.hasLabel && (
												<TextInput
													id={`tracking-${integration.type}-label`}
													label="Conversion Label"
													type="text"
													value={integration.label || ""}
													onChange={(e) =>
														handleTrackingIntegrationChange(
															integration.type,
															"label",
															e.target.value,
														)
													}
													placeholder="Enter conversion label"
													disabled={loading}
												/>
											)}
										</div>
									</div>
								);
							})}
						</div>
					)}

				{formData.trackingConfig?.integrations.length === 0 && (
					<p className={styles.trackingEmptyState}>
						No tracking integrations configured. Add one above to track
						conversions.
					</p>
				)}
			</div>

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
