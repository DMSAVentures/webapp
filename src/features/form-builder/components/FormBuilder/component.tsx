/**
 * FormBuilder Component
 * Main form builder interface with drag-drop editor
 */

import {
	type HTMLAttributes,
	memo,
	useCallback,
	useEffect,
	useState,
} from "react";
import { Button } from "@/proto-design-system/Button/button";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import { Badge } from "@/proto-design-system/badge/badge";
import { TabMenuHorizontal } from "@/proto-design-system/TabMenu/Horizontal/tabMenuHorizontal";
import { TabMenuHorizontalItem } from "@/proto-design-system/TabMenu/Horizontal/tabMenuHorizontalItem";
import type { SharingChannel } from "@/types/campaign";
import type {
	FormBehavior,
	FormConfig,
	FormDesign,
	FormField,
} from "@/types/common.types";
import { FieldEditor } from "../FieldEditor/component";
import { FieldPalette } from "../FieldPalette/component";
import { FormCanvas } from "../FormCanvas/component";
import { FormPreview } from "../FormPreview/component";
import { FormStyleEditor } from "../FormStyleEditor/component";
import { SuccessMessageEditor } from "../SuccessMessageEditor/component";
import { SuccessScreenPreview } from "../SuccessScreenPreview/component";
import styles from "./component.module.scss";

/** Top-level builder mode */
type BuilderMode = "form" | "success-screen";

export interface FormBuilderProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onSave"> {
	/** Campaign ID this form belongs to */
	campaignId: string;
	/** Initial form configuration */
	initialConfig?: FormConfig;
	/** Callback when form is saved */
	onSave: (config: FormConfig) => Promise<void>;
	/** Enabled referral channels for success message preview */
	enabledReferralChannels?: SharingChannel[];
	/** Additional CSS class name */
	className?: string;
}

/**
 * Default form design settings
 */
const DEFAULT_DESIGN: FormDesign = {
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
	submitButtonText: "Submit",
	customCss: "",
};

/**
 * FormBuilder provides a visual interface for building forms
 */
