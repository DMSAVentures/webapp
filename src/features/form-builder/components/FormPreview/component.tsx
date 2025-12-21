/**
 * FormPreview Component
 * Live preview of the form with applied design settings
 */

import { type HTMLAttributes, memo, useState } from "react";
import type { FormConfig } from "@/types/common.types";
import styles from "./component.module.scss";

export interface FormPreviewProps extends HTMLAttributes<HTMLDivElement> {
	/** Form configuration to preview */
	config: FormConfig;
	/** Device type for responsive preview */
	device?: "mobile" | "tablet" | "desktop";
	/** Additional CSS class name */
	className?: string;
}

/**
 * Render form field preview based on type
 */
const renderFieldPreview = (
	field: FormConfig["fields"][0],
	design: FormConfig["design"],
) => {
	const baseStyle: React.CSSProperties = {
		fontFamily: design.typography.fontFamily,
		fontSize: `${design.typography.fontSize}px`,
		fontWeight: design.typography.fontWeight,
		color: design.colors.text,
		backgroundColor: design.colors.background,
		border: `1px solid ${design.colors.border}`,
		borderRadius: `${design.borderRadius}px`,
		padding: `${design.spacing.padding}px`,
	};

	const labelStyle: React.CSSProperties = {
		fontFamily: design.typography.fontFamily,
		fontSize: `${design.typography.fontSize - 2}px`,
		fontWeight: design.typography.fontWeight + 100,
		color: design.colors.text,
		marginBottom: `${design.spacing.gap / 2}px`,
		display: "block",
	};

	switch (field.type) {
		case "textarea":
			return (
				<div key={field.id} style={{ marginBottom: `${design.spacing.gap}px` }}>
					<label style={labelStyle}>
						{field.label}
						{field.required && (
							<span style={{ color: design.colors.error }}> *</span>
						)}
					</label>
					<textarea
						placeholder={field.placeholder}
						style={{
							...baseStyle,
							minHeight: "100px",
							resize: "vertical",
							width: "100%",
						}}
						disabled
					/>
				</div>
			);

		case "select":
			return (
				<div key={field.id} style={{ marginBottom: `${design.spacing.gap}px` }}>
					<label style={labelStyle}>
						{field.label}
						{field.required && (
							<span style={{ color: design.colors.error }}> *</span>
						)}
					</label>
					<select style={{ ...baseStyle, width: "100%" }} disabled>
						<option>{field.placeholder || "Select an option"}</option>
						{field.options?.map((option, idx) => (
							<option key={idx}>{option}</option>
						))}
					</select>
				</div>
			);

		case "checkbox":
			return (
				<div key={field.id} style={{ marginBottom: `${design.spacing.gap}px` }}>
					<label style={labelStyle}>
						{field.label}
						{field.required && (
							<span style={{ color: design.colors.error }}> *</span>
						)}
					</label>
					{field.options && field.options.length > 0 ? (
						field.options.map((option, idx) => (
							<label
								key={idx}
								style={{
									...labelStyle,
									display: "flex",
									alignItems: "center",
									gap: "8px",
									fontWeight: 400,
									marginBottom: `${design.spacing.gap / 2}px`,
									cursor: "pointer",
								}}
							>
								<input
									type="checkbox"
									style={{
										width: "20px",
										height: "20px",
										accentColor: design.colors.primary,
									}}
									disabled
								/>
								<span>{option}</span>
							</label>
						))
					) : (
						<label
							style={{
								...labelStyle,
								display: "flex",
								alignItems: "center",
								gap: "8px",
								fontWeight: 400,
								cursor: "pointer",
							}}
						>
							<input
								type="checkbox"
								style={{
									width: "20px",
									height: "20px",
									accentColor: design.colors.primary,
								}}
								disabled
							/>
							<span>{field.placeholder || "Option"}</span>
						</label>
					)}
				</div>
			);

		case "radio":
			return (
				<div key={field.id} style={{ marginBottom: `${design.spacing.gap}px` }}>
					<label style={labelStyle}>
						{field.label}
						{field.required && (
							<span style={{ color: design.colors.error }}> *</span>
						)}
					</label>
					{field.options?.map((option, idx) => (
						<label
							key={idx}
							style={{
								...labelStyle,
								display: "flex",
								alignItems: "center",
								gap: "8px",
								fontWeight: 400,
								marginBottom: `${design.spacing.gap / 2}px`,
								cursor: "pointer",
							}}
						>
							<input
								type="radio"
								name={field.id}
								style={{
									width: "20px",
									height: "20px",
									accentColor: design.colors.primary,
								}}
								disabled
							/>
							<span>{option}</span>
						</label>
					))}
				</div>
			);

		default:
			return (
				<div key={field.id} style={{ marginBottom: `${design.spacing.gap}px` }}>
					<label style={labelStyle}>
						{field.label}
						{field.required && (
							<span style={{ color: design.colors.error }}> *</span>
						)}
					</label>
					<input
						type={field.type}
						placeholder={field.placeholder}
						style={{ ...baseStyle, width: "100%" }}
						disabled
					/>
				</div>
			);
	}
};

/**
 * FormPreview renders a live preview of the form
 */
