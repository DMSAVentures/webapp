/**
 * EmbedCodePage Component
 * Container component for embed code generation
 */

import { Check, Code, Copy, Globe, Link, type LucideIcon } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { useBannerCenter } from "@/proto-design-system/components/feedback/BannerCenter";
import { TextArea } from "@/proto-design-system/components/forms/TextArea";
import { Card } from "@/proto-design-system/components/layout/Card";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Text } from "@/proto-design-system/components/primitives/Text";
import "remixicon/fonts/remixicon.css";
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
	icon: LucideIcon | string;
	title: string;
	description: string;
	code: string;
	codeType: string;
	copiedType: string | null;
	onCopy: (code: string, type: string) => void;
	rows?: number;
	recommended?: boolean;
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
	const { addBanner } = useBannerCenter();

	useEffect(() => {
		if (copiedType) {
			addBanner({
				type: "success",
				title: "Copied to clipboard!",
				description: `${copiedType} code has been copied.`,
				dismissible: true,
			});
		}
	}, [copiedType, addBanner]);

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
	recommended = false,
}: CodeBlockProps) {
	const isCopied = copiedType === codeType;
	const isLucideIcon = typeof icon !== "string";

	return (
		<Card variant="outlined" padding="lg">
			<Stack gap="sm">
				<Stack direction="row" align="center" gap="sm">
					<div className={styles.iconWrapper}>
						{isLucideIcon ? (
							<Icon icon={icon} size="md" />
						) : (
							<i className={icon} aria-hidden="true" />
						)}
					</div>
					<Text as="h3" size="lg" weight="semibold">
						{title}
					</Text>
					{recommended && (
						<Badge variant="success" size="sm">
							Recommended
						</Badge>
					)}
				</Stack>
				<Text size="sm" color="muted">
					{description}
				</Text>
				<Stack gap="sm">
					<TextArea
						id={`embed-${codeType.toLowerCase()}`}
						label={`${codeType} Code`}
						value={code}
						rows={rows}
						readOnly
						fullWidth
					/>
					<Stack direction="row" justify="end">
						<Button
							variant="secondary"
							size="sm"
							leftIcon={isCopied ? <Check size={16} /> : <Copy size={16} />}
							onClick={() => onCopy(code, codeType)}
						>
							{isCopied ? "Copied!" : "Copy"}
						</Button>
					</Stack>
				</Stack>
			</Stack>
		</Card>
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
					icon={<Code size={48} />}
				/>
			</div>
		);
	}

	return (
		<Stack gap="lg" className={styles.embed} animate>
			<Stack gap="xs">
				<Text as="h2" size="xl" weight="semibold">
					Embed Your Form
				</Text>
				<Text size="md" color="secondary">
					Choose your preferred method to embed the waitlist form on your
					website
				</Text>
			</Stack>

			<Stack gap="md">
				<CodeBlock
					icon={Link}
					title="Direct Link"
					description="Share this URL directly or use it as a landing page"
					code={embedCodes.embedUrl}
					codeType="URL"
					copiedType={copiedType}
					onCopy={handleCopy}
					rows={2}
				/>

				<CodeBlock
					icon={Globe}
					title="iFrame Embed"
					description="Simple iframe embed - works with any HTML website"
					code={embedCodes.iframeCode}
					codeType="iFrame"
					copiedType={copiedType}
					onCopy={handleCopy}
					rows={6}
				/>

				<CodeBlock
					icon={Code}
					title="JavaScript Snippet"
					description="Automatically detects and passes ref codes from your page URL (e.g., yoursite.com/signup?ref=ABC123)"
					code={embedCodes.jsSnippet}
					codeType="JavaScript"
					copiedType={copiedType}
					onCopy={handleCopy}
					rows={8}
					recommended
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
			</Stack>
		</Stack>
	);
});

EmbedCodePage.displayName = "EmbedCodePage";