export const FormBuilder = memo<FormBuilderProps>(function FormBuilder({
	campaignId,
	initialConfig,
	onSave,
	enabledReferralChannels = [],
	className: customClassName,
	...props
}) {
	const [config, setConfig] = useState<FormConfig>(() => {
		// Default email field that every form must have
		const defaultEmailField: FormField = {
			id: "field-email-default",
			type: "email",
			label: "Email",
			placeholder: "your@email.com",
			required: true,
			order: 0,
		};

		const defaultConfig: FormConfig = {
			id: `form-${campaignId}`,
			campaignId,
			fields: [defaultEmailField],
			design: DEFAULT_DESIGN,
			behavior: {
				submitAction: "inline-message",
				successTitle: "Thank you for signing up!",
				successMessage: "We'll be in touch soon.",
				duplicateHandling: "block",
			},
		};

		// Merge initialConfig with defaults to ensure all required properties exist
		if (initialConfig) {
			// Ensure email field exists in initialConfig
			const hasEmailField = initialConfig.fields?.some(
				(field) => field.type === "email",
			);

			const fields = hasEmailField
				? initialConfig.fields || []
				: [defaultEmailField, ...(initialConfig.fields || [])];

			return {
				...defaultConfig,
				...initialConfig,
				fields,
				design: initialConfig.design || DEFAULT_DESIGN,
				behavior: {
					...defaultConfig.behavior,
					...initialConfig.behavior,
				},
			};
		}

		return defaultConfig;
	});

	// Top-level builder mode (Form vs Success Screen)
	const [builderMode, setBuilderMode] = useState<BuilderMode>("form");
	const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>();
	const [showPreview, setShowPreview] = useState(false);
	const [previewDevice, setPreviewDevice] = useState<
		"mobile" | "tablet" | "desktop"
	>("desktop");
	const [saving, setSaving] = useState(false);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Auto-save to localStorage every 10 seconds
	useEffect(() => {
		if (hasUnsavedChanges) {
			const timer = setTimeout(() => {
				localStorage.setItem(
					`form-builder-${campaignId}`,
					JSON.stringify(config),
				);
				console.log("Auto-saved to localStorage");
			}, 10000);

			return () => clearTimeout(timer);
		}
	}, [config, campaignId, hasUnsavedChanges]);

	// Load from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem(`form-builder-${campaignId}`);
		if (saved && !initialConfig) {
			try {
				const parsedConfig = JSON.parse(saved);
				setConfig(parsedConfig);
			} catch (error) {
				console.error("Failed to load saved form:", error);
			}
		}
	}, [campaignId, initialConfig]);

	const handleFieldSelect = useCallback(
		(fieldType: FormField["type"]) => {
			// Add default options for select/radio/checkbox fields
			const needsOptions = ["select", "radio", "checkbox"].includes(fieldType);

			const newField: FormField = {
				id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				type: fieldType,
				label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
				placeholder: "",
				required: false,
				order: config.fields.length,
				...(needsOptions && { options: ["Option 1", "Option 2", "Option 3"] }),
			};

			setConfig((prev) => ({
				...prev,
				fields: [...prev.fields, newField],
			}));
			setSelectedFieldId(newField.id);
			setHasUnsavedChanges(true);
		},
		[config.fields.length],
	);

	const handleFieldsChange = useCallback((fields: FormField[]) => {
		setConfig((prev) => ({
			...prev,
			fields,
		}));
		setHasUnsavedChanges(true);
	}, []);

	const handleFieldUpdate = useCallback((updatedField: FormField) => {
		setConfig((prev) => ({
			...prev,
			fields: prev.fields.map((f) =>
				f.id === updatedField.id ? updatedField : f,
			),
		}));
		setHasUnsavedChanges(true);
	}, []);

	const handleDesignChange = useCallback((design: FormDesign) => {
		setConfig((prev) => ({
			...prev,
			design,
		}));
		setHasUnsavedChanges(true);
	}, []);

	const handleBehaviorChange = useCallback((behavior: FormBehavior) => {
		setConfig((prev) => ({
			...prev,
			behavior,
		}));
		setHasUnsavedChanges(true);
	}, []);

	const handleSave = async () => {
		setSaving(true);
		try {
			await onSave(config);
			setHasUnsavedChanges(false);
			localStorage.removeItem(`form-builder-${campaignId}`);
		} catch (error) {
			console.error("Failed to save form:", error);
		} finally {
			setSaving(false);
		}
	};

	const handleTogglePreview = () => {
		setShowPreview(!showPreview);
	};

	const handleBuilderModeChange = (index: number) => {
		setBuilderMode(index === 0 ? "form" : "success-screen");
		// Clear field selection when switching modes
		setSelectedFieldId(undefined);
		// Reset preview when switching modes
		setShowPreview(false);
	};

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	return (
		<div className={classNames} {...props}>
			{/* Header */}
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<h2 className={styles.title}>Form Builder</h2>
					{hasUnsavedChanges && (
						<Badge
							text="Unsaved changes"
							variant="yellow"
							styleType="light"
							size="small"
							iconClass="save-line"
							iconPosition="left"
						/>
					)}
				</div>

				<div className={styles.headerActions}>
					{showPreview && (
						<div className={styles.deviceSelector}>
							<IconOnlyButton
								iconClass="smartphone-line"
								variant={previewDevice === "mobile" ? "primary" : "secondary"}
								ariaLabel="Mobile preview"
								onClick={() => setPreviewDevice("mobile")}
							/>
							<IconOnlyButton
								iconClass="tablet-line"
								variant={previewDevice === "tablet" ? "primary" : "secondary"}
								ariaLabel="Tablet preview"
								onClick={() => setPreviewDevice("tablet")}
							/>
							<IconOnlyButton
								iconClass="computer-line"
								variant={previewDevice === "desktop" ? "primary" : "secondary"}
								ariaLabel="Desktop preview"
								onClick={() => setPreviewDevice("desktop")}
							/>
						</div>
					)}

					<Button
						variant="secondary"
						size="medium"
						leftIcon={showPreview ? "edit-line" : "eye-line"}
						onClick={handleTogglePreview}
					>
						{showPreview ? "Edit" : "Preview"}
					</Button>

					<Button
						variant="primary"
						size="medium"
						leftIcon={saving ? "loader-4-line" : "save-line"}
						onClick={handleSave}
						disabled={saving || !hasUnsavedChanges}
					>
						{saving ? "Saving..." : "Save Form"}
					</Button>
				</div>
			</div>

			{/* Top-level Mode Tabs */}
			<div className={styles.modeTabs}>
				<TabMenuHorizontal
					items={[
						<TabMenuHorizontalItem
							key="form"
							active={builderMode === "form"}
							leftIcon="ri-file-list-3-line"
							text="Form"
						/>,
						<TabMenuHorizontalItem
							key="success-screen"
							active={builderMode === "success-screen"}
							leftIcon="ri-check-double-line"
							text="Success Screen"
						/>,
					]}
					activeTab={builderMode === "form" ? 0 : 1}
					onTabClick={handleBuilderModeChange}
				/>
			</div>

			{/* Main content based on builder mode */}
			{builderMode === "form" ? (
				// FORM MODE
				<div
					className={`${styles.builder} ${showPreview ? styles.previewMode : ""}`}
				>
					{/* Left panel - Field Palette (hidden in preview mode) */}
					{!showPreview && (
						<aside className={styles.leftPanel}>
							<FieldPalette onFieldSelect={handleFieldSelect} />
						</aside>
					)}

					{/* Center panel - Form Canvas or Preview */}
					<main className={styles.centerPanel}>
						{showPreview ? (
							<div className={styles.formPreviewWrapper}>
								<FormPreview config={config} device={previewDevice} />
							</div>
						) : (
							<FormCanvas
								fields={config.fields}
								onFieldsChange={handleFieldsChange}
								onFieldSelect={setSelectedFieldId}
								selectedFieldId={selectedFieldId}
								layout={config.design.layout}
							/>
						)}
					</main>

					{/* Right panel - Field Editor or Style Editor */}
					<aside className={styles.rightPanel}>
						{selectedFieldId ? (
							<FieldEditor
								field={
									config.fields.find((f) => f.id === selectedFieldId) || null
								}
								allFields={config.fields}
								onFieldUpdate={handleFieldUpdate}
								onClose={() => setSelectedFieldId(undefined)}
							/>
						) : (
							<FormStyleEditor
								design={config.design}
								onChange={handleDesignChange}
								selectedFieldId={selectedFieldId}
							/>
						)}
					</aside>
				</div>
			) : (
				// SUCCESS SCREEN MODE
				<div className={styles.builder}>
					{/* Left panel - Info/Tips */}
					<aside className={styles.leftPanel}>
						<div className={styles.successInfoPanel}>
							<div className={styles.successInfoHeader}>
								<i className="ri-lightbulb-line" aria-hidden="true" />
								<h3>Success Screen Tips</h3>
							</div>
							<div className={styles.successInfoContent}>
								<p>
									The success screen is shown to users after they sign up. Make
									it memorable!
								</p>
								<ul>
									<li>Keep your title concise and welcoming</li>
									<li>Tell users what to expect next</li>
									<li>Enable referrals to boost viral growth</li>
								</ul>
								{enabledReferralChannels.length > 0 && (
									<div className={styles.referralBadge}>
										<i className="ri-share-line" aria-hidden="true" />
										<span>
											Referrals enabled ({enabledReferralChannels.length}{" "}
											channels)
										</span>
									</div>
								)}
							</div>
						</div>
					</aside>

					{/* Center panel - Success Screen Preview */}
					<main className={styles.centerPanel}>
						<div className={styles.successPreviewWrapper}>
							<SuccessScreenPreview
								design={config.design}
								behavior={config.behavior}
								device={showPreview ? previewDevice : "desktop"}
								showReferralLinks={enabledReferralChannels.length > 0}
								enabledChannels={enabledReferralChannels}
							/>
						</div>
					</main>

					{/* Right panel - Success Message Editor */}
					<aside className={styles.rightPanel}>
						<SuccessMessageEditor
							behavior={config.behavior}
							design={config.design}
							enabledChannels={enabledReferralChannels}
							onChange={handleBehaviorChange}
						/>
					</aside>
				</div>
			)}
		</div>
	);
});

FormBuilder.displayName = "FormBuilder";