export const FormPreview = memo<FormPreviewProps>(function FormPreview({
	config,
	device = "desktop",
	className: customClassName,
	...props
}) {
	const { fields, design } = config;
	const [currentStep, setCurrentStep] = useState(1);

	const classNames = [styles.root, styles[`device_${device}`], customClassName]
		.filter(Boolean)
		.join(" ");

	const formStyle: React.CSSProperties = {
		fontFamily: design.typography.fontFamily,
		backgroundColor: design.colors.background,
		padding: `${design.spacing.padding * 2}px`,
		borderRadius: `${design.borderRadius}px`,
	};

	const submitButtonStyle: React.CSSProperties = {
		fontFamily: design.typography.fontFamily,
		fontSize: `${design.typography.fontSize}px`,
		fontWeight: design.typography.fontWeight + 100,
		color: design.colors.background,
		backgroundColor: design.colors.primary,
		border: "none",
		borderRadius: `${design.borderRadius}px`,
		padding: `${design.spacing.padding}px ${design.spacing.padding * 2}px`,
		cursor: "not-allowed",
		width: design.layout === "single-column" ? "100%" : "auto",
		marginTop: `${design.spacing.gap}px`,
	};

	const navButtonStyle: React.CSSProperties = {
		fontFamily: design.typography.fontFamily,
		fontSize: `${design.typography.fontSize}px`,
		fontWeight: design.typography.fontWeight + 100,
		color: design.colors.text,
		backgroundColor: design.colors.background,
		border: `1px solid ${design.colors.border}`,
		borderRadius: `${design.borderRadius}px`,
		padding: `${design.spacing.padding}px ${design.spacing.padding * 2}px`,
		cursor: "pointer",
		marginTop: `${design.spacing.gap}px`,
	};

	// Sort fields by order
	const sortedFields = [...fields].sort((a, b) => a.order - b.order);

	// For multi-step: assign step to fields if not set, group by step
	const assignStepsToFields = (fields: typeof sortedFields) => {
		if (design.layout !== "multi-step") return fields;

		// Auto-assign fields to steps (3 fields per step)
		return fields.map((field, idx) => ({
			...field,
			step: field.step ?? Math.floor(idx / 3) + 1,
		}));
	};

	const fieldsWithSteps = assignStepsToFields(sortedFields);

	// Get fields for current step
	const getCurrentStepFields = () => {
		if (design.layout !== "multi-step") return fieldsWithSteps;
		return fieldsWithSteps.filter((f) => f.step === currentStep);
	};

	// Calculate total steps
	const totalSteps =
		design.layout === "multi-step"
			? Math.max(...fieldsWithSteps.map((f) => f.step || 1), 1)
			: 1;

	return (
		<div className={classNames} {...props}>
			<div className={styles.deviceFrame}>
				<div className={styles.deviceHeader}>
					<div className={styles.deviceControls}>
						<span className={styles.deviceDot} />
						<span className={styles.deviceDot} />
						<span className={styles.deviceDot} />
					</div>
					<span className={styles.deviceTitle}>{device} Preview</span>
				</div>

				<div className={styles.previewContent}>
					{fields.length === 0 ? (
						<div className={styles.emptyState}>
							<i className="ri-eye-off-line" aria-hidden="true" />
							<p>Add fields to see preview</p>
						</div>
					) : (
						<form style={formStyle} onSubmit={(e) => e.preventDefault()}>
							{/* Multi-step progress indicator */}
							{design.layout === "multi-step" && totalSteps > 1 && (
								<div
									style={{
										marginBottom: `${design.spacing.gap * 2}px`,
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: `${design.spacing.gap}px`,
										}}
									>
										<span
											style={{
												fontFamily: design.typography.fontFamily,
												fontSize: `${design.typography.fontSize - 2}px`,
												color: design.colors.text,
												opacity: 0.7,
											}}
										>
											Step {currentStep} of {totalSteps}
										</span>
										<span
											style={{
												fontFamily: design.typography.fontFamily,
												fontSize: `${design.typography.fontSize - 2}px`,
												color: design.colors.primary,
												fontWeight: design.typography.fontWeight + 100,
											}}
										>
											{Math.round((currentStep / totalSteps) * 100)}%
										</span>
									</div>
									{/* Progress bar */}
									<div
										style={{
											width: "100%",
											height: "6px",
											backgroundColor: design.colors.border,
											borderRadius: `${design.borderRadius}px`,
											overflow: "hidden",
										}}
									>
										<div
											style={{
												width: `${(currentStep / totalSteps) * 100}%`,
												height: "100%",
												backgroundColor: design.colors.primary,
												transition: "width 300ms ease",
											}}
										/>
									</div>
								</div>
							)}

							{/* Form fields */}
							{design.layout === "two-column" ? (
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: `${design.spacing.gap}px`,
									}}
								>
									{getCurrentStepFields().map((field) =>
										renderFieldPreview(field, design),
									)}
								</div>
							) : (
								getCurrentStepFields().map((field) =>
									renderFieldPreview(field, design),
								)
							)}

							{/* Multi-step navigation buttons */}
							{design.layout === "multi-step" && totalSteps > 1 ? (
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										gap: `${design.spacing.gap}px`,
										marginTop: `${design.spacing.gap}px`,
									}}
								>
									<button
										type="button"
										style={{
											...navButtonStyle,
											visibility: currentStep === 1 ? "hidden" : "visible",
										}}
										onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
									>
										← Previous
									</button>
									{currentStep === totalSteps ? (
										<button type="submit" style={submitButtonStyle} disabled>
											Submit
										</button>
									) : (
										<button
											type="button"
											style={{
												...submitButtonStyle,
												cursor: "pointer",
											}}
											onClick={() =>
												setCurrentStep(Math.min(totalSteps, currentStep + 1))
											}
										>
											Next →
										</button>
									)}
								</div>
							) : (
								<button type="submit" style={submitButtonStyle} disabled>
									Submit
								</button>
							)}

							{/* Apply custom CSS if provided */}
							{design.customCss && <style>{design.customCss}</style>}
						</form>
					)}
				</div>
			</div>
		</div>
	);
});

FormPreview.displayName = "FormPreview";
