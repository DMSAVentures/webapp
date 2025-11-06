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
import type { FormConfig, FormDesign, FormField } from "@/types/common.types";
import { FieldPalette } from "../FieldPalette/component";
import { FormCanvas } from "../FormCanvas/component";
import { FormPreview } from "../FormPreview/component";
import { FormStyleEditor } from "../FormStyleEditor/component";
import styles from "./component.module.scss";

export interface FormBuilderProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onSave"> {
	/** Campaign ID this form belongs to */
	campaignId: string;
	/** Initial form configuration */
	initialConfig?: FormConfig;
	/** Callback when form is saved */
	onSave: (config: FormConfig) => Promise<void>;
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
	customCss: "",
};

/**
 * FormBuilder provides a visual interface for building forms
 */
export const FormBuilder = memo<FormBuilderProps>(function FormBuilder({
	campaignId,
	initialConfig,
	onSave,
	className: customClassName,
	...props
}) {
	const [config, setConfig] = useState<FormConfig>(
		initialConfig || {
			id: `form-${campaignId}`,
			campaignId,
			fields: [],
			design: DEFAULT_DESIGN,
			behavior: {
				submitAction: "inline-message",
				successMessage: "Thank you for signing up!",
				doubleOptIn: true,
				duplicateHandling: "block",
			},
		},
	);

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
			const newField: FormField = {
				id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				type: fieldType,
				label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
				placeholder: "",
				required: false,
				order: config.fields.length,
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

	const handleDesignChange = useCallback((design: FormDesign) => {
		setConfig((prev) => ({
			...prev,
			design,
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
						leftIcon={showPreview ? "ri-edit-line" : "ri-eye-line"}
						onClick={handleTogglePreview}
					>
						{showPreview ? "Edit" : "Preview"}
					</Button>

					<Button
						variant="primary"
						size="medium"
						leftIcon={saving ? "ri-loader-4-line ri-spin" : "ri-save-line"}
						onClick={handleSave}
						disabled={saving || !hasUnsavedChanges}
					>
						{saving ? "Saving..." : "Save Form"}
					</Button>
				</div>
			</div>

			{/* Main content */}
			{showPreview ? (
				<div className={styles.previewContainer}>
					<FormPreview config={config} device={previewDevice} />
				</div>
			) : (
				<div className={styles.builder}>
					{/* Left panel - Field Palette */}
					<aside className={styles.leftPanel}>
						<FieldPalette onFieldSelect={handleFieldSelect} />
					</aside>

					{/* Center panel - Form Canvas */}
					<main className={styles.centerPanel}>
						<FormCanvas
							fields={config.fields}
							onFieldsChange={handleFieldsChange}
							onFieldSelect={setSelectedFieldId}
							selectedFieldId={selectedFieldId}
						/>
					</main>

					{/* Right panel - Style Editor */}
					<aside className={styles.rightPanel}>
						<FormStyleEditor
							design={config.design}
							onChange={handleDesignChange}
							selectedFieldId={selectedFieldId}
						/>
					</aside>
				</div>
			)}
		</div>
	);
});

FormBuilder.displayName = "FormBuilder";
