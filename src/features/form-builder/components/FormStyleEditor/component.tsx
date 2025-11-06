/**
 * FormStyleEditor Component
 * Edit form design settings (colors, typography, spacing)
 */

import { type HTMLAttributes, memo } from "react";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";
import { TextArea } from "@/proto-design-system/TextArea/textArea";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
import type { FormDesign } from "@/types/common.types";
import styles from "./component.module.scss";

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
		const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

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

		const handleCustomCssChange = (value: string) => {
			onChange({
				...design,
				customCss: value,
			});
		};

		return (
			<div className={classNames} {...props}>
				<div className={styles.header}>
					<h3 className={styles.title}>Style Editor</h3>
					<p className={styles.subtitle}>
						{selectedFieldId
							? "Field selected - Edit properties"
							: "Customize form appearance"}
					</p>
				</div>

				<div className={styles.content}>
					{/* Layout Section */}
					<section className={styles.section}>
						<h4 className={styles.sectionTitle}>Layout</h4>
						<div className={styles.layoutOptions}>
							{(["single-column", "two-column", "multi-step"] as const).map(
								(layoutType) => (
									<button
										key={layoutType}
										type="button"
										className={`${styles.layoutOption} ${design.layout === layoutType ? styles.active : ""}`}
										onClick={() => handleLayoutChange(layoutType)}
										aria-label={`${layoutType} layout`}
									>
										<i
											className={
												layoutType === "single-column"
													? "ri-layout-line"
													: layoutType === "two-column"
														? "ri-layout-column-line"
														: "ri-layout-row-line"
											}
											aria-hidden="true"
										/>
										<span>{layoutType.replace("-", " ")}</span>
									</button>
								),
							)}
						</div>
					</section>

					<ContentDivider size="thin" />

					{/* Colors Section */}
					<section className={styles.section}>
						<h4 className={styles.sectionTitle}>Colors</h4>
						<div className={styles.colorGrid}>
							<div className={styles.colorItem}>
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
									<TextInput
										id="color-primary-text"
										label="Primary"
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
									<TextInput
										id="color-background-text"
										label="Background"
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
								<div className={styles.colorInputGroup}>
									<input
										id="color-text"
										type="color"
										value={design.colors.text}
										onChange={(e) => handleColorChange("text", e.target.value)}
										className={styles.colorPicker}
										aria-label="Text color"
									/>
									<TextInput
										id="color-text-text"
										label="Text"
										type="text"
										value={design.colors.text}
										onChange={(e) => handleColorChange("text", e.target.value)}
										placeholder="#000000"
									/>
								</div>
							</div>

							<div className={styles.colorItem}>
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
									<TextInput
										id="color-border-text"
										label="Border"
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
								<div className={styles.colorInputGroup}>
									<input
										id="color-error"
										type="color"
										value={design.colors.error}
										onChange={(e) => handleColorChange("error", e.target.value)}
										className={styles.colorPicker}
										aria-label="Error color"
									/>
									<TextInput
										id="color-error-text"
										label="Error"
										type="text"
										value={design.colors.error}
										onChange={(e) => handleColorChange("error", e.target.value)}
										placeholder="#ff0000"
									/>
								</div>
							</div>

							<div className={styles.colorItem}>
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
									<TextInput
										id="color-success-text"
										label="Success"
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

					<ContentDivider size="thin" />

					{/* Typography Section */}
					<section className={styles.section}>
						<h4 className={styles.sectionTitle}>Typography</h4>
						<div className={styles.inputGrid}>
							<TextInput
								id="font-family"
								label="Font Family"
								type="text"
								value={design.typography.fontFamily}
								onChange={(e) =>
									handleTypographyChange("fontFamily", e.target.value)
								}
								placeholder="Inter, sans-serif"
							/>
							<TextInput
								id="font-size"
								label="Font Size (px)"
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
							<TextInput
								id="font-weight"
								label="Font Weight"
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
					</section>

					<ContentDivider size="thin" />

					{/* Spacing Section */}
					<section className={styles.section}>
						<h4 className={styles.sectionTitle}>Spacing</h4>
						<div className={styles.inputGrid}>
							<TextInput
								id="padding"
								label="Padding (px)"
								type="number"
								value={design.spacing.padding.toString()}
								onChange={(e) =>
									handleSpacingChange("padding", parseInt(e.target.value) || 16)
								}
								min={0}
								max={100}
							/>
							<TextInput
								id="gap"
								label="Gap (px)"
								type="number"
								value={design.spacing.gap.toString()}
								onChange={(e) =>
									handleSpacingChange("gap", parseInt(e.target.value) || 16)
								}
								min={0}
								max={100}
							/>
							<TextInput
								id="border-radius"
								label="Border Radius (px)"
								type="number"
								value={design.borderRadius.toString()}
								onChange={(e) =>
									handleBorderRadiusChange(parseInt(e.target.value) || 8)
								}
								min={0}
								max={50}
							/>
						</div>
					</section>

					<ContentDivider size="thin" />

					{/* Custom CSS Section */}
					<section className={styles.section}>
						<h4 className={styles.sectionTitle}>Custom CSS</h4>
						<TextArea
							id="custom-css"
							label="Additional Styles"
							value={design.customCss || ""}
							onChange={(e) => handleCustomCssChange(e.target.value)}
							placeholder="/* Add custom CSS here */"
							rows={8}
						/>
					</section>
				</div>
			</div>
		);
	},
);

FormStyleEditor.displayName = "FormStyleEditor";
