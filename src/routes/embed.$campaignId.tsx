/**
 * Public Embed Form Route
 * Renders the form for embedding in external websites
 */

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ErrorState } from "@/components/error/error";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import type { FormDesign } from "@/types/common.types";
import styles from "./embed.module.scss";

export const Route = createFileRoute("/embed/$campaignId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { data: campaign, loading, error } = useGetCampaign(campaignId);
	const [formData, setFormData] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [refCode, setRefCode] = useState<string | null>(null);

	// Extract ref code from URL parameters on mount
	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const ref = searchParams.get("ref");
		if (ref) {
			setRefCode(ref);
		}
	}, []);

	if (loading) {
		return (
			<LoadingSpinner size="large" mode="centered" message="Loading form..." />
		);
	}

	if (error || !campaign) {
		return <ErrorState message="Form not found" />;
	}

	if (
		!campaign.form_config?.fields ||
		campaign.form_config.fields.length === 0
	) {
		return <ErrorState message="This form is not yet configured" />;
	}

	// Parse design config from custom_css
	let design: FormDesign = {
		layout: "single-column",
		colors: {
			primary: "#3b82f6",
			background: "#ffffff",
			text: "#1f2937",
			border: "#e5e7eb",
			error: "#ef4444",
			success: "#10b981",
		},
		typography: {
			fontFamily: "Inter, system-ui, sans-serif",
			fontSize: 16,
			fontWeight: 400,
		},
		spacing: {
			padding: 16,
			gap: 16,
		},
		borderRadius: 8,
		customCss: "",
	};

	if (campaign.form_config.custom_css?.startsWith("__DESIGN__:")) {
		try {
			const designJson = campaign.form_config.custom_css.substring(
				"__DESIGN__:".length,
			);
			design = JSON.parse(designJson);
		} catch (e) {
			console.error("Failed to parse design config:", e);
		}
	}

	const handleChange = (fieldName: string, value: string) => {
		setFormData((prev) => ({ ...prev, [fieldName]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setSubmitError(null);

		try {
			// Build all form data
			const allFormData: Record<string, string> = {};
			const customFields: Record<string, string> = {};

			campaign.form_config!.fields!.forEach((field) => {
				const value = formData[field.name] || "";
				allFormData[field.name] = value;

				// Exclude email from custom_fields (it's a required field)
				if (field.name !== "email") {
					customFields[field.name] = value;
				}
			});

			// Add ref code to custom fields if present
			if (refCode) {
				customFields.ref_code = refCode;
			}

			// Submit to API
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/users`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: allFormData.email || "",
						terms_accepted: true,
						custom_fields: customFields,
					}),
				},
			);

			if (!response.ok) {
				let errorMessage = "Failed to submit form";
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorMessage;
				} catch {
					// If JSON parsing fails, use default message
					errorMessage = `Failed to submit form (${response.status})`;
				}
				throw new Error(errorMessage);
			}

			setSubmitted(true);
		} catch (error: unknown) {
			let errorMessage = "Failed to submit form";

			if (error instanceof Error) {
				// Network errors (server unreachable, CORS, etc.)
				if (error.message === "Failed to fetch") {
					errorMessage =
						"Unable to connect to the server. Please check your internet connection and try again.";
				} else {
					errorMessage = error.message;
				}
			}

			setSubmitError(errorMessage);
			console.error("Form submission error:", error);
		} finally {
			setSubmitting(false);
		}
	};

	const formStyle: React.CSSProperties = {
		fontFamily: design.typography.fontFamily,
		backgroundColor: design.colors.background,
		padding: `${design.spacing.padding * 2}px`,
		borderRadius: `${design.borderRadius}px`,
		maxWidth: design.layout === "single-column" ? "600px" : "900px",
		margin: "0 auto",
	};

	const fieldContainerStyle: React.CSSProperties = {
		marginBottom: `${design.spacing.gap}px`,
	};

	const labelStyle: React.CSSProperties = {
		fontFamily: design.typography.fontFamily,
		fontSize: `${design.typography.fontSize}px`,
		fontWeight: design.typography.fontWeight + 100,
		color: design.colors.text,
		marginBottom: `${design.spacing.gap / 2}px`,
		display: "block",
	};

	const inputStyle: React.CSSProperties = {
		fontFamily: design.typography.fontFamily,
		fontSize: `${design.typography.fontSize}px`,
		color: design.colors.text,
		backgroundColor: design.colors.background,
		border: `1px solid ${design.colors.border}`,
		borderRadius: `${design.borderRadius}px`,
		padding: `${design.spacing.padding}px`,
		width: "100%",
	};

	const buttonStyle: React.CSSProperties = {
		fontFamily: design.typography.fontFamily,
		fontSize: `${design.typography.fontSize}px`,
		fontWeight: design.typography.fontWeight + 100,
		color: design.colors.background,
		backgroundColor: design.colors.primary,
		border: "none",
		borderRadius: `${design.borderRadius}px`,
		padding: `${design.spacing.padding}px ${design.spacing.padding * 2}px`,
		cursor: submitting ? "not-allowed" : "pointer",
		width: design.layout === "single-column" ? "100%" : "auto",
		marginTop: `${design.spacing.gap}px`,
	};

	if (submitted) {
		return (
			<div className={styles.root} style={formStyle}>
				<div className={styles.success}>
					<i
						className="ri-check-circle-line"
						style={{ fontSize: "48px", color: design.colors.success }}
					/>
					<h2 style={{ color: design.colors.text }}>
						Thank you for signing up!
					</h2>
					<p style={{ color: design.colors.text }}>We'll be in touch soon.</p>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.root}>
			<form style={formStyle} onSubmit={handleSubmit}>
				{submitError && (
					<div
						style={{
							padding: `${design.spacing.padding}px`,
							backgroundColor: design.colors.error + "20",
							border: `1px solid ${design.colors.error}`,
							borderRadius: `${design.borderRadius}px`,
							marginBottom: `${design.spacing.gap}px`,
							color: design.colors.error,
						}}
					>
						{submitError}
					</div>
				)}

				<div
					style={{
						display: design.layout === "two-column" ? "grid" : "block",
						gridTemplateColumns:
							design.layout === "two-column" ? "1fr 1fr" : undefined,
						gap:
							design.layout === "two-column"
								? `${design.spacing.gap}px`
								: undefined,
					}}
				>
					{campaign.form_config.fields.map((field) => (
						<div key={field.name} style={fieldContainerStyle}>
							<label style={labelStyle}>
								{field.label}
								{field.required && (
									<span style={{ color: design.colors.error }}> *</span>
								)}
							</label>

							{field.type === "textarea" ? (
								<textarea
									value={formData[field.name] || ""}
									onChange={(e) => handleChange(field.name, e.target.value)}
									placeholder={field.placeholder}
									required={field.required}
									style={{
										...inputStyle,
										minHeight: "100px",
										resize: "vertical",
									}}
								/>
							) : field.type === "select" ? (
								<select
									value={formData[field.name] || ""}
									onChange={(e) => handleChange(field.name, e.target.value)}
									required={field.required}
									style={inputStyle}
								>
									<option value="">
										{field.placeholder || "Select an option"}
									</option>
									{field.options?.map((option, idx) => (
										<option key={idx} value={option}>
											{option}
										</option>
									))}
								</select>
							) : field.type === "checkbox" ? (
								<label
									style={{ display: "flex", alignItems: "center", gap: "8px" }}
								>
									<input
										type="checkbox"
										checked={formData[field.name] === "true"}
										onChange={(e) =>
											handleChange(field.name, e.target.checked.toString())
										}
										required={field.required}
									/>
									<span
										style={{ fontSize: `${design.typography.fontSize - 2}px` }}
									>
										{field.placeholder || field.label}
									</span>
								</label>
							) : (
								<input
									type={field.type}
									value={formData[field.name] || ""}
									onChange={(e) => handleChange(field.name, e.target.value)}
									placeholder={field.placeholder}
									required={field.required}
									style={inputStyle}
								/>
							)}
						</div>
					))}
				</div>

				<button type="submit" style={buttonStyle} disabled={submitting}>
					{submitting ? "Submitting..." : "Submit"}
				</button>

				{design.customCss && !design.customCss.startsWith("__DESIGN__:") && (
					<style>{design.customCss}</style>
				)}
			</form>
		</div>
	);
}
