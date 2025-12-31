/**
 * EmailStyleEditor Component
 * Edit email design settings (colors, typography, spacing)
 */

import { Grid2x2, Palette } from "lucide-react";
import { type HTMLAttributes, memo, useCallback, useState } from "react";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Divider } from "@/proto-design-system/components/layout/Divider";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Text } from "@/proto-design-system/components/primitives/Text";
import { EMAIL_DESIGN_TEMPLATES } from "../../constants/emailDesignTemplates";
import type { EmailDesign } from "../../types/emailBlocks";
import styles from "./component.module.scss";

type StyleMode = "templates" | "custom";

export interface EmailStyleEditorProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Current design settings */
	design: EmailDesign;
	/** Callback when design changes */
	onChange: (design: EmailDesign) => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Check if a color is light (for text contrast)
 */
function isLightColor(hex: string): boolean {
	const c = hex.replace("#", "");
	const r = parseInt(c.substring(0, 2), 16);
	const g = parseInt(c.substring(2, 4), 16);
	const b = parseInt(c.substring(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5;
}

/**
 * EmailStyleEditor allows editing email design properties
 */
export const EmailStyleEditor = memo<EmailStyleEditorProps>(
	function EmailStyleEditor({
		design,
		onChange,
		className: customClassName,
		...props
	}) {
		const [mode, setMode] = useState<StyleMode>("templates");
		const [selectedTemplateId, setSelectedTemplateId] = useState<
			string | undefined
		>();

		const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

		const handleTemplateSelect = useCallback(
			(templateId: string) => {
				const template = EMAIL_DESIGN_TEMPLATES.find(
					(t) => t.id === templateId,
				);
				if (template) {
					setSelectedTemplateId(templateId);
					onChange({ ...template.design });
				}
			},
			[onChange],
		);

		const handleColorChange = (
			colorKey: keyof EmailDesign["colors"],
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
			key: keyof EmailDesign["typography"],
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
			key: keyof EmailDesign["spacing"],
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

		const handleBorderRadiusChange = (value: number) => {
			onChange({
				...design,
				borderRadius: value,
			});
		};

		const handleFooterTextChange = (value: string) => {
			onChange({
				...design,
				footerText: value,
			});
		};

		return (
			<div className={classNames} {...props}>
				<Stack gap="xs" className={styles.header}>
					<Stack direction="row" gap="sm" align="center">
						<Icon icon={Palette} size="md" color="secondary" />
						<Text as="h3" size="lg" weight="semibold">
							Email Appearance
						</Text>
					</Stack>
					<Text size="sm" color="muted">
						Customize colors, fonts, and spacing
					</Text>
				</Stack>

				{/* Mode Toggle */}
				<Stack direction="row" gap="xs" className={styles.modeToggle}>
					<button
						type="button"
						className={`${styles.modeButton} ${mode === "templates" ? styles.active : ""}`}
						onClick={() => setMode("templates")}
						aria-pressed={mode === "templates"}
					>
						<Icon icon={Grid2x2} size="sm" />
						Templates
					</button>
					<button
						type="button"
						className={`${styles.modeButton} ${mode === "custom" ? styles.active : ""}`}
						onClick={() => setMode("custom")}
						aria-pressed={mode === "custom"}
					>
						<Icon icon={Palette} size="sm" />
						Custom
					</button>
				</Stack>

				{mode === "templates" ? (
					<div className={styles.content}>
						<div className={styles.templateGrid}>
							{EMAIL_DESIGN_TEMPLATES.map((template) => (
								<button
									key={template.id}
									type="button"
									className={`${styles.templateCard} ${selectedTemplateId === template.id ? styles.selected : ""}`}
									onClick={() => handleTemplateSelect(template.id)}
									aria-pressed={selectedTemplateId === template.id}
								>
									<div
										className={styles.templatePreview}
										style={{
											backgroundColor: template.design.colors.background,
										}}
									>
										<div
											className={styles.templateContent}
											style={{
												backgroundColor:
													template.design.colors.contentBackground,
												borderRadius: `${template.design.borderRadius}px`,
											}}
										>
											<div
												className={styles.previewLine}
												style={{
													backgroundColor: template.design.colors.text,
													width: "60%",
												}}
											/>
											<div
												className={styles.previewLine}
												style={{
													backgroundColor: template.design.colors.secondaryText,
													width: "80%",
												}}
											/>
											<div
												className={styles.previewButton}
												style={{
													backgroundColor: template.design.colors.primary,
													color: isLightColor(template.design.colors.primary)
														? "#000"
														: "#fff",
												}}
											>
												Button
											</div>
										</div>
									</div>
									<div className={styles.templateInfo}>
										<span className={styles.templateName}>{template.name}</span>
										<span className={styles.templateDesc}>
											{template.description}
										</span>
									</div>
								</button>
							))}
						</div>
					</div>
				) : (
					<div className={styles.content}>
						{/* Colors Section */}
						<section className={styles.section}>
							<Text as="h4" size="md" weight="semibold">
								Colors
							</Text>
							<div className={styles.colorGrid}>
								<div className={styles.colorItem}>
									<label htmlFor="email-color-primary-text">Primary</label>
									<div className={styles.colorInputGroup}>
										<input
											id="email-color-primary"
											type="color"
											value={design.colors.primary}
											onChange={(e) =>
												handleColorChange("primary", e.target.value)
											}
											className={styles.colorPicker}
											aria-label="Primary color"
										/>
										<Input
											id="email-color-primary-text"
											type="text"
											value={design.colors.primary}
											onChange={(e) =>
												handleColorChange("primary", e.target.value)
											}
											placeholder="#2563EB"
										/>
									</div>
								</div>

								<div className={styles.colorItem}>
									<label htmlFor="email-color-background-text">
										Background
									</label>
									<div className={styles.colorInputGroup}>
										<input
											id="email-color-background"
											type="color"
											value={design.colors.background}
											onChange={(e) =>
												handleColorChange("background", e.target.value)
											}
											className={styles.colorPicker}
											aria-label="Background color"
										/>
										<Input
											id="email-color-background-text"
											type="text"
											value={design.colors.background}
											onChange={(e) =>
												handleColorChange("background", e.target.value)
											}
											placeholder="#f5f5f5"
										/>
									</div>
								</div>

								<div className={styles.colorItem}>
									<label htmlFor="email-color-content-background-text">
										Content Background
									</label>
									<div className={styles.colorInputGroup}>
										<input
											id="email-color-content-background"
											type="color"
											value={design.colors.contentBackground}
											onChange={(e) =>
												handleColorChange("contentBackground", e.target.value)
											}
											className={styles.colorPicker}
											aria-label="Content background color"
										/>
										<Input
											id="email-color-content-background-text"
											type="text"
											value={design.colors.contentBackground}
											onChange={(e) =>
												handleColorChange("contentBackground", e.target.value)
											}
											placeholder="#ffffff"
										/>
									</div>
								</div>

								<div className={styles.colorItem}>
									<label htmlFor="email-color-text-text">Text</label>
									<div className={styles.colorInputGroup}>
										<input
											id="email-color-text"
											type="color"
											value={design.colors.text}
											onChange={(e) =>
												handleColorChange("text", e.target.value)
											}
											className={styles.colorPicker}
											aria-label="Text color"
										/>
										<Input
											id="email-color-text-text"
											type="text"
											value={design.colors.text}
											onChange={(e) =>
												handleColorChange("text", e.target.value)
											}
											placeholder="#1a1a1a"
										/>
									</div>
								</div>

								<div className={styles.colorItem}>
									<label htmlFor="email-color-secondary-text-text">
										Secondary Text
									</label>
									<div className={styles.colorInputGroup}>
										<input
											id="email-color-secondary-text"
											type="color"
											value={design.colors.secondaryText}
											onChange={(e) =>
												handleColorChange("secondaryText", e.target.value)
											}
											className={styles.colorPicker}
											aria-label="Secondary text color"
										/>
										<Input
											id="email-color-secondary-text-text"
											type="text"
											value={design.colors.secondaryText}
											onChange={(e) =>
												handleColorChange("secondaryText", e.target.value)
											}
											placeholder="#6b6b6b"
										/>
									</div>
								</div>

								<div className={styles.colorItem}>
									<label htmlFor="email-color-link-text">Link</label>
									<div className={styles.colorInputGroup}>
										<input
											id="email-color-link"
											type="color"
											value={design.colors.link}
											onChange={(e) =>
												handleColorChange("link", e.target.value)
											}
											className={styles.colorPicker}
											aria-label="Link color"
										/>
										<Input
											id="email-color-link-text"
											type="text"
											value={design.colors.link}
											onChange={(e) =>
												handleColorChange("link", e.target.value)
											}
											placeholder="#2563EB"
										/>
									</div>
								</div>
							</div>
						</section>

						<Divider />

						{/* Typography Section */}
						<section className={styles.section}>
							<Text as="h4" size="md" weight="semibold">
								Typography
							</Text>
							<div className={styles.inputGrid}>
								<div>
									<label htmlFor="email-font-family">Font Family</label>
									<Input
										id="email-font-family"
										type="text"
										value={design.typography.fontFamily}
										onChange={(e) =>
											handleTypographyChange("fontFamily", e.target.value)
										}
										placeholder="Inter, sans-serif"
									/>
								</div>
								<div>
									<label htmlFor="email-font-size">Font Size (px)</label>
									<Input
										id="email-font-size"
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
								<div>
									<label htmlFor="email-heading-weight">Heading Weight</label>
									<Input
										id="email-heading-weight"
										type="number"
										value={design.typography.headingWeight.toString()}
										onChange={(e) =>
											handleTypographyChange(
												"headingWeight",
												parseInt(e.target.value) || 600,
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
							<Text as="h4" size="md" weight="semibold">
								Spacing
							</Text>
							<div className={styles.inputGrid}>
								<div>
									<label htmlFor="email-content-padding">
										Content Padding (px)
									</label>
									<Input
										id="email-content-padding"
										type="number"
										value={design.spacing.contentPadding.toString()}
										onChange={(e) =>
											handleSpacingChange(
												"contentPadding",
												parseInt(e.target.value) || 40,
											)
										}
										min={16}
										max={80}
									/>
								</div>
								<div>
									<label htmlFor="email-block-gap">Block Gap (px)</label>
									<Input
										id="email-block-gap"
										type="number"
										value={design.spacing.blockGap.toString()}
										onChange={(e) =>
											handleSpacingChange(
												"blockGap",
												parseInt(e.target.value) || 16,
											)
										}
										min={8}
										max={48}
									/>
								</div>
								<div>
									<label htmlFor="email-border-radius">
										Border Radius (px)
									</label>
									<Input
										id="email-border-radius"
										type="number"
										value={design.borderRadius.toString()}
										onChange={(e) =>
											handleBorderRadiusChange(parseInt(e.target.value) || 8)
										}
										min={0}
										max={32}
									/>
								</div>
							</div>
						</section>

						<Divider />

						{/* Footer Section */}
						<section className={styles.section}>
							<Text as="h4" size="md" weight="semibold">
								Footer
							</Text>
							<div className={styles.inputGrid}>
								<div>
									<label htmlFor="email-footer-text">Footer Text</label>
									<Input
										id="email-footer-text"
										type="text"
										value={design.footerText || ""}
										onChange={(e) => handleFooterTextChange(e.target.value)}
										placeholder="If you didn't request this email..."
									/>
								</div>
							</div>
						</section>
					</div>
				)}
			</div>
		);
	},
);

EmailStyleEditor.displayName = "EmailStyleEditor";
