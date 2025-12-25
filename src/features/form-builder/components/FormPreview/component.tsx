/**
 * FormPreview Component
 * Live preview of the form with applied design settings
 */

import { type HTMLAttributes, memo, useState } from "react";
import type { FormConfig } from "@/types/common.types";
import { useFormStyles } from "../../hooks/useFormStyles";
import { DevicePreview, type DeviceType } from "../DevicePreview/component";
import { FormField } from "../FormField/component";
import styles from "./component.module.scss";

export interface FormPreviewProps extends HTMLAttributes<HTMLDivElement> {
	/** Form configuration to preview */
	config: FormConfig;
	/** Device type for responsive preview */
	device?: DeviceType;
	/** Additional CSS class name */
	className?: string;
}

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
	const formStyles = useFormStyles(design);

	// Sort fields by order
	const sortedFields = [...fields].sort((a, b) => a.order - b.order);

	// For multi-step: assign step to fields if not set, group by step
	const assignStepsToFields = (fieldsToAssign: typeof sortedFields) => {
		if (design.layout !== "multi-step") return fieldsToAssign;

		// Auto-assign fields to steps (3 fields per step)
		return fieldsToAssign.map((field, idx) => ({
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

	const isTwoColumn = design.layout === "two-column";
	const isMultiStep = design.layout === "multi-step";
	const isFullWidthButton = design.layout === "single-column";

	// Split fields by column for two-column layout
	const currentFields = getCurrentStepFields();
	const leftColumnFields = currentFields.filter((f) => (f.column || 1) === 1);
	const rightColumnFields = currentFields.filter((f) => f.column === 2);

	const emptyState = (
		<div className={styles.emptyState}>
			<i className="ri-eye-off-line" aria-hidden="true" />
			<p>Add fields to see preview</p>
		</div>
	);

	return (
		<DevicePreview
			device={device}
			isEmpty={fields.length === 0}
			emptyState={emptyState}
			className={customClassName}
			{...props}
		>
			<form
				className={styles.form}
				style={formStyles}
				onSubmit={(e) => e.preventDefault()}
			>
				{/* Multi-step progress indicator */}
				{isMultiStep && totalSteps > 1 && (
					<div className={styles.progressContainer}>
						<div className={styles.progressHeader}>
							<span className={styles.progressStep}>
								Step {currentStep} of {totalSteps}
							</span>
							<span className={styles.progressPercent}>
								{Math.round((currentStep / totalSteps) * 100)}%
							</span>
						</div>
						<div className={styles.progressBar}>
							<div
								className={styles.progressFill}
								style={{
									width: `${(currentStep / totalSteps) * 100}%`,
								}}
							/>
						</div>
					</div>
				)}

				{/* Form fields */}
				{isTwoColumn ? (
					<div className={styles.fieldsGrid}>
						<div className={styles.column}>
							{leftColumnFields.map((field) => (
								<FormField key={field.id} field={field} value="" disabled />
							))}
						</div>
						<div className={styles.column}>
							{rightColumnFields.map((field) => (
								<FormField key={field.id} field={field} value="" disabled />
							))}
						</div>
					</div>
				) : (
					<div className={styles.fieldsColumn}>
						{currentFields.map((field) => (
							<FormField key={field.id} field={field} value="" disabled />
						))}
					</div>
				)}

				{/* Multi-step navigation buttons */}
				{isMultiStep && totalSteps > 1 ? (
					<div className={styles.navButtons}>
						<button
							type="button"
							className={styles.navButton}
							style={{
								visibility: currentStep === 1 ? "hidden" : "visible",
							}}
							onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
						>
							← Previous
						</button>
						{currentStep === totalSteps ? (
							<button
								type="submit"
								className={`${styles.submitButton} ${isFullWidthButton ? styles.submitButtonFullWidth : ""}`}
								disabled
							>
								{design.submitButtonText || "Submit"}
							</button>
						) : (
							<button
								type="button"
								className={styles.submitButton}
								onClick={() =>
									setCurrentStep(Math.min(totalSteps, currentStep + 1))
								}
							>
								Next →
							</button>
						)}
					</div>
				) : (
					<button
						type="submit"
						className={`${styles.submitButton} ${isFullWidthButton ? styles.submitButtonFullWidth : ""}`}
						disabled
					>
						{design.submitButtonText || "Submit"}
					</button>
				)}

				{/* Apply custom CSS if provided */}
				{design.customCss && !design.customCss.startsWith("__DESIGN__:") && (
					<style>{design.customCss}</style>
				)}
			</form>
		</DevicePreview>
	);
});

FormPreview.displayName = "FormPreview";
