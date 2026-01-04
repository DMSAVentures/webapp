/**
 * CampaignForm Component
 * Form for creating or editing campaigns
 */

import { Check, Loader2, Trash2 } from "lucide-react";
import {
	type FormEvent,
	type HTMLAttributes,
	memo,
	useCallback,
	useState,
} from "react";
import { FeatureGate } from "@/components/gating";
import { useTier } from "@/contexts/tier";
import { Checkbox } from "@/proto-design-system/components/forms/Checkbox";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Label } from "@/proto-design-system/components/forms/Label";
import { TextField } from "@/proto-design-system/components/forms/TextField";
import { Card } from "@/proto-design-system/components/layout/Card";
import { Divider } from "@/proto-design-system/components/layout/Divider";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Dropdown } from "@/proto-design-system/components/overlays/Dropdown";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Text } from "@/proto-design-system/components/primitives/Text";
import "remixicon/fonts/remixicon.css";
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
	/** Whether the form is disabled (read-only mode) */
	disabled?: boolean;
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

// ============================================================================
// Pure Functions
// ============================================================================

/** Validates a form field and returns an error message or null */
function validateFormField(
	name: keyof FormErrors,
	value: string,
): string | null {
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
}

/** Validates a tracking integration ID and returns an error message or null */
function validateTrackingId(
	type: TrackingIntegrationType,
	value: string,
): string | null {
	if (!value.trim()) {
		return "Tracking ID is required";
	}
	const integrationInfo = TRACKING_INTEGRATIONS.find((i) => i.type === type);
	if (integrationInfo && !integrationInfo.pattern.test(value)) {
		return integrationInfo.errorMessage;
	}
	return null;
}

/** Gets available integrations that haven't been added yet */
function getAvailableIntegrations(
	currentIntegrations: FormTrackingIntegration[],
) {
	return TRACKING_INTEGRATIONS.filter(
		(integration) =>
			!currentIntegrations.some((i) => i.type === integration.type),
	);
}

/** Creates the initial form data from optional initial data */
function createInitialFormData(
	initialData?: Partial<CampaignFormData>,
): CampaignFormData {
	return {
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
	};
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing form field validation state */
function useFormValidation() {
	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	const validateField = useCallback((name: keyof FormErrors, value: string) => {
		const error = validateFormField(name, value);
		setErrors((prev) => ({ ...prev, [name]: error || undefined }));
		return error;
	}, []);

	const markTouched = useCallback((field: keyof FormErrors) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
	}, []);

	const markAllTouched = useCallback(() => {
		setTouched({ name: true, description: true });
	}, []);

	const resetValidation = useCallback(() => {
		setErrors({});
		setTouched({});
	}, []);

	return {
		errors,
		touched,
		setErrors,
		validateField,
		markTouched,
		markAllTouched,
		resetValidation,
	};
}

/** Hook for managing tracking integration validation state */
function useTrackingValidation() {
	const [trackingErrors, setTrackingErrors] = useState<TrackingErrors>({});
	const [trackingTouched, setTrackingTouched] = useState<
		Record<string, boolean>
	>({});

	const validateTracking = useCallback(
		(type: TrackingIntegrationType, value: string) => {
			const error = validateTrackingId(type, value);
			setTrackingErrors((prev) => ({ ...prev, [type]: error || undefined }));
			return error;
		},
		[],
	);

	const markTrackingTouched = useCallback((type: TrackingIntegrationType) => {
		setTrackingTouched((prev) => ({ ...prev, [type]: true }));
	}, []);

	const clearTrackingValidation = useCallback(
		(type: TrackingIntegrationType) => {
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
		},
		[],
	);

	const validateAllIntegrations = useCallback(
		(integrations: FormTrackingIntegration[]): boolean => {
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

			const allTouched: Record<string, boolean> = {};
			for (const integration of integrations) {
				allTouched[integration.type] = true;
			}
			setTrackingTouched(allTouched);

			return isValid;
		},
		[],
	);

	return {
		trackingErrors,
		trackingTouched,
		validateTracking,
		markTrackingTouched,
		clearTrackingValidation,
		validateAllIntegrations,
	};
}

