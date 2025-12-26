/**
 * Campaign Embed Code Page
 * Shows embed codes and integration options
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { Button } from "@/proto-design-system/Button/button";
import Banner from "@/proto-design-system/banner/banner";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { TextArea } from "@/proto-design-system/TextArea/textArea";
import styles from "./embed.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/embed")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign } = useCampaignContext();
	const [copiedType, setCopiedType] = useState<string | null>(null);

	if (!campaign) {
		return null;
	}

	const hasFormFields = campaign.formFields && campaign.formFields.length > 0;

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

	const baseUrl = window.location.origin;
	const embedUrl = `${baseUrl}/embed/${campaignId}`;

	// iFrame embed code
	const iframeCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px;">
</iframe>`;

	// JavaScript snippet with automatic ref code detection
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

	// React/Next.js component example with automatic ref code detection
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

	const handleCopy = async (code: string, type: string) => {
		try {
			await navigator.clipboard.writeText(code);
			setCopiedType(type);
			setTimeout(() => setCopiedType(null), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<div className={styles.embed}>
			<div className={styles.header}>
				<h2 className={styles.title}>Embed Your Form</h2>
				<p className={styles.description}>
					Choose your preferred method to embed the waitlist form on your
					website
				</p>
			</div>

			{copiedType && (
				<Banner
					bannerType="success"
					variant="filled"
					alertTitle="Copied to clipboard!"
					alertDescription={`${copiedType} code has been copied.`}
				/>
			)}

			<div className={styles.embedOptions}>
				{/* Direct Link */}
				<div className={styles.card}>
					<h3 className={styles.cardTitle}>
						<i className="ri-link" aria-hidden="true" />
						Direct Link
					</h3>
					<p className={styles.cardDescription}>
						Share this URL directly or use it as a landing page
					</p>
					<div className={styles.codeBlock}>
						<div className={styles.codeContent}>
							<TextArea
								id="embed-url"
								label="Form URL"
								value={embedUrl}
								rows={2}
								readOnly
							/>
						</div>
						<Button
							variant="secondary"
							leftIcon={
								copiedType === "URL" ? "ri-check-line" : "ri-file-copy-line"
							}
							onClick={() => handleCopy(embedUrl, "URL")}
						>
							{copiedType === "URL" ? "Copied!" : "Copy"}
						</Button>
					</div>
				</div>

				{/* iFrame Embed */}
				<div className={styles.card}>
					<h3 className={styles.cardTitle}>
						<i className="ri-window-line" aria-hidden="true" />
						iFrame Embed
					</h3>
					<p className={styles.cardDescription}>
						Simple iframe embed - works with any HTML website
					</p>
					<div className={styles.codeBlock}>
						<div className={styles.codeContent}>
							<TextArea
								id="iframe-code"
								label="iFrame Code"
								value={iframeCode}
								rows={6}
								readOnly
							/>
						</div>
						<Button
							variant="secondary"
							leftIcon={
								copiedType === "iFrame"
									? "ri-check-line"
									: "ri-file-copy-line"
							}
							onClick={() => handleCopy(iframeCode, "iFrame")}
						>
							{copiedType === "iFrame" ? "Copied!" : "Copy"}
						</Button>
					</div>
				</div>

				{/* JavaScript Snippet */}
				<div className={styles.card}>
					<h3 className={styles.cardTitle}>
						<i className="ri-code-box-line" aria-hidden="true" />
						JavaScript Snippet (Recommended)
					</h3>
					<p className={styles.cardDescription}>
						Automatically detects and passes ref codes from your page URL
						(e.g., yoursite.com/signup?ref=ABC123)
					</p>
					<div className={styles.codeBlock}>
						<div className={styles.codeContent}>
							<TextArea
								id="js-snippet"
								label="JavaScript Code"
								value={jsSnippet}
								rows={8}
								readOnly
							/>
						</div>
						<Button
							variant="secondary"
							leftIcon={
								copiedType === "JavaScript"
									? "ri-check-line"
									: "ri-file-copy-line"
							}
							onClick={() => handleCopy(jsSnippet, "JavaScript")}
						>
							{copiedType === "JavaScript" ? "Copied!" : "Copy"}
						</Button>
					</div>
				</div>

				{/* React/Next.js Example */}
				<div className={styles.card}>
					<h3 className={styles.cardTitle}>
						<i className="ri-reactjs-line" aria-hidden="true" />
						React / Next.js
					</h3>
					<p className={styles.cardDescription}>
						Component with automatic ref code detection from URL parameters
					</p>
					<div className={styles.codeBlock}>
						<div className={styles.codeContent}>
							<TextArea
								id="react-code"
								label="React Component"
								value={reactCode}
								rows={8}
								readOnly
							/>
						</div>
						<Button
							variant="secondary"
							leftIcon={
								copiedType === "React" ? "ri-check-line" : "ri-file-copy-line"
							}
							onClick={() => handleCopy(reactCode, "React")}
						>
							{copiedType === "React" ? "Copied!" : "Copy"}
						</Button>
					</div>
				</div>

			</div>
		</div>
	);
}
