/**
 * FormRenderer Component
 * Renders a complete form with fields, layout, and submit functionality
 */

import { memo, useCallback, useRef, useState } from "react";
import { ChannelReferralLinks } from "@/features/referrals/components/ChannelReferralLinks/component";
import { useConversionTracking } from "@/hooks/useConversionTracking";
import type { SignupResponse } from "@/hooks/useFormSubmission";
import type { SharingChannel, TrackingIntegration } from "@/types/campaign";
import type {
	FormDesign,
	FormField as FormFieldType,
} from "@/types/common.types";
import { useFormState } from "../../hooks/useFormState";
import { useFormStyles } from "../../hooks/useFormStyles";
import { FormField } from "../FormField/component";
import styles from "./component.module.scss";

/** Captcha configuration for form protection */
export interface CaptchaConfig {
	/** Whether captcha is enabled */
	enabled: boolean;
	/** Captcha provider (currently only turnstile is supported) */
	provider: "turnstile";
	/** Site key for the captcha provider */
	siteKey: string;
}

/** Minimal config interface - only requires what FormRenderer actually uses */
export interface FormRendererConfig {
	fields: FormFieldType[];
	design: FormDesign;
	/** Optional captcha configuration */
	captcha?: CaptchaConfig;
}

/** Options passed to onSubmit handler */
export interface FormSubmitOptions {
	/** Captcha token if verification was required */
	captchaToken?: string;
}

/** Status message configuration for non-active campaigns */
export interface StatusMessage {
	/** Title of the status message */
	title: string;
	/** Description of why the form is not accepting submissions */
	message: string;
}

export interface FormRendererProps {
	/** Form configuration (only fields and design are required) */
	config: FormRendererConfig;
	/** Render mode: preview (disabled) or interactive (functional) */
	mode: "preview" | "interactive";
	/** Submit handler for interactive mode */
	onSubmit?: (
		data: Record<string, string>,
		options?: FormSubmitOptions,
	) => Promise<unknown>;
	/** Submit button text */
	submitText?: string;
	/** Success message after submission */
	successMessage?: string;
	/** Success title after submission */
	successTitle?: string;
	/** Signup response data containing referral codes */
	signupData?: SignupResponse | null;
	/** Enabled sharing channels from campaign config */
	enabledChannels?: SharingChannel[];
	/** Base URL for referral links (the URL where the form is embedded) */
	embedUrl?: string;
	/** Tracking integrations for conversion pixels */
	trackingIntegrations?: TrackingIntegration[];
	/** Status message to display when form is not accepting submissions */
	statusMessage?: StatusMessage | null;
	/** Additional CSS class name */
	className?: string;
}

/**
 * FormRenderer displays a complete form with dynamic styling
 */
