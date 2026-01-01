/**
 * FormBuilder Component
 * Main form builder interface with drag-drop editor
 */

import {
	CheckCheck,
	Eye,
	FileText,
	Lightbulb,
	Loader2,
	Pencil,
	Save,
	Share2,
	X,
} from "lucide-react";
import {
	type HTMLAttributes,
	memo,
	useCallback,
	useEffect,
	useState,
} from "react";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import {
	Tab,
	TabList,
	Tabs,
} from "@/proto-design-system/components/navigation/Tabs";
import {
	Button,
	ButtonGroup,
} from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Text } from "@/proto-design-system/components/primitives/Text";
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
type PreviewDevice = "mobile" | "desktop";

export interface FormBuilderProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onSave"> {
	/** Campaign ID this form belongs to */
	campaignId: string;
	/** Initial form configuration */
	initialConfig?: FormConfig;
	/** Callback when form is saved */
	onSave: (config: FormConfig) => Promise<void>;
	/** Callback when cancel is clicked */
	onCancel?: () => void;
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

// ============================================================================
// Pure Functions
// ============================================================================

/** Creates a default email field that every form must have */
function createDefaultEmailField(): FormField {
	return {
		id: "field-email-default",
		type: "email",
		label: "Email",
		placeholder: "your@email.com",
		required: true,
		order: 0,
	};
}

/** Creates the default form configuration */
function createDefaultConfig(campaignId: string): FormConfig {
	return {
		id: `form-${campaignId}`,
		campaignId,
		fields: [createDefaultEmailField()],
		design: DEFAULT_DESIGN,
		behavior: {
			submitAction: "inline-message",
			successTitle: "Thank you for signing up!",
			successMessage: "We'll be in touch soon.",
			duplicateHandling: "block",
		},
	};
}

