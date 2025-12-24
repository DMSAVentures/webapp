/**
 * Turnstile Component
 * Wrapper for Cloudflare Turnstile captcha widget
 */

import {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import styles from "./component.module.scss";

declare global {
	interface Window {
		turnstile?: {
			render: (
				container: HTMLElement,
				options: TurnstileRenderOptions,
			) => string;
			reset: (widgetId: string) => void;
			remove: (widgetId: string) => void;
		};
	}
}

interface TurnstileRenderOptions {
	sitekey: string;
	callback?: (token: string) => void;
	"error-callback"?: () => void;
	"expired-callback"?: () => void;
	theme?: "light" | "dark" | "auto";
	size?: "normal" | "compact";
	tabindex?: number;
}

export interface TurnstileProps {
	/** Cloudflare Turnstile site key */
	siteKey: string;
	/** Callback when token is received */
	onVerify?: (token: string) => void;
	/** Callback when verification fails */
	onError?: () => void;
	/** Callback when token expires */
	onExpire?: () => void;
	/** Widget theme */
	theme?: "light" | "dark" | "auto";
	/** Widget size */
	size?: "normal" | "compact";
	/** Additional CSS class name */
	className?: string;
}

export interface TurnstileRef {
	/** Reset the widget to allow re-verification */
	reset: () => void;
	/** Get the current token (null if not verified) */
	getToken: () => string | null;
}

const TURNSTILE_SCRIPT_URL =
	"https://challenges.cloudflare.com/turnstile/v0/api.js";

/**
 * Turnstile provides Cloudflare's captcha verification
 *
 * @example
 * ```tsx
 * const turnstileRef = useRef<TurnstileRef>(null);
 * const [token, setToken] = useState<string | null>(null);
 *
 * <Turnstile
 *   ref={turnstileRef}
 *   siteKey="your-site-key"
 *   onVerify={setToken}
 *   onExpire={() => setToken(null)}
 * />
 * ```
 */
export const Turnstile = memo(
	forwardRef<TurnstileRef, TurnstileProps>(function Turnstile(
		{
			siteKey,
			onVerify,
			onError,
			onExpire,
			theme = "auto",
			size = "normal",
			className,
		},
		ref,
	) {
		const containerRef = useRef<HTMLDivElement>(null);
		const widgetIdRef = useRef<string | null>(null);
		const tokenRef = useRef<string | null>(null);
		const [scriptLoaded, setScriptLoaded] = useState(
			typeof window !== "undefined" && !!window.turnstile,
		);

		// Load the Turnstile script if not already loaded
		useEffect(() => {
			if (typeof window === "undefined") return;
			if (window.turnstile) {
				setScriptLoaded(true);
				return;
			}

			// Check if script is already being loaded
			const existingScript = document.querySelector(
				`script[src="${TURNSTILE_SCRIPT_URL}"]`,
			);
			if (existingScript) {
				existingScript.addEventListener("load", () => setScriptLoaded(true));
				return;
			}

			// Load the script
			const script = document.createElement("script");
			script.src = TURNSTILE_SCRIPT_URL;
			script.async = true;
			script.onload = () => setScriptLoaded(true);
			document.head.appendChild(script);

			return () => {
				// Don't remove the script as other instances might use it
			};
		}, []);

		// Handle verification callback
		const handleVerify = useCallback(
			(token: string) => {
				tokenRef.current = token;
				onVerify?.(token);
			},
			[onVerify],
		);

		// Handle error callback
		const handleError = useCallback(() => {
			tokenRef.current = null;
			onError?.();
		}, [onError]);

		// Handle expiry callback
		const handleExpire = useCallback(() => {
			tokenRef.current = null;
			onExpire?.();
		}, [onExpire]);

		// Render the widget when script is loaded
		useEffect(() => {
			if (!scriptLoaded || !window.turnstile || !containerRef.current) return;

			// Remove any existing widget
			if (widgetIdRef.current) {
				window.turnstile.remove(widgetIdRef.current);
			}

			// Render new widget
			widgetIdRef.current = window.turnstile.render(containerRef.current, {
				sitekey: siteKey,
				callback: handleVerify,
				"error-callback": handleError,
				"expired-callback": handleExpire,
				theme,
				size,
			});

			return () => {
				if (widgetIdRef.current && window.turnstile) {
					window.turnstile.remove(widgetIdRef.current);
					widgetIdRef.current = null;
				}
			};
		}, [
			scriptLoaded,
			siteKey,
			handleVerify,
			handleError,
			handleExpire,
			theme,
			size,
		]);

		// Expose reset and getToken methods via ref
		useImperativeHandle(
			ref,
			() => ({
				reset: () => {
					if (widgetIdRef.current && window.turnstile) {
						window.turnstile.reset(widgetIdRef.current);
						tokenRef.current = null;
					}
				},
				getToken: () => tokenRef.current,
			}),
			[],
		);

		const containerClassName = [styles.container, className]
			.filter(Boolean)
			.join(" ");

		return (
			<div className={containerClassName}>
				<div ref={containerRef} className={styles.widget} />
			</div>
		);
	}),
);

Turnstile.displayName = "Turnstile";