export const FormRenderer = memo<FormRendererProps>(function FormRenderer({
	config,
	mode,
	onSubmit,
	submitText = "Submit",
	successMessage = "We'll be in touch soon.",
	successTitle = "Thank you for signing up!",
	signupData,
	enabledChannels = [],
	embedUrl,
	trackingIntegrations,
	statusMessage,
	className,
}) {
	const { fields, design, captcha } = config;
	const formStyles = useFormStyles(design);
	const { formData, errors, handleChange, validate, clearErrors } =
		useFormState();

	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [captchaToken, setCaptchaToken] = useState<string | null>(null);
	const [captchaError] = useState(false);
	const turnstileRef = useRef<HTMLDivElement>(null);

	// Fire conversion tracking when form is submitted (only in interactive mode)
	useConversionTracking(
		trackingIntegrations,
		submitted && mode === "interactive",
	);

	// Check if captcha is required and configured
	const isCaptchaEnabled =
		captcha?.enabled && captcha?.provider === "turnstile" && captcha?.siteKey;

	// Sort fields by order
	const sortedFields = [...fields].sort((a, b) => a.order - b.order);

	// Handle form submission
	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			if (mode === "preview") return;

			// Validate all fields
			if (!validate(sortedFields)) {
				return;
			}

			// Check captcha if required
			if (isCaptchaEnabled && !captchaToken) {
				setSubmitError("Please complete the captcha verification");
				return;
			}

			setSubmitting(true);
			setSubmitError(null);
			clearErrors();

			try {
				if (onSubmit) {
					await onSubmit(formData, {
						captchaToken: captchaToken || undefined,
					});
				}
				setSubmitted(true);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Failed to submit form";
				setSubmitError(message);
				// Reset captcha on error so user can try again
				// TODO: Implement captcha reset when Turnstile is integrated
				setCaptchaToken(null);
			} finally {
				setSubmitting(false);
			}
		},
		[
			mode,
			validate,
			sortedFields,
			formData,
			onSubmit,
			clearErrors,
			isCaptchaEnabled,
			captchaToken,
		],
	);

	// Handle field change - maps field.id to formData key
	const handleFieldChange = useCallback(
		(field: FormFieldType) => (value: string) => {
			handleChange(field.id, value);
		},
		[handleChange],
	);

	// Get field value - uses field.id as key
	const getFieldValue = useCallback(
		(field: FormFieldType) => {
			return formData[field.id] || "";
		},
		[formData],
	);

	// Get field error
	const getFieldError = useCallback(
		(field: FormFieldType) => {
			return errors[field.id];
		},
		[errors],
	);

	const isDisabled = mode === "preview";
	const isTwoColumn = design.layout === "two-column";
	const isFullWidthButton = design.layout === "single-column";

	const formClassName = [styles.form, className].filter(Boolean).join(" ");

	const buttonClassName = [
		styles.submitButton,
		isFullWidthButton && styles["submitButton--fullWidth"],
	]
		.filter(Boolean)
		.join(" ");

	// Split fields by column for two-column layout using Object.groupBy (ES2025)
	const columnGroups = Object.groupBy(sortedFields, (f) => f.column ?? 1);
	const leftColumnFields = columnGroups[1] ?? [];
	const rightColumnFields = columnGroups[2] ?? [];

	// Check if we have referral data to display
	const hasReferralLinks =
		signupData?.referral_codes && enabledChannels.length > 0 && embedUrl;

	// Show success state
	if (submitted) {
		return (
			<div className={formClassName} style={formStyles}>
				<div className={styles.success}>
					<i
						className={`ri-check-circle-line ${styles.successIcon}`}
						aria-hidden="true"
					/>
					<h2 className={styles.successTitle}>{successTitle}</h2>
					<p className={styles.successMessage}>{successMessage}</p>

					{/* Show channel-specific referral links if available */}
					{hasReferralLinks && (
						<div className={styles.referralSection}>
							<ChannelReferralLinks
								referralCodes={signupData.referral_codes!}
								enabledChannels={enabledChannels}
								baseUrl={embedUrl}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}

	// Render a field
	const renderField = (field: FormFieldType) => (
		<FormField
			key={field.id}
			field={field}
			value={getFieldValue(field)}
			onChange={handleFieldChange(field)}
			disabled={isDisabled}
			error={getFieldError(field)}
		/>
	);

	return (
		<form
			className={formClassName}
			style={formStyles}
			onSubmit={handleSubmit}
			noValidate
		>
			{/* Status message banner for non-active campaigns */}
			{statusMessage && (
				<div className={styles.statusBanner}>
					<h3 className={styles.statusTitle}>{statusMessage.title}</h3>
					<p className={styles.statusMessage}>{statusMessage.message}</p>
				</div>
			)}

			{/* Submit error */}
			{submitError && (
				<div className={styles.error} role="alert">
					{submitError}
				</div>
			)}

			{/* Form fields */}
			{isTwoColumn ? (
				<div className={styles.fieldsGrid}>
					<div className={styles.column}>
						{leftColumnFields.map(renderField)}
					</div>
					<div className={styles.column}>
						{rightColumnFields.map(renderField)}
					</div>
				</div>
			) : (
				<div className={styles.fields}>{sortedFields.map(renderField)}</div>
			)}

			{/* Captcha widget placeholder - Turnstile integration pending */}
			{isCaptchaEnabled && captcha && (
				<div className={styles.captcha} ref={turnstileRef}>
					<div className={styles.captchaPlaceholder}>
						<i className="ri-shield-check-line" aria-hidden="true" />
						<span>Captcha verification</span>
					</div>
					{captchaError && (
						<div className={styles.captchaError}>
							Captcha verification failed. Please try again.
						</div>
					)}
				</div>
			)}

			{/* Submit button */}
			<button
				type="submit"
				className={buttonClassName}
				disabled={isDisabled || submitting}
			>
				{submitting ? "Submitting..." : submitText}
			</button>

			{/* Custom CSS injection */}
			{design.customCss && !design.customCss.startsWith("__DESIGN__:") && (
				<style>{design.customCss}</style>
			)}
		</form>
	);
});

FormRenderer.displayName = "FormRenderer";
