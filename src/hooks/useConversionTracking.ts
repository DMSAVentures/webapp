/**
 * useConversionTracking Hook
 *
 * Fires tracking pixels when a user completes signup on the thank you page.
 * Only fires in production/embed mode, not in preview mode.
 */

import { useEffect, useRef } from "react";
import type { TrackingIntegration } from "@/types/campaign";

declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
		fbq?: (...args: unknown[]) => void;
		ttq?: {
			track: (event: string, data?: Record<string, unknown>) => void;
		};
		lintrk?: (action: string, data: { conversion_id: number }) => void;
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
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				((window as any).dataLayer = (window as any).dataLayer || []).push(
					args,
				);
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
			window.fbq = function fbq(...args: unknown[]) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				((window as any)._fbq = (window as any)._fbq || window.fbq).callMethod
					? // eslint-disable-next-line @typescript-eslint/no-explicit-any
						((window as any)._fbq as any).callMethod(...args)
					: // eslint-disable-next-line @typescript-eslint/no-explicit-any
						((window as any)._fbq as any).queue.push(args);
			};
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window.fbq as any).push = window.fbq;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window.fbq as any).loaded = true;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window.fbq as any).version = "2.0";
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window.fbq as any).queue = [];
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
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				((window as any).dataLayer = (window as any).dataLayer || []).push(
					args,
				);
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

			// Initialize ttq
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).ttq = (window as any).ttq || [];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).ttq.methods = [
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).ttq.setAndDefer = function (t: any, e: string) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				t[e] = function (...args: any[]) {
					t.push([e, ...args]);
				};
			};
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			for (const method of (window as any).ttq.methods) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(window as any).ttq.setAndDefer((window as any).ttq, method);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).ttq.instance = function (t: string) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const e = (window as any).ttq._i[t] || [];
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				for (const method of (window as any).ttq.methods) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(window as any).ttq.setAndDefer(e, method);
				}
				return e;
			};
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).ttq.load = function (pixelId: string) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(window as any).ttq._i = (window as any).ttq._i || {};
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(window as any).ttq._i[pixelId] = [];
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(window as any).ttq._i[pixelId]._u = "https://analytics.tiktok.com";
			};
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).ttq.load(id);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).ttq.page();
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any)._linkedin_data_partner_ids =
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(window as any)._linkedin_data_partner_ids || [];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any)._linkedin_data_partner_ids.push(id);
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