/** Merges initial config with defaults to ensure all required properties exist */
function mergeWithDefaults(
	campaignId: string,
	initialConfig?: FormConfig,
): FormConfig {
	const defaultConfig = createDefaultConfig(campaignId);

	if (!initialConfig) {
		return defaultConfig;
	}

	const hasEmailField = initialConfig.fields?.some(
		(field) => field.type === "email",
	);

	const fields = hasEmailField
		? initialConfig.fields || []
		: [createDefaultEmailField(), ...(initialConfig.fields || [])];

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

/** Creates a new form field of the specified type */
function createFormField(
	fieldType: FormField["type"],
	order: number,
): FormField {
	const needsOptions = ["select", "radio", "checkbox"].includes(fieldType);

	return {
		id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		type: fieldType,
		label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
		placeholder: "",
		required: false,
		order,
		...(needsOptions && { options: ["Option 1", "Option 2", "Option 3"] }),
	};
}

/** Gets the localStorage key for a campaign's form config */
function getStorageKey(campaignId: string): string {
	return `form-builder-${campaignId}`;
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing form auto-save to localStorage */
function useFormAutoSave(
	config: FormConfig,
	campaignId: string,
	hasUnsavedChanges: boolean,
) {
	useEffect(() => {
		if (!hasUnsavedChanges) return;

		const timer = setTimeout(() => {
			localStorage.setItem(getStorageKey(campaignId), JSON.stringify(config));
			console.log("Auto-saved to localStorage");
		}, 10000);

		return () => clearTimeout(timer);
	}, [config, campaignId, hasUnsavedChanges]);
}

/** Hook for loading form config from localStorage */
function useLocalStorageFormConfig(
	campaignId: string,
	initialConfig?: FormConfig,
): FormConfig | null {
	const [savedConfig, setSavedConfig] = useState<FormConfig | null>(null);

	useEffect(() => {
		const saved = localStorage.getItem(getStorageKey(campaignId));
		if (saved && !initialConfig) {
			try {
				const parsedConfig = JSON.parse(saved);
				setSavedConfig(parsedConfig);
			} catch (error) {
				console.error("Failed to load saved form:", error);
			}
		}
	}, [campaignId, initialConfig]);

	return savedConfig;
}

/** Hook for managing form configuration state */
function useFormConfig(campaignId: string, initialConfig?: FormConfig) {
	const [config, setConfig] = useState<FormConfig>(() =>
		mergeWithDefaults(campaignId, initialConfig),
	);

	const updateFields = useCallback((fields: FormField[]) => {
		setConfig((prev) => ({ ...prev, fields }));
	}, []);

	const updateField = useCallback((updatedField: FormField) => {
		setConfig((prev) => ({
			...prev,
			fields: prev.fields.map((f) =>
				f.id === updatedField.id ? updatedField : f,
			),
		}));
	}, []);

	const addField = useCallback(
		(fieldType: FormField["type"]) => {
			const newField = createFormField(fieldType, config.fields.length);
			setConfig((prev) => ({
				...prev,
				fields: [...prev.fields, newField],
			}));
			return newField.id;
		},
		[config.fields.length],
	);

	const updateDesign = useCallback((design: FormDesign) => {
		setConfig((prev) => ({ ...prev, design }));
	}, []);

	const updateBehavior = useCallback((behavior: FormBehavior) => {
		setConfig((prev) => ({ ...prev, behavior }));
	}, []);

	const setFullConfig = useCallback((newConfig: FormConfig) => {
		setConfig(newConfig);
	}, []);

	return {
		config,
		updateFields,
		updateField,
		addField,
		updateDesign,
		updateBehavior,
		setFullConfig,
	};
}

// ============================================================================
// Component
// ============================================================================

/**
 * FormBuilder provides a visual interface for building forms
 */
export const FormBuilder = memo<FormBuilderProps>(function FormBuilder({
	campaignId,
	initialConfig,
	onSave,
	onCancel,
	enabledReferralChannels = [],
	className: customClassName,
	...props
}) {
	// State
	const [builderMode, setBuilderMode] = useState<BuilderMode>("form");
	const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>();
	const [showPreview, setShowPreview] = useState(false);
	const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
	const [saving, setSaving] = useState(false);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Custom hooks
	const {
		config,
		updateFields,
		updateField,
		addField,
		updateDesign,
		updateBehavior,
		setFullConfig,
	} = useFormConfig(campaignId, initialConfig);

	const savedConfig = useLocalStorageFormConfig(campaignId, initialConfig);

	// Load saved config from localStorage
	useEffect(() => {
		if (savedConfig) {
			setFullConfig(savedConfig);
		}
	}, [savedConfig, setFullConfig]);

	// Auto-save to localStorage
	useFormAutoSave(config, campaignId, hasUnsavedChanges);

	// Handlers
	const handleFieldSelect = useCallback(
		(fieldType: FormField["type"]) => {
			const newFieldId = addField(fieldType);
			setSelectedFieldId(newFieldId);
			setHasUnsavedChanges(true);
		},
		[addField],
	);

	const handleFieldsChange = useCallback(
		(fields: FormField[]) => {
			updateFields(fields);
			setHasUnsavedChanges(true);
		},
		[updateFields],
	);

	const handleFieldUpdate = useCallback(
		(updatedField: FormField) => {
			updateField(updatedField);
			setHasUnsavedChanges(true);
		},
		[updateField],
	);

	const handleDesignChange = useCallback(
		(design: FormDesign) => {
			updateDesign(design);
			setHasUnsavedChanges(true);
		},
		[updateDesign],
	);

	const handleBehaviorChange = useCallback(
		(behavior: FormBehavior) => {
			updateBehavior(behavior);
			setHasUnsavedChanges(true);
		},
		[updateBehavior],
	);

	const handleSave = useCallback(async () => {
		setSaving(true);
		try {
			await onSave(config);
			setHasUnsavedChanges(false);
			localStorage.removeItem(getStorageKey(campaignId));
		} catch (error) {
			console.error("Failed to save form:", error);
		} finally {
			setSaving(false);
		}
	}, [config, campaignId, onSave]);

	const handleTogglePreview = useCallback(() => {
		setShowPreview((prev) => !prev);
	}, []);

	const handleBuilderModeChange = useCallback((tabId: string) => {
		setBuilderMode(tabId as BuilderMode);
		setSelectedFieldId(undefined);
		setShowPreview(false);
	}, []);

	const handleFieldClose = useCallback(() => {
		setSelectedFieldId(undefined);
	}, []);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Render
	return (
		<Stack gap="md" className={classNames} {...props}>
			{/* Header with action buttons */}
			<Stack
				direction="row"
				justify="end"
				align="center"
				className={styles.header}
			>
				<Stack direction="row" gap="sm" align="center">
					{showPreview && (
						<ButtonGroup isAttached>
							<Button
								variant={previewDevice === "desktop" ? "outline" : "ghost"}
								size="sm"
								onClick={() => setPreviewDevice("desktop")}
							>
								Desktop
							</Button>
							<Button
								variant={previewDevice === "mobile" ? "outline" : "ghost"}
								size="sm"
								onClick={() => setPreviewDevice("mobile")}
							>
								Mobile
							</Button>
						</ButtonGroup>
					)}

					{onCancel && (
						<Button
							variant="ghost"
							size="md"
							leftIcon={<X size={16} />}
							onClick={onCancel}
						>
							Cancel
						</Button>
					)}

					<Button
						variant="secondary"
						size="md"
						leftIcon={showPreview ? <Pencil size={16} /> : <Eye size={16} />}
						onClick={handleTogglePreview}
					>
						{showPreview ? "Edit" : "Preview"}
					</Button>

					<Button
						variant="primary"
						size="md"
						leftIcon={
							saving ? (
								<Loader2 size={16} className={styles.spin} />
							) : (
								<Save size={16} />
							)
						}
						onClick={handleSave}
						disabled={saving || !hasUnsavedChanges}
					>
						{saving ? "Saving..." : "Save Form"}
					</Button>
				</Stack>
			</Stack>

			{/* Top-level Mode Tabs */}
			<div className={styles.modeTabs}>
				<Tabs
					activeTab={builderMode}
					onTabChange={handleBuilderModeChange}
					variant="line"
					size="sm"
				>
					<TabList aria-label="Form builder sections">
						<Tab id="form" icon={<FileText size={16} />}>
							Form
						</Tab>
						<Tab id="success-screen" icon={<CheckCheck size={16} />}>
							Success Screen
						</Tab>
					</TabList>
				</Tabs>
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
								onClose={handleFieldClose}
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
								<Icon icon={Lightbulb} size="md" />
								<Text as="h3" size="md" weight="semibold">
									Success Screen Tips
								</Text>
							</div>
							<div className={styles.successInfoContent}>
								<Text size="sm" className={styles.infoText}>
									The success screen is shown to users after they sign up. Make
									it memorable!
								</Text>
								<ul className={styles.tipsList}>
									<li>Keep your title concise and welcoming</li>
									<li>Tell users what to expect next</li>
									<li>Enable referrals to boost viral growth</li>
								</ul>
								{enabledReferralChannels.length > 0 && (
									<div className={styles.referralBadge}>
										<Icon icon={Share2} size="sm" />
										<Text size="sm">
											Referrals enabled ({enabledReferralChannels.length}{" "}
											channels)
										</Text>
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
		</Stack>
	);
});

FormBuilder.displayName = "FormBuilder";
