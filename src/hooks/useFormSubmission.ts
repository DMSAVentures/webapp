/**
 * useFormSubmission Hook
 * Handles form submission with tracking data
 */

import { useCallback, useState } from "react";
import type { SharingChannel } from "@/types/campaign";
import type { TrackingData } from "./useTrackingData";

interface FormSubmissionPayload {
	email: string;
	terms_accepted: boolean;
	marketing_consent: boolean;
	custom_fields: Record<string, string>;
	referral_code?: string;
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_content?: string;
	utm_term?: string;
	captcha_token?: string;
}

/**
 * Response from the signup API endpoint
 */
export interface SignupResponse {
	user_id: string;
	referral_codes?: Partial<Record<SharingChannel, string>>;
}

interface SubmitOptions {
	/** Captcha token from Turnstile verification */
	captchaToken?: string;
}

interface UseFormSubmissionResult {
	submit: (
		formData: Record<string, string>,
		options?: SubmitOptions,
	) => Promise<SignupResponse | undefined>;
	submitting: boolean;
	submitted: boolean;
	signupData: SignupResponse | null;
	error: string | null;
	reset: () => void;
}

interface UseFormSubmissionOptions {
	/** Campaign ID for the submission endpoint */
	campaignId: string;
	/** Field configurations to extract custom fields */
	fields: Array<{ name: string }>;
	/** Tracking data from useTrackingData hook */
	tracking: TrackingData;
}

/**
 * Hook to handle form submission with tracking data
 *
 * @param options - Configuration for the submission
 * @returns Submit function, loading/success states, and error handling
 *
 * @example
 * ```tsx
 * const tracking = useTrackingData();
 * const { submit, submitting, submitted, error } = useFormSubmission({
 *   campaignId,
 *   fields: campaign.form_config.fields,
 *   tracking,
 * });
 *
 * const handleSubmit = async (formData) => {
 *   await submit(formData);
 * };
 * ```
 */
export const useFormSubmission = ({
	campaignId,
	fields,
	tracking,
}: UseFormSubmissionOptions): UseFormSubmissionResult => {
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [signupData, setSignupData] = useState<SignupResponse | null>(null);
	const [error, setError] = useState<string | null>(null);

	const submit = useCallback(
		async (formData: Record<string, string>, options?: SubmitOptions) => {
			setSubmitting(true);
			setError(null);

			try {
				// Build custom fields (exclude email - it's a required top-level field)
				const customFields: Record<string, string> = {};

				fields.forEach((field) => {
					const value = formData[field.name] || "";
					if (field.name !== "email") {
						customFields[field.name] = value;
					}
				});

				// Build submission payload with tracking data
				const payload: FormSubmissionPayload = {
					email: formData.email || "",
					terms_accepted: true,
					marketing_consent: true,
					custom_fields: customFields,
				};

				// Add captcha token if provided
				if (options?.captchaToken) {
					payload.captcha_token = options.captchaToken;
				}

				// Add referral code if present
				if (tracking.refCode) {
					payload.referral_code = tracking.refCode;
				}

				// Add UTM parameters as flat fields
				if (tracking.utmParams) {
					if (tracking.utmParams.source) {
						payload.utm_source = tracking.utmParams.source;
					}
					if (tracking.utmParams.medium) {
						payload.utm_medium = tracking.utmParams.medium;
					}
					if (tracking.utmParams.campaign) {
						payload.utm_campaign = tracking.utmParams.campaign;
					}
					if (tracking.utmParams.content) {
						payload.utm_content = tracking.utmParams.content;
					}
					if (tracking.utmParams.term) {
						payload.utm_term = tracking.utmParams.term;
					}
				}

				// Submit to API
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/users`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(payload),
					},
				);

				if (!response.ok) {
					let errorMessage = "Failed to submit form";
					try {
						const errorData = await response.json();
						errorMessage = errorData.error || errorMessage;
					} catch {
						errorMessage = `Failed to submit form (${response.status})`;
					}
					throw new Error(errorMessage);
				}

				// Parse and store the signup response
				const responseData: SignupResponse = await response.json();
				setSignupData(responseData);
				setSubmitted(true);

				return responseData;
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Failed to submit form";
				setError(message);
				throw err;
			} finally {
				setSubmitting(false);
			}
		},
		[campaignId, fields, tracking],
	);

	const reset = useCallback(() => {
		setSubmitted(false);
		setSignupData(null);
		setError(null);
	}, []);

	return {
		submit,
		submitting,
		submitted,
		signupData,
		error,
		reset,
	};
};
