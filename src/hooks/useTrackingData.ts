/**
 * useTrackingData Hook
 * Extracts tracking data from URL parameters and browser metadata
 */

import { useEffect, useState } from "react";
import type { UserMetadata, UTMParams } from "@/types/users.types";

export interface TrackingData {
	/** Referral code from ?ref= parameter */
	refCode: string | null;
	/** UTM parameters for campaign tracking */
	utmParams: UTMParams | undefined;
	/** Derived traffic source */
	source: string;
	/** Browser and device metadata */
	metadata: UserMetadata;
}

/**
 * Detect device type from user agent
 */
function getDeviceType(): UserMetadata["device"] {
	const ua = navigator.userAgent.toLowerCase();
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return "tablet";
	}
	if (
		/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(
			ua,
		)
	) {
		return "mobile";
	}
	return "desktop";
}

/**
 * Extract UTM parameters from URL search params
 */
function getUTMParams(searchParams: URLSearchParams): UTMParams | undefined {
	const utmSource = searchParams.get("utm_source");
	const utmMedium = searchParams.get("utm_medium");
	const utmCampaign = searchParams.get("utm_campaign");
	const utmContent = searchParams.get("utm_content");
	const utmTerm = searchParams.get("utm_term");

	// Only return if at least one UTM param is present
	if (!utmSource && !utmMedium && !utmCampaign && !utmContent && !utmTerm) {
		return undefined;
	}

	return {
		source: utmSource || undefined,
		medium: utmMedium || undefined,
		campaign: utmCampaign || undefined,
		content: utmContent || undefined,
		term: utmTerm || undefined,
	};
}

/**
 * Determine traffic source from available data
 */
function getTrafficSource(
	refCode: string | null,
	utmParams: UTMParams | undefined,
): string {
	// If referred by someone, it's a referral
	if (refCode) {
		return "referral";
	}

	// Use UTM source if available
	if (utmParams?.source) {
		return utmParams.source;
	}

	// Check document referrer
	const referrer = document.referrer;
	if (!referrer) {
		return "direct";
	}

	// Parse referrer to determine source
	try {
		const referrerUrl = new URL(referrer);
		const referrerHost = referrerUrl.hostname.toLowerCase();

		// Check for common sources
		if (referrerHost.includes("google")) return "google";
		if (referrerHost.includes("facebook") || referrerHost.includes("fb.com"))
			return "facebook";
		if (referrerHost.includes("twitter") || referrerHost.includes("t.co"))
			return "twitter";
		if (referrerHost.includes("linkedin")) return "linkedin";
		if (referrerHost.includes("instagram")) return "instagram";
		if (referrerHost.includes("youtube")) return "youtube";
		if (referrerHost.includes("tiktok")) return "tiktok";
		if (referrerHost.includes("reddit")) return "reddit";

		// Return the hostname as source
		return referrerHost;
	} catch {
		return "unknown";
	}
}

/**
 * Hook to extract tracking data from URL and browser
 * Captures referral codes, UTM parameters, and device metadata
 *
 * @returns TrackingData object with all captured tracking info
 *
 * @example
 * ```tsx
 * const tracking = useTrackingData();
 *
 * // Use in form submission
 * const handleSubmit = async (formData) => {
 *   await fetch('/api/submit', {
 *     body: JSON.stringify({
 *       ...formData,
 *       ref_code: tracking.refCode,
 *       source: tracking.source,
 *       utm_params: tracking.utmParams,
 *       metadata: tracking.metadata,
 *     }),
 *   });
 * };
 * ```
 */
export const useTrackingData = (): TrackingData => {
	const [tracking, setTracking] = useState<TrackingData>(() => ({
		refCode: null,
		utmParams: undefined,
		source: "direct",
		metadata: {
			device: "desktop",
		},
	}));

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const refCode = searchParams.get("ref");
		const utmParams = getUTMParams(searchParams);
		const source = getTrafficSource(refCode, utmParams);
		const metadata: UserMetadata = {
			userAgent: navigator.userAgent,
			device: getDeviceType(),
		};

		setTracking({
			refCode,
			utmParams,
			source,
			metadata,
		});
	}, []);

	return tracking;
};
