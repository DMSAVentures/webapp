/**
 * useFormSubmission Hook
 * Handles form submission with tracking data
 */

import { useCallback, useState } from "react";
import type { TrackingData } from "./useTrackingData";

interface FormSubmissionPayload {
	email: string;
	terms_accepted: boolean;
	custom_fields: Record<string, string>;
	source: string;
	metadata: TrackingData["metadata"];
	ref_code?: string;
	utm_params?: TrackingData["utmParams"];
}

interface UseFormSubmissionResult {
	submit: (formData: Record<string, string>) => Promise<void>;
	submitting: boolean;
	submitted: boolean;
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
	const [error, setError] = useState<string | null>(null);

	const submit = useCallback(
		async (formData: Record<string, string>) => {
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
					custom_fields: customFields,
					source: tracking.source,
					metadata: tracking.metadata,
				};

				// Add referral code if present
				if (tracking.refCode) {
					payload.ref_code = tracking.refCode;
				}

				// Add UTM parameters if present
				if (tracking.utmParams) {
					payload.utm_params = tracking.utmParams;
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

				setSubmitted(true);
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
		setError(null);
	}, []);

	return {
		submit,
		submitting,
		submitted,
		error,
		reset,
	};
};
