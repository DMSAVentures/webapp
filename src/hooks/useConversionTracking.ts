/**
 * useConversionTracking Hook
 *
 * Fires tracking pixels when a user completes signup on the thank you page.
 * Only fires in production/embed mode, not in preview mode.
 */

import { useEffect, useRef } from "react";
import type { TrackingIntegration } from "@/types/campaign";

interface FbqFunction {
	(...args: unknown[]): void;
	push?: (...args: unknown[]) => void;
	loaded?: boolean;
	version?: string;
	queue?: unknown[];
	callMethod?: (...args: unknown[]) => void;
}

interface TtqFunction {
	(...args: unknown[]): void;
	track: (event: string, data?: Record<string, unknown>) => void;
	page: () => void;
	load: (pixelId: string) => void;
	methods?: string[];
	setAndDefer?: (t: Record<string, unknown>, e: string) => void;
	instance?: (t: string) => unknown[];
	_i?: Record<string, unknown[] & { _u?: string }>;
	push?: (...args: unknown[]) => void;
	[key: string]: unknown;
}

declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
		fbq?: FbqFunction;
		_fbq?: FbqFunction;
		ttq?: TtqFunction;
		lintrk?: (action: string, data: { conversion_id: number }) => void;
		dataLayer?: unknown[];
		_linkedin_data_partner_ids?: string[];
	}
}

/**
 * Load a script dynamically if not already loaded
 */
function loadScript(src: string, id: string): Promise<void> {
	return new Promise((resolve, reject) => {
		// Check if script already exists
		if (document.getElementById(id)) {
			resolve();
			return;
		}

		const script = document.createElement("script");
		script.id = id;
		script.src = src;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
		document.head.appendChild(script);
	});
}

/**
 * Initialize and fire Google Analytics conversion
 */
async function fireGoogleAnalytics(
	integration: TrackingIntegration,
): Promise<void> {
	const id = integration.trackingId;
	if (!id) return;

	try {
		// Load gtag.js if not present
		if (!window.gtag) {
			await loadScript(
				`https://www.googletagmanager.com/gtag/js?id=${id}`,
				"gtag-script",
			);

			// Initialize gtag
			window.gtag = function gtag(...args: unknown[]) {
				(window.dataLayer = window.dataLayer || []).push(args);
			};
			window.gtag("js", new Date());
			window.gtag("config", id);
		}

		// Fire conversion event
		window.gtag("event", "conversion", {
			send_to: id,
		});
	} catch (error) {
		console.error("Failed to fire Google Analytics conversion:", error);
	}
}

/**
 * Initialize and fire Meta Pixel conversion
 */
async function fireMetaPixel(integration: TrackingIntegration): Promise<void> {
	const id = integration.trackingId;
	if (!id) return;

	try {
		// Load Facebook Pixel if not present
		if (!window.fbq) {
			await loadScript(
				"https://connect.facebook.net/en_US/fbevents.js",
				"facebook-pixel-script",
			);

			// Initialize fbq
			const fbq: FbqFunction = function fbq(...args: unknown[]) {
				const _fbq = (window._fbq = window._fbq || window.fbq);
				if (_fbq?.callMethod) {
					_fbq.callMethod(...args);
				} else {
					_fbq?.queue?.push(args);
				}
			};
			fbq.push = fbq;
			fbq.loaded = true;
			fbq.version = "2.0";
			fbq.queue = [];
			window.fbq = fbq;
			window.fbq("init", id);
		}

		// Fire Lead event (common for signups)
		window.fbq("track", "Lead");
	} catch (error) {
		console.error("Failed to fire Meta Pixel conversion:", error);
	}
}

/**
 * Initialize and fire Google Ads conversion
 */
async function fireGoogleAds(integration: TrackingIntegration): Promise<void> {
	const id = integration.trackingId;
	const label = integration.trackingLabel;
	if (!id) return;

	try {
		// Load gtag.js if not present
		if (!window.gtag) {
			await loadScript(
				`https://www.googletagmanager.com/gtag/js?id=${id}`,
				"gtag-script",
			);

			window.gtag = function gtag(...args: unknown[]) {
				(window.dataLayer = window.dataLayer || []).push(args);
			};
			window.gtag("js", new Date());
			window.gtag("config", id);
		}

		// Fire conversion with label
		window.gtag("event", "conversion", {
			send_to: label ? `${id}/${label}` : id,
		});
	} catch (error) {
		console.error("Failed to fire Google Ads conversion:", error);
	}
}

