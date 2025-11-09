/**
 * Campaign Embed Code Page
 * Shows embed codes and integration options
 */

import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ErrorState } from "@/components/error/error";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import { Button } from "@/proto-design-system/Button/button";
import Banner from "@/proto-design-system/banner/banner";
import Breadcrumb from "@/proto-design-system/breadcrumb/breadcrumb";
import BreadcrumbItem from "@/proto-design-system/breadcrumb/breadcrumbitem";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import { TextArea } from "@/proto-design-system/TextArea/textArea";
import styles from "./campaignDetail.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/embed")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { data: campaign, loading, error } = useGetCampaign(campaignId);
	const [copiedType, setCopiedType] = useState<string | null>(null);

	if (loading) {
		return (
			<LoadingSpinner
				size="large"
				mode="centered"
				message="Loading campaign..."
			/>
		);
	}

	if (error) {
		return <ErrorState message={`Failed to load campaign: ${error.error}`} />;
	}

	if (!campaign) {
		return <EmptyState title="Campaign not found" icon="megaphone-line" />;
	}

	const hasFormFields =
		campaign.form_config?.fields && campaign.form_config.fields.length > 0;

	if (!hasFormFields) {
		return (
			<motion.div
				className={styles.page}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<div className={styles.pageHeader}>
					<div className={styles.headerActions}>
						<Breadcrumb
							items={[
								<BreadcrumbItem
									key="campaigns"
									state="default"
									path="/campaigns"
								>
									Campaigns
								</BreadcrumbItem>,
								<BreadcrumbItem
									key="campaign"
									state="default"
									path={`/campaigns/${campaignId}`}
								>
									{campaign.name}
								</BreadcrumbItem>,
								<BreadcrumbItem key="embed" state="active">
									Embed
								</BreadcrumbItem>,
							]}
							divider="arrow"
						/>
					</div>
				</div>

				<div className={styles.pageContent}>
					<EmptyState
						title="Form not configured"
						description="You need to configure your form before you can embed it."
						icon="code-s-slash-line"
					/>
				</div>
			</motion.div>
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
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div className={styles.headerActions}>
					<Breadcrumb
						items={[
							<BreadcrumbItem key="campaigns" state="default" path="/campaigns">
								Campaigns
							</BreadcrumbItem>,
							<BreadcrumbItem
								key="campaign"
								state="default"
								path={`/campaigns/${campaignId}`}
							>
								{campaign.name}
							</BreadcrumbItem>,
							<BreadcrumbItem key="embed" state="active">
								Embed
							</BreadcrumbItem>,
						]}
						divider="arrow"
					/>
				</div>

				<div className={styles.headerTop}>
					<div className={styles.headerContent}>
						<h1 className={styles.pageTitle}>Embed Your Form</h1>
						<p className={styles.pageDescription}>
							Choose your preferred method to embed the waitlist form on your
							website
						</p>
					</div>
				</div>
			</div>

			<div className={styles.pageContent}>
				{copiedType && (
					<Banner
						bannerType="success"
						variant="filled"
						alertTitle="Copied to clipboard!"
						alertDescription={`${copiedType} code has been copied.`}
					/>
				)}

				<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
					{/* Direct Link */}
					<div
						style={{
							padding: "24px",
							backgroundColor: "var(--color-surface-primary-default)",
							borderRadius: "8px",
							border: "1px solid var(--color-border-primary-default)",
						}}
					>
						<h3 style={{ marginTop: 0 }}>
							<i className="ri-link" style={{ marginRight: "8px" }} />
							Direct Link
						</h3>
						<p style={{ color: "var(--color-text-secondary-default)" }}>
							Share this URL directly or use it as a landing page
						</p>
						<div
							style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}
						>
							<div style={{ flex: 1 }}>
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
					<div
						style={{
							padding: "24px",
							backgroundColor: "var(--color-surface-primary-default)",
							borderRadius: "8px",
							border: "1px solid var(--color-border-primary-default)",
						}}
					>
						<h3 style={{ marginTop: 0 }}>
							<i className="ri-window-line" style={{ marginRight: "8px" }} />
							iFrame Embed
						</h3>
						<p style={{ color: "var(--color-text-secondary-default)" }}>
							Simple iframe embed - works with any HTML website
						</p>
						<div
							style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}
						>
							<div style={{ flex: 1 }}>
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
					<div
						style={{
							padding: "24px",
							backgroundColor: "var(--color-surface-primary-default)",
							borderRadius: "8px",
							border: "1px solid var(--color-border-primary-default)",
						}}
					>
						<h3 style={{ marginTop: 0 }}>
							<i className="ri-code-box-line" style={{ marginRight: "8px" }} />
							JavaScript Snippet (Recommended)
						</h3>
						<p style={{ color: "var(--color-text-secondary-default)" }}>
							Automatically detects and passes ref codes from your page URL (e.g., yoursite.com/signup?ref=ABC123)
						</p>
						<div
							style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}
						>
							<div style={{ flex: 1 }}>
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
					<div
						style={{
							padding: "24px",
							backgroundColor: "var(--color-surface-primary-default)",
							borderRadius: "8px",
							border: "1px solid var(--color-border-primary-default)",
						}}
					>
						<h3 style={{ marginTop: 0 }}>
							<i className="ri-reactjs-line" style={{ marginRight: "8px" }} />
							React / Next.js
						</h3>
						<p style={{ color: "var(--color-text-secondary-default)" }}>
							Component with automatic ref code detection from URL parameters
						</p>
						<div
							style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}
						>
							<div style={{ flex: 1 }}>
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

					{/* Preview */}
					<div
						style={{
							padding: "24px",
							backgroundColor: "var(--color-surface-primary-default)",
							borderRadius: "8px",
							border: "1px solid var(--color-border-primary-default)",
						}}
					>
						<h3 style={{ marginTop: 0 }}>
							<i className="ri-eye-line" style={{ marginRight: "8px" }} />
							Preview
						</h3>
						<p style={{ color: "var(--color-text-secondary-default)" }}>
							See how your form will look when embedded
						</p>
						<div
							style={{
								border: "1px solid var(--color-border-primary-default)",
								borderRadius: "8px",
								overflow: "hidden",
								backgroundColor: "var(--color-surface-secondary-default)",
							}}
						>
							<iframe
								src={embedUrl}
								width="100%"
								height="600"
								style={{ border: "none", display: "block" }}
								title="Form Preview"
							/>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
