/**
 * EmbedCodePage Component
 * Container component for embed code generation
 */

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useGlobalBanner } from "@/contexts/globalBanner";
import { Button, EmptyState, TextArea } from "@/proto-design-system";
import type { Campaign } from "@/types/campaign";
import styles from "./component.module.scss";

export interface EmbedCodePageProps {
	/** Campaign ID */
	campaignId: string;
	/** Campaign data */
	campaign: Campaign;
}

// ============================================================================
// Types
// ============================================================================

interface EmbedCodes {
	embedUrl: string;
	iframeCode: string;
	jsSnippet: string;
	reactCode: string;
}

interface CodeBlockProps {
	icon: string;
	title: string;
	description: string;
	code: string;
	codeType: string;
	copiedType: string | null;
	onCopy: (code: string, type: string) => void;
	rows?: number;
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Generate all embed codes for a campaign */
function generateEmbedCodes(campaignId: string): EmbedCodes {
	const baseUrl = window.location.origin;
	const embedUrl = `${baseUrl}/embed/${campaignId}`;

	const iframeCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px;">
</iframe>`;

	const jsSnippet = `<div id="waitlist-form-${campaignId}"></div>
<script>
  (function() {
    // Auto-detect ref code from parent page URL
    var urlParams = new URLSearchParams(window.location.search);
    var refCode = urlParams.get('ref');

    // Build iframe URL with ref code if present
    var iframeSrc = '${embedUrl}';
    if (refCode) {
      iframeSrc += '?ref=' + encodeURIComponent(refCode);
    }

    var iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    document.getElementById('waitlist-form-${campaignId}').appendChild(iframe);
  })();
</script>`;

	const reactCode = `// Add this component to your React/Next.js app
'use client'; // Add this if using Next.js App Router

import { useEffect, useState } from 'react';

export function WaitlistForm() {
  const [iframeSrc, setIframeSrc] = useState('${embedUrl}');

  useEffect(() => {
    // Auto-detect ref code from parent page URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');

    if (refCode) {
      setIframeSrc('${embedUrl}?ref=' + encodeURIComponent(refCode));
    }
  }, []);

  return (
    <iframe
      src={iframeSrc}
      width="100%"
      height="600"
      style={{ border: 'none', borderRadius: '8px' }}
    />
  );
}`;

	return { embedUrl, iframeCode, jsSnippet, reactCode };
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for clipboard operations with feedback */
function useCopyToClipboard() {
	const [copiedType, setCopiedType] = useState<string | null>(null);
	const { showBanner } = useGlobalBanner();

	useEffect(() => {
		if (copiedType) {
			showBanner({
				type: "success",
				title: "Copied to clipboard!",
				description: `${copiedType} code has been copied.`,
			});
		}
	}, [copiedType, showBanner]);

	const handleCopy = useCallback(async (code: string, type: string) => {
		try {
			await navigator.clipboard.writeText(code);
			setCopiedType(type);
			setTimeout(() => setCopiedType(null), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}, []);

	return { copiedType, handleCopy };
}

// ============================================================================
// Sub-Components
// ============================================================================

/** Code block with copy button */
const CodeBlock = memo(function CodeBlock({
	icon,
	title,
	description,
	code,
	codeType,
	copiedType,
	onCopy,
	rows = 6,
}: CodeBlockProps) {
	const isCopied = copiedType === codeType;

	return (
		<div className={styles.card}>
			<h3 className={styles.cardTitle}>
				<i className={icon} aria-hidden="true" />
				{title}
			</h3>
			<p className={styles.cardDescription}>{description}</p>
			<div className={styles.codeBlock}>
				<div className={styles.codeContent}>
					<TextArea
						id={`embed-${codeType.toLowerCase()}`}
						label={`${codeType} Code`}
						value={code}
						rows={rows}
						readOnly
					/>
				</div>
				<Button
					variant="secondary"
					leftIcon={isCopied ? "ri-check-line" : "ri-file-copy-line"}
					onClick={() => onCopy(code, codeType)}
				>
					{isCopied ? "Copied!" : "Copy"}
				</Button>
			</div>
		</div>
	);
});

CodeBlock.displayName = "CodeBlock";

// ============================================================================
// Component
// ============================================================================

/**
 * EmbedCodePage displays embed code options for a campaign
 */
export const EmbedCodePage = memo(function EmbedCodePage({
	campaignId,
	campaign,
}: EmbedCodePageProps) {
	// Hooks
	const { copiedType, handleCopy } = useCopyToClipboard();

	// Derived state
	const embedCodes = useMemo(
		() => generateEmbedCodes(campaignId),
		[campaignId],
	);

	const hasFormFields = campaign.formFields && campaign.formFields.length > 0;

	// Empty state when form not configured
	if (!hasFormFields) {
		return (
			<div className={styles.embed}>
				<EmptyState
					title="Form not configured"
					description="You need to configure your form before you can embed it."
					icon="code-s-slash-line"
				/>
			</div>
		);
	}

	return (
		<div className={styles.embed}>
			<div className={styles.header}>
				<h2 className={styles.title}>Embed Your Form</h2>
				<p className={styles.description}>
					Choose your preferred method to embed the waitlist form on your
					website
				</p>
			</div>

			<div className={styles.embedOptions}>
				<CodeBlock
					icon="ri-link"
					title="Direct Link"
					description="Share this URL directly or use it as a landing page"
					code={embedCodes.embedUrl}
					codeType="URL"
					copiedType={copiedType}
					onCopy={handleCopy}
					rows={2}
				/>

				<CodeBlock
					icon="ri-window-line"
					title="iFrame Embed"
					description="Simple iframe embed - works with any HTML website"
					code={embedCodes.iframeCode}
					codeType="iFrame"
					copiedType={copiedType}
					onCopy={handleCopy}
					rows={6}
				/>

				<CodeBlock
					icon="ri-code-box-line"
					title="JavaScript Snippet (Recommended)"
					description="Automatically detects and passes ref codes from your page URL (e.g., yoursite.com/signup?ref=ABC123)"
					code={embedCodes.jsSnippet}
					codeType="JavaScript"
					copiedType={copiedType}
					onCopy={handleCopy}
					rows={8}
				/>

				<CodeBlock
					icon="ri-reactjs-line"
					title="React / Next.js"
					description="Component with automatic ref code detection from URL parameters"
					code={embedCodes.reactCode}
					codeType="React"
					copiedType={copiedType}
					onCopy={handleCopy}
					rows={8}
				/>
			</div>
		</div>
	);
});

EmbedCodePage.displayName = "EmbedCodePage";
