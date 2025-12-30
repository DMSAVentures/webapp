/**
 * FormStyleEditor Component
 * Edit form design settings (colors, typography, spacing)
 */

import {
	Columns2,
	Grid2x2,
	LayoutList,
	Palette,
} from "lucide-react";
import { type HTMLAttributes, memo, useCallback, useState } from "react";
import { Divider } from "@/proto-design-system/components/layout/Divider";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Button, ButtonGroup } from "@/proto-design-system/components/primitives/Button";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
import { TextArea } from "@/proto-design-system/components/forms/TextArea";
import type { FormDesign } from "@/types/common.types";
import { TemplateSelector } from "../TemplateSelector";
import styles from "./component.module.scss";

type StyleMode = "templates" | "custom";

export interface FormStyleEditorProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Current design settings */
	design: FormDesign;
	/** Callback when design changes */
	onChange: (design: FormDesign) => void;
	/** Currently selected field ID */
	selectedFieldId?: string;
	/** Additional CSS class name */
	className?: string;
}

/**
 * FormStyleEditor allows editing form design properties
 */
export const FormStyleEditor = memo<FormStyleEditorProps>(
	function FormStyleEditor({
		design,
		onChange,
		selectedFieldId,
		className: customClassName,
		...props
	}) {
		const [mode, setMode] = useState<StyleMode>("templates");
		const [selectedTemplateId, setSelectedTemplateId] = useState<
			string | undefined
		>();

		const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

		const handleTemplateSelect = useCallback(
			(newDesign: FormDesign, templateId: string) => {
				setSelectedTemplateId(templateId);
				onChange(newDesign);
			},
			[onChange],
		);

		const handleColorChange = (
			colorKey: keyof FormDesign["colors"],
			value: string,
		) => {
			onChange({
				...design,
				colors: {
					...design.colors,
					[colorKey]: value,
				},
			});
		};

		const handleTypographyChange = (
			key: keyof FormDesign["typography"],
			value: string | number,
		) => {
			onChange({
				...design,
				typography: {
					...design.typography,
					[key]: value,
				},
			});
		};

		const handleSpacingChange = (
			key: keyof FormDesign["spacing"],
			value: number,
		) => {
			onChange({
				...design,
				spacing: {
					...design.spacing,
					[key]: value,
				},
			});
		};

		const handleLayoutChange = (layout: FormDesign["layout"]) => {
			onChange({
				...design,
				layout,
			});
		};

		const handleBorderRadiusChange = (value: number) => {
			onChange({
				...design,
				borderRadius: value,
			});
		};

		const handleSubmitButtonTextChange = (value: string) => {
			onChange({
				...design,
				submitButtonText: value,
			});
		};

		const handleCustomCssChange = (value: string) => {
			onChange({
				...design,
				customCss: value,
			});
		};

		return (
			<div className={classNames} {...props}>
				<Stack gap="xs" className={styles.header}>
					<Text as="h3" size="lg" weight="semibold">Appearance Editor</Text>
					<Text size="sm" color="muted">
						{selectedFieldId
							? "Field selected - Edit properties"
							: "Customize form appearance"}
					</Text>
				</Stack>

				{/* Layout Section - Always visible */}
				<Stack gap="sm" className={styles.layoutSection}>
					<Text as="h4" size="md" weight="semibold">Layout</Text>
					<div className={styles.layoutOptions}>
						<ButtonGroup isFullWidth isAttached>
							<Button
								variant={design.layout === "single-column" ? "primary" : "ghost"}
								size="sm"
								leftIcon={<LayoutList size={16} />}
								onClick={() => handleLayoutChange("single-column")}
							>
								Single
							</Button>
							<Button
								variant={design.layout === "two-column" ? "primary" : "ghost"}
								size="sm"
								leftIcon={<Columns2 size={16} />}
								onClick={() => handleLayoutChange("two-column")}
							>
								Double
							</Button>
							<Button
								variant={design.layout === "multi-step" ? "primary" : "ghost"}
								size="sm"
								leftIcon={<Grid2x2 size={16} />}
								onClick={() => handleLayoutChange("multi-step")}
							>
								Multi
							</Button>
						</ButtonGroup>
					</div>
				</Stack>
				{/* Mode Toggle */}
				<div className={styles.modeToggle}>
					<ButtonGroup isFullWidth isAttached>
						<Button
							variant={mode === "templates" ? "outline" : "ghost"}
							size="sm"
							leftIcon={<Grid2x2 size={16} />}
							onClick={() => setMode("templates")}
						>
							Templates
						</Button>
						<Button
							variant={mode === "custom" ? "outline" : "ghost"}
							size="sm"
							leftIcon={<Palette size={16} />}
							onClick={() => setMode("custom")}
						>
							Custom
						</Button>
					</ButtonGroup>
				</div>

				{mode === "templates" ? (
					<div className={styles.content}>
						<TemplateSelector
							selectedTemplateId={selectedTemplateId}
							onTemplateSelect={handleTemplateSelect}
						/>
					</div>
				) : (
					<div className={styles.content}>
						{/* Colors Section */}
						<section className={styles.section}>
							<Text as="h4" size="md" weight="semibold">Colors</Text>
							<div className={styles.colorGrid}>
								<div className={styles.colorItem}>
									<label htmlFor="color-primary-text" className={styles.colorLabel}>Primary</label>
									<div className={styles.colorInputGroup}>
										<input
											id="color-primary"
											type="color"
											value={design.colors.primary}
											onChange={(e) =>
												handleColorChange("primary", e.target.value)
											}
											className={styles.colorPicker}
											aria-label="Primary color"
										/>
										<Input
											id="color-primary-text"
											type="text"
											value={design.colors.primary}
											onChange={(e) =>
												handleColorChange("primary", e.target.value)
											}
											placeholder="#000000"
										/>
									</div>
								</div>

								<div className={styles.colorItem}>
									<label htmlFor="color-background-text" className={styles.colorLabel}>Background</label>
									<div className={styles.colorInputGroup}>
										<input
											id="color-background"
											type="color"
											value={design.colors.background}
											onChange={(e) =>
												handleColorChange("background", e.target.value)
											}
											className={styles.colorPicker}
											aria-label="Background color"
										/>
										<Input
											id="color-background-text"
											type="text"
											value={design.colors.background}
											onChange={(e) =>
												handleColorChange("background", e.target.value)
											}
											placeholder="#ffffff"
										/>
									</div>
								</div>

								<div className={styles.colorItem}>
									<label htmlFor="color-text-text" className={styles.colorLabel}>Text</label>
									<div className={styles.colorInputGroup}>
										<input
											id="color-text"
											type="color"
											value={design.colors.text}
											onChange={(e) =>
												handleColorChange("text", e.target.value)
											}
											className={styles.colorPicker}
											aria-label="Text color"
										/>
										<Input
											id="color-text-text"
											type="text"
											value={design.colors.text}
											onChange={(e) =>
												handleColorChange("text", e.target.value)
											}
											placeholder="#000000"
										/>
									</div>
								</div>

								<div className={styles.colorItem}>
									<label htmlFor="color-border-text" className={styles.colorLabel}>Border</label>
									<div className={styles.colorInputGroup}>
										<input
											id="color-border"
											type="color"
											value={design.colors.border}
											onChange={(e) =>
												handleColorChange("border", e.target.value)
											}
											className={styles.colorPicker}
											aria-label="Border color"
										/>
										<Input
											id="color-border-text"
											type="text"
											value={design.colors.border}
											onChange={(e) =>
												handleColorChange("border", e.target.value)
											}
											placeholder="#e0e0e0"
										/>
									</div>
								</div>

								<div className={styles.colorItem}>
									<label htmlFor="color-error-text" className={styles.colorLabel}>Error</label>
									<div className={styles.colorInputGroup}>
										<input
											id="color-error"
											type="color"
											value={design.colors.error}
											onChange={(e) =>
												handleColorChange("error", e.target.value)
											}
											className={styles.colorPicker}
											aria-label="Error color"
										/>
										<Input
											id="color-error-text"
											type="text"
											value={design.colors.error}
											onChange={(e) =>
												handleColorChange("error", e.target.value)
											}
											placeholder="#ff0000"
										/>
									</div>
								</div>

								<div className={styles.colorItem}>
									<label htmlFor="color-success-text" className={styles.colorLabel}>Success</label>
									<div className={styles.colorInputGroup}>
										<input
											id="color-success"
											type="color"
											value={design.colors.success}
											onChange={(e) =>
												handleColorChange("success", e.target.value)
											}
											className={styles.colorPicker}
											aria-label="Success color"
										/>
										<Input
											id="color-success-text"
											type="text"
											value={design.colors.success}
											onChange={(e) =>
												handleColorChange("success", e.target.value)
											}
											placeholder="#00ff00"
										/>
									</div>
								</div>
							</div>
						</section>

						<Divider />

						{/* Typography Section */}
						<section className={styles.section}>
							<Text as="h4" size="md" weight="semibold">Typography</Text>
							<div className={styles.inputGrid}>
								<div className={styles.inputItem}>
									<label htmlFor="font-family" className={styles.inputLabel}>Font Family</label>
									<Input
										id="font-family"
										type="text"
										value={design.typography.fontFamily}
										onChange={(e) =>
											handleTypographyChange("fontFamily", e.target.value)
										}
										placeholder="Inter, sans-serif"
									/>
								</div>
								<div className={styles.inputItem}>
									<label htmlFor="font-size" className={styles.inputLabel}>Font Size (px)</label>
									<Input
										id="font-size"
										type="number"
										value={design.typography.fontSize.toString()}
										onChange={(e) =>
											handleTypographyChange(
												"fontSize",
												parseInt(e.target.value) || 16,
											)
										}
										min={12}
										max={24}
									/>
								</div>
								<div className={styles.inputItem}>
									<label htmlFor="font-weight" className={styles.inputLabel}>Font Weight</label>
									<Input
										id="font-weight"
										type="number"
										value={design.typography.fontWeight.toString()}
										onChange={(e) =>
											handleTypographyChange(
												"fontWeight",
												parseInt(e.target.value) || 400,
											)
										}
										min={100}
										max={900}
										step={100}
									/>
								</div>
							</div>
						</section>

						<Divider />

						{/* Spacing Section */}
						<section className={styles.section}>
							<Text as="h4" size="md" weight="semibold">Spacing</Text>
							<div className={styles.inputGrid}>
								<div className={styles.inputItem}>
									<label htmlFor="padding" className={styles.inputLabel}>Padding (px)</label>
									<Input
										id="padding"
										type="number"
										value={design.spacing.padding.toString()}
										onChange={(e) =>
											handleSpacingChange(
												"padding",
												parseInt(e.target.value) || 16,
											)
										}
										min={0}
										max={100}
									/>
								</div>
								<div className={styles.inputItem}>
									<label htmlFor="gap" className={styles.inputLabel}>Gap (px)</label>
									<Input
										id="gap"
										type="number"
										value={design.spacing.gap.toString()}
										onChange={(e) =>
											handleSpacingChange("gap", parseInt(e.target.value) || 16)
										}
										min={0}
										max={100}
									/>
								</div>
								<div className={styles.inputItem}>
									<label htmlFor="border-radius" className={styles.inputLabel}>Border Radius (px)</label>
									<Input
										id="border-radius"
										type="number"
										value={design.borderRadius.toString()}
										onChange={(e) =>
											handleBorderRadiusChange(parseInt(e.target.value) || 8)
										}
										min={0}
										max={50}
									/>
								</div>
							</div>
						</section>

						<Divider />

						{/* Submit Button Section */}
						<section className={styles.section}>
							<Text as="h4" size="md" weight="semibold">Submit Button</Text>
							<div className={styles.inputGrid}>
								<div className={styles.inputItem}>
									<label htmlFor="submit-button-text" className={styles.inputLabel}>Button Text</label>
									<Input
										id="submit-button-text"
										type="text"
										value={design.submitButtonText || "Submit"}
										onChange={(e) => handleSubmitButtonTextChange(e.target.value)}
										placeholder="Submit"
									/>
								</div>
							</div>
						</section>

						<Divider />

						{/* Custom CSS Section */}
						<section className={styles.section}>
							<Text as="h4" size="md" weight="semibold">Custom CSS</Text>
							<div className={styles.inputItem}>
								<label htmlFor="custom-css" className={styles.inputLabel}>Additional Styles</label>
								<TextArea
									id="custom-css"
									value={design.customCss || ""}
									onChange={(e) => handleCustomCssChange(e.target.value)}
									placeholder="/* Add custom CSS here */"
									rows={8}
								/>
							</div>
						</section>
					</div>
				)}
			</div>
		);
	},
);

FormStyleEditor.displayName = "FormStyleEditor";