/** Hook for managing campaign form data state and handlers */
function useCampaignFormData(initialData?: Partial<CampaignFormData>) {
	const [formData, setFormData] = useState<CampaignFormData>(() =>
		createInitialFormData(initialData),
	);

	const handleFieldChange = useCallback(
		(
			field: keyof Pick<CampaignFormData, "name" | "description">,
			value: string,
		) => {
			setFormData((prev) => ({ ...prev, [field]: value }));
		},
		[],
	);

	const handleSettingChange = useCallback(
		(setting: keyof CampaignSettings, value: boolean | string) => {
			setFormData((prev) => ({
				...prev,
				settings: { ...prev.settings, [setting]: value },
			}));
		},
		[],
	);

	const handleReferralConfigChange = useCallback(
		(
			field: keyof NonNullable<CampaignFormData["referralConfig"]>,
			value: number | boolean | string[],
		) => {
			setFormData((prev) => ({
				...prev,
				referralConfig: { ...prev.referralConfig!, [field]: value },
			}));
		},
		[],
	);

	const handleSharingChannelToggle = useCallback((channel: string) => {
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
	}, []);

	const handleFormConfigChange = useCallback(
		(
			field: keyof NonNullable<CampaignFormData["formConfig"]>,
			value: boolean,
		) => {
			setFormData((prev) => ({
				...prev,
				formConfig: { ...prev.formConfig!, [field]: value },
			}));
		},
		[],
	);

	const handleAddTrackingIntegration = useCallback(
		(type: TrackingIntegrationType) => {
			setFormData((prev) => {
				if (prev.trackingConfig?.integrations.some((i) => i.type === type)) {
					return prev;
				}
				return {
					...prev,
					trackingConfig: {
						integrations: [
							...(prev.trackingConfig?.integrations ?? []),
							{ type, enabled: true, id: "" },
						],
					},
				};
			});
		},
		[],
	);

	const handleRemoveTrackingIntegration = useCallback(
		(type: TrackingIntegrationType) => {
			setFormData((prev) => ({
				...prev,
				trackingConfig: {
					integrations:
						prev.trackingConfig?.integrations.filter((i) => i.type !== type) ??
						[],
				},
			}));
		},
		[],
	);

	const handleTrackingIntegrationChange = useCallback(
		(type: TrackingIntegrationType, field: "id" | "label", value: string) => {
			setFormData((prev) => ({
				...prev,
				trackingConfig: {
					integrations:
						prev.trackingConfig?.integrations.map((i) =>
							i.type === type ? { ...i, [field]: value } : i,
						) ?? [],
				},
			}));
		},
		[],
	);

	return {
		formData,
		handleFieldChange,
		handleSettingChange,
		handleReferralConfigChange,
		handleSharingChannelToggle,
		handleFormConfigChange,
		handleAddTrackingIntegration,
		handleRemoveTrackingIntegration,
		handleTrackingIntegrationChange,
	};
}