/**
 * Initialize and fire TikTok Pixel conversion
 */
async function fireTikTokPixel(
	integration: TrackingIntegration,
): Promise<void> {
	const id = integration.trackingId;
	if (!id) return;

	try {
		// Load TikTok Pixel if not present
		if (!window.ttq) {
			await loadScript(
				"https://analytics.tiktok.com/i18n/pixel/events.js",
				"tiktok-pixel-script",
			);

			// Initialize ttq - using type assertion for array-based initialization
			const ttqArray: unknown[] = [];
			const ttq = ttqArray as unknown as TtqFunction;
			window.ttq = ttq;

			ttq.methods = [
				"page",
				"track",
				"identify",
				"instances",
				"debug",
				"on",
				"off",
				"once",
				"ready",
				"alias",
				"group",
				"enableCookie",
				"disableCookie",
			];

			ttq.setAndDefer = function (t: Record<string, unknown>, e: string) {
				t[e] = function (...args: unknown[]) {
					ttqArray.push([e, ...args]);
				};
			};

			for (const method of ttq.methods) {
				ttq.setAndDefer(ttq, method);
			}

			ttq.instance = function (t: string) {
				const e = ttq._i?.[t] || [];
				for (const method of ttq.methods || []) {
					ttq.setAndDefer?.(e as unknown as Record<string, unknown>, method);
				}
				return e;
			};

			ttq.load = function (pixelId: string) {
				ttq._i = ttq._i || {};
				ttq._i[pixelId] = [] as unknown[] & { _u?: string };
				ttq._i[pixelId]._u = "https://analytics.tiktok.com";
			};

			ttq.load(id);
			ttq.page();
		}

		// Fire CompleteRegistration event
		window.ttq?.track("CompleteRegistration");
	} catch (error) {
		console.error("Failed to fire TikTok Pixel conversion:", error);
	}
}

/**
 * Initialize and fire LinkedIn Insight Tag conversion
 */
async function fireLinkedInInsight(
	integration: TrackingIntegration,
): Promise<void> {
	const id = integration.trackingId;
	if (!id) return;

	try {
		// Load LinkedIn Insight Tag if not present
		if (!window.lintrk) {
			await loadScript(
				"https://snap.licdn.com/li.lms-analytics/insight.min.js",
				"linkedin-insight-script",
			);

			// Initialize lintrk
			window._linkedin_data_partner_ids =
				window._linkedin_data_partner_ids || [];
			window._linkedin_data_partner_ids.push(id);
		}

		// Fire conversion (LinkedIn tracks page views by default, but we can track a conversion)
		window.lintrk?.("track", { conversion_id: parseInt(id, 10) });
	} catch (error) {
		console.error("Failed to fire LinkedIn Insight conversion:", error);
	}
}

/**
 * Fire a tracking event for a specific integration
 */
async function fireTrackingEvent(
	integration: TrackingIntegration,
): Promise<void> {
	if (!integration.enabled || !integration.trackingId) return;

	switch (integration.integrationType) {
		case "google_analytics":
			await fireGoogleAnalytics(integration);
			break;
		case "meta_pixel":
			await fireMetaPixel(integration);
			break;
		case "google_ads":
			await fireGoogleAds(integration);
			break;
		case "tiktok_pixel":
			await fireTikTokPixel(integration);
			break;
		case "linkedin_insight":
			await fireLinkedInInsight(integration);
			break;
		default:
			console.warn(
				`Unknown tracking integration type: ${integration.integrationType}`,
			);
	}
}

/**
 * Hook to fire conversion tracking events on the thank you page
 *
 * @param trackingIntegrations - The tracking integrations from the campaign
 * @param shouldFire - Whether tracking should fire (typically when form is submitted)
 */
export function useConversionTracking(
	trackingIntegrations: TrackingIntegration[] | undefined,
	shouldFire: boolean,
): void {
	// Use ref to prevent multiple firings
	const hasFiredRef = useRef(false);

	useEffect(() => {
		// Only fire once when shouldFire becomes true
		if (!shouldFire || hasFiredRef.current) return;
		if (!trackingIntegrations?.length) return;

		hasFiredRef.current = true;

		// Fire all enabled integrations
		trackingIntegrations.forEach((integration) => {
			fireTrackingEvent(integration).catch((error) => {
				console.error(
					`Failed to fire ${integration.integrationType} tracking:`,
					error,
				);
			});
		});
	}, [shouldFire, trackingIntegrations]);
}