// ============================================================================
// Component
// ============================================================================

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
	disabled = false,
	className: customClassName,
	...props
}) {
	const isDisabled = disabled || loading;
	// Hooks
	const {
		formData,
		handleFieldChange,
		handleSettingChange,
		handleReferralConfigChange,
		handleSharingChannelToggle,
		handleFormConfigChange,
		handleAddTrackingIntegration,
		handleRemoveTrackingIntegration,
		handleTrackingIntegrationChange,
	} = useCampaignFormData(initialData);

	const {
		errors,
		touched,
		setErrors,
		validateField,
		markTouched,
		markAllTouched,
	} = useFormValidation();

	const {
		trackingErrors,
		trackingTouched,
		validateTracking,
		markTrackingTouched,
		clearTrackingValidation,
		validateAllIntegrations,
	} = useTrackingValidation();

	const { hasFeature } = useTier();

	// Feature access checks
	const hasAntiSpam = hasFeature("anti_spam_protection");
	const hasEmail = hasFeature("email_verification");
	const hasReferrals = hasFeature("referral_system");
	const hasTracking = hasFeature("tracking_pixels");

	// Handlers
	const handleBlur = useCallback(
		(field: keyof FormErrors) => {
			markTouched(field);
			validateField(field, formData[field] || "");
		},
		[markTouched, validateField, formData],
	);

	const handleChange = useCallback(
		(
			field: keyof Pick<CampaignFormData, "name" | "description">,
			value: string,
		) => {
			handleFieldChange(field, value);
			if (touched[field]) {
				validateField(field, value);
			}
		},
		[handleFieldChange, touched, validateField],
	);

	const handleTrackingIdBlur = useCallback(
		(type: TrackingIntegrationType, value: string) => {
			markTrackingTouched(type);
			validateTracking(type, value);
		},
		[markTrackingTouched, validateTracking],
	);

	const handleTrackingChange = useCallback(
		(type: TrackingIntegrationType, field: "id" | "label", value: string) => {
			handleTrackingIntegrationChange(type, field, value);
			if (field === "id" && trackingTouched[type]) {
				validateTracking(type, value);
			}
		},
		[handleTrackingIntegrationChange, trackingTouched, validateTracking],
	);

	const handleRemoveTracking = useCallback(
		(type: TrackingIntegrationType) => {
			handleRemoveTrackingIntegration(type);
			clearTrackingValidation(type);
		},
		[handleRemoveTrackingIntegration, clearTrackingValidation],
	);

	const handleSubmit = useCallback(
		async (e: FormEvent) => {
			e.preventDefault();

			const nameError = validateFormField("name", formData.name);
			const descriptionError = validateFormField(
				"description",
				formData.description || "",
			);

			const trackingValid = validateAllIntegrations(
				formData.trackingConfig?.integrations ?? [],
			);

			if (nameError || descriptionError) {
				setErrors({
					name: nameError || undefined,
					description: descriptionError || undefined,
				});
				markAllTouched();
				return;
			}

			if (!trackingValid) {
				return;
			}

			await onSubmit(formData);
		},
		[formData, validateAllIntegrations, setErrors, markAllTouched, onSubmit],
	);

	// Derived state
	const availableIntegrations = getAvailableIntegrations(
		formData.trackingConfig?.integrations ?? [],
	);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Render
	return (
		<form className={classNames} onSubmit={handleSubmit} {...props}>
			<Stack gap="lg">
				{/* General Section */}
				<Stack gap="md">
					<Stack gap="xs" className={styles.sectionHeader}>
						<Text as="h3" size="lg" weight="semibold">
							General
						</Text>
						<Text color="muted" size="sm">
							Basic information about your campaign
						</Text>
					</Stack>

					<Input
						id="campaign-name"
						type="text"
						value={formData.name}
						onChange={(e) => handleChange("name", e.target.value)}
						onBlur={() => handleBlur("name")}
						placeholder="e.g., Product Launch 2025"
						disabled={isDisabled}
						required
						isError={!!(touched.name && errors.name)}
					/>

					<Input
						id="campaign-description"
						type="text"
						value={formData.description}
						onChange={(e) => handleChange("description", e.target.value)}
						onBlur={() => handleBlur("description")}
						placeholder="Describe your campaign..."
						disabled={isDisabled}
						isError={!!(touched.description && errors.description)}
					/>
				</Stack>

				<Divider />

				{/* Signup Options Section */}
				<Stack gap="lg">
					<Stack gap="xs" className={styles.sectionHeader}>
						<Text as="h3" size="lg" weight="semibold">
							Signup Options
						</Text>
						<Text color="muted" size="sm">
							Configure how users sign up for your waitlist
						</Text>
					</Stack>

					<FeatureGate feature="email_verification">
						<Checkbox
							checked={formData.settings.emailVerificationRequired}
							onChange={(e) =>
								handleSettingChange(
									"emailVerificationRequired",
									e.target.checked,
								)
							}
							disabled={isDisabled || !hasEmail}
							label="Require email verification"
							description="Users must verify their email before being added to waitlist"
						/>
					</FeatureGate>

					<Stack gap="xs">
						<Label>Duplicate Email Handling</Label>
						<Dropdown
							placeholder="Select handling method"
							size="md"
							items={[
								{
									id: "block",
									label: "Block - Reject duplicate signups",
									description: "Prevent users from signing up multiple times",
								},
								{
									id: "update",
									label: "Update - Replace existing entry",
									description: "Update the existing user information",
								},
								{
									id: "allow",
									label: "Allow - Create new entry",
									description: "Allow duplicate signups with separate entries",
								},
							]}
							value={formData.settings.duplicateHandling}
							disabled={isDisabled}
							onChange={(id) => handleSettingChange("duplicateHandling", id)}
						/>
					</Stack>

					<FeatureGate feature="anti_spam_protection">
						<Checkbox
							checked={formData.formConfig?.captchaEnabled ?? false}
							onChange={(e) =>
								handleFormConfigChange("captchaEnabled", e.target.checked)
							}
							disabled={isDisabled || !hasAntiSpam}
							label="Enable CAPTCHA"
							description="Protect your waitlist from bots and spam submissions"
						/>
					</FeatureGate>
				</Stack>

				<Divider />

				{/* Email Settings Section */}
				<EmailSettingsSection
					campaignId={campaignId}
					verificationRequired={formData.settings.emailVerificationRequired}
					sendWelcomeEmail={formData.settings.sendWelcomeEmail}
					onSendWelcomeEmailChange={(value) =>
						handleSettingChange("sendWelcomeEmail", value)
					}
					disabled={isDisabled}
					locked={!hasEmail}
				/>

				<Divider />

				{/* Growth Features Section */}
				<Stack gap="lg">
					<Stack gap="xs" className={styles.sectionHeader}>
						<Text as="h3" size="lg" weight="semibold">
							Growth Features
						</Text>
						<Text color="muted" size="sm">
							Enable viral growth and engagement features
						</Text>
					</Stack>

					<FeatureGate feature="referral_system">
						<Checkbox
							checked={formData.settings.enableReferrals}
							onChange={(e) =>
								handleSettingChange("enableReferrals", e.target.checked)
							}
							disabled={isDisabled || !hasReferrals}
							label="Enable referral system"
							description="Allow users to refer others and track viral growth"
						/>
					</FeatureGate>

					{/* Referral Configuration - Only show if referrals are enabled */}
					{formData.settings.enableReferrals && (
						<Card variant="filled" padding="md" className={styles.subsection}>
							<Stack gap="md">
								<TextField
									id="points-per-referral"
									label="Points per Referral"
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
									disabled={isDisabled || !hasReferrals}
									min={1}
									max={100}
								/>

								<Checkbox
									checked={formData.referralConfig?.verifiedOnly ?? false}
									onChange={(e) =>
										handleReferralConfigChange("verifiedOnly", e.target.checked)
									}
									disabled={isDisabled || !hasReferrals}
									label="Count verified referrals only"
									description="Only count referrals that have verified their email"
								/>

								<TextField
									id="referrer-positions-to-jump"
									label="Referrer Bonus"
									helperText="Positions the referrer moves up per successful referral"
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
									disabled={isDisabled || !hasReferrals}
									min={1}
									max={1000}
								/>

								<TextField
									id="positions-to-jump"
									label="Referee Bonus"
									helperText="Positions new signups move up when using a referral link"
									type="number"
									value={
										formData.referralConfig?.positionsToJump.toString() || "0"
									}
									onChange={(e) =>
										handleReferralConfigChange(
											"positionsToJump",
											parseInt(e.target.value) || 0,
										)
									}
									placeholder="0"
									disabled={isDisabled || !hasReferrals}
									min={0}
									max={1000}
								/>

								<Stack gap="sm">
									<Label>Sharing Channels</Label>
									<Text color="muted" size="sm">
										Platforms users can share their referral link on
									</Text>
									<Stack gap="xs">
										{[
											{ value: "email", label: "Email" },
											{ value: "twitter", label: "Twitter/X" },
											{ value: "facebook", label: "Facebook" },
											{ value: "linkedin", label: "LinkedIn" },
											{ value: "whatsapp", label: "WhatsApp" },
										].map((channel) => (
											<Checkbox
												key={channel.value}
												checked={
													formData.referralConfig?.sharingChannels.includes(
														channel.value,
													) ?? false
												}
												onChange={() =>
													handleSharingChannelToggle(channel.value)
												}
												disabled={isDisabled || !hasReferrals}
												label={channel.label}
											/>
										))}
									</Stack>
								</Stack>
							</Stack>
						</Card>
					)}

					<FeatureGate feature="referral_system">
						<Checkbox
							checked={formData.settings.enableRewards}
							onChange={(e) =>
								handleSettingChange("enableRewards", e.target.checked)
							}
							disabled={isDisabled || !hasReferrals}
							label="Enable reward system"
							description="Reward users for reaching referral milestones"
						/>
					</FeatureGate>
				</Stack>

				<Divider />

				{/* Conversion Tracking Section */}
				<Stack gap="lg">
					<Stack gap="xs" className={styles.sectionHeader}>
						<Text as="h3" size="lg" weight="semibold">
							Conversion Tracking
						</Text>
						<Text color="muted" size="sm">
							Add tracking pixels to fire when users complete signup
						</Text>
					</Stack>

					{/* Add Integration Dropdown */}
					{availableIntegrations.length > 0 && (
						<FeatureGate feature="tracking_pixels">
							<Stack gap="xs">
								<Label>Add Tracking Integration</Label>
								<Dropdown
									placeholder="Select a tracking platform..."
									size="md"
									items={availableIntegrations.map((integration) => ({
										id: integration.type,
										label: integration.label,
										description: `ID format: ${integration.placeholder}`,
									}))}
									disabled={isDisabled || !hasTracking}
									onChange={(id) =>
										handleAddTrackingIntegration(id as TrackingIntegrationType)
									}
								/>
							</Stack>
						</FeatureGate>
					)}

					{/* Configured Integrations List */}
					{formData.trackingConfig?.integrations &&
						formData.trackingConfig.integrations.length > 0 && (
							<Stack gap="sm">
								{formData.trackingConfig.integrations.map((integration) => {
									const integrationInfo = TRACKING_INTEGRATIONS.find(
										(i) => i.type === integration.type,
									);
									if (!integrationInfo) return null;

									return (
										<Card key={integration.type} variant="filled" padding="md">
											<Stack gap="sm">
												<Stack direction="row" align="center" justify="between">
													<Stack direction="row" align="center" gap="sm">
														<i
															className={`${integrationInfo.icon} ${styles.integrationIcon}`}
															aria-hidden="true"
														/>
														<Text weight="medium">{integrationInfo.label}</Text>
													</Stack>
													<Button
														leftIcon={<Trash2 size={16} />}
														variant="ghost"
														size="sm"
														aria-label={`Remove ${integrationInfo.label}`}
														onClick={() =>
															handleRemoveTracking(integration.type)
														}
														disabled={isDisabled || !hasTracking}
													/>
												</Stack>
												<Stack gap="sm">
													<Input
														id={`tracking-${integration.type}-id`}
														type="text"
														value={integration.id}
														onChange={(e) =>
															handleTrackingChange(
																integration.type,
																"id",
																e.target.value,
															)
														}
														onBlur={() =>
															handleTrackingIdBlur(
																integration.type,
																integration.id,
															)
														}
														placeholder={integrationInfo.placeholder}
														disabled={isDisabled || !hasTracking}
														required
														isError={
															!!(
																trackingTouched[integration.type] &&
																trackingErrors[integration.type]
															)
														}
													/>
													{integrationInfo.hasLabel && (
														<Input
															id={`tracking-${integration.type}-label`}
															type="text"
															value={integration.label || ""}
															onChange={(e) =>
																handleTrackingChange(
																	integration.type,
																	"label",
																	e.target.value,
																)
															}
															placeholder="Enter conversion label"
															disabled={isDisabled || !hasTracking}
														/>
													)}
												</Stack>
											</Stack>
										</Card>
									);
								})}
							</Stack>
						)}

					{formData.trackingConfig?.integrations.length === 0 && (
						<Text
							color="muted"
							size="sm"
							align="center"
							className={styles.emptyState}
						>
							No tracking integrations configured. Add one above to track
							conversions.
						</Text>
					)}
				</Stack>

				{/* Divider */}
				<Divider />

				{/* Form Actions - only show when not disabled */}
				{!disabled && (
					<Stack direction="row" justify="end" gap="sm">
						{onCancel && (
							<Button
								type="button"
								onClick={onCancel}
								disabled={loading}
								variant="outline"
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
									<Loader2 size={16} className={styles.spin} />
								) : (
									<Check size={16} />
								)
							}
						>
							{loading ? "Saving..." : submitText}
						</Button>
					</Stack>
				)}
			</Stack>
		</form>
	);
});

CampaignForm.displayName = "CampaignForm";
