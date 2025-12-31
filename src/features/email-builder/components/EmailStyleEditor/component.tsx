/**
 * EmailStyleEditor Component
 * Edit email design settings (colors, typography, spacing)
 */

import { Grid2x2, Palette } from "lucide-react";
import { type HTMLAttributes, memo, useCallback, useState } from "react";
import { FormField } from "@/proto-design-system/components/forms/FormField";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Card } from "@/proto-design-system/components/layout/Card";
import { Divider } from "@/proto-design-system/components/layout/Divider";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import {
	Button,
	ButtonGroup,
} from "@/proto-design-system/components/primitives/Button";
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
				<div className={styles.modeToggle}>
					<ButtonGroup isAttached isFullWidth>
						<Button
							variant={mode === "templates" ? "primary" : "secondary"}
							size="sm"
							leftIcon={<Grid2x2 size={16} />}
							onClick={() => setMode("templates")}
							aria-pressed={mode === "templates"}
						>
							Templates
						</Button>
						<Button
							variant={mode === "custom" ? "primary" : "secondary"}
							size="sm"
							leftIcon={<Palette size={16} />}
							onClick={() => setMode("custom")}
							aria-pressed={mode === "custom"}
						>
							Custom
						</Button>
					</ButtonGroup>
				</div>

				{mode === "templates" ? (
					<Stack gap="sm" className={styles.content}>
						{EMAIL_DESIGN_TEMPLATES.map((template) => (
							<Card
								key={template.id}
								variant="outlined"
								padding="sm"
								interactive
								onClick={() => handleTemplateSelect(template.id)}
								className={
									selectedTemplateId === template.id
										? styles.templateSelected
										: undefined
								}
							>
								<Stack gap="sm">
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
									<Stack gap="0">
										<Text size="sm" weight="medium">
											{template.name}
										</Text>
										<Text size="xs" color="muted">
											{template.description}
										</Text>
									</Stack>
								</Stack>
							</Card>
						))}
					</Stack>
				) : (
					<Stack gap="lg" className={styles.content}>
						{/* Colors Section */}
						<Stack gap="md">
							<Text as="h4" size="md" weight="semibold">
								Colors
							</Text>
							<Stack gap="md">
								<FormField label="Primary">
									<Stack direction="row" gap="sm" align="center">
										<input
											id="email-color-primary"
											type="color"
											value={design.colors.primary}
											onChange={(e) =>
												handleColorChange("primary", e.target.value)
											}
											className={styles.colorPicker}
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
									</Stack>
								</FormField>

								<FormField label="Background">
									<Stack direction="row" gap="sm" align="center">
										<input
											id="email-color-background"
											type="color"
											value={design.colors.background}
											onChange={(e) =>
												handleColorChange("background", e.target.value)
											}
											className={styles.colorPicker}
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
									</Stack>
								</FormField>

								<FormField label="Content Background">
									<Stack direction="row" gap="sm" align="center">
										<input
											id="email-color-content-background"
											type="color"
											value={design.colors.contentBackground}
											onChange={(e) =>
												handleColorChange("contentBackground", e.target.value)
											}
											className={styles.colorPicker}
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
									</Stack>
								</FormField>

								<FormField label="Text">
									<Stack direction="row" gap="sm" align="center">
										<input
											id="email-color-text"
											type="color"
											value={design.colors.text}
											onChange={(e) =>
												handleColorChange("text", e.target.value)
											}
											className={styles.colorPicker}
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
									</Stack>
								</FormField>

								<FormField label="Secondary Text">
									<Stack direction="row" gap="sm" align="center">
										<input
											id="email-color-secondary-text"
											type="color"
											value={design.colors.secondaryText}
											onChange={(e) =>
												handleColorChange("secondaryText", e.target.value)
											}
											className={styles.colorPicker}
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
									</Stack>
								</FormField>

								<FormField label="Link">
									<Stack direction="row" gap="sm" align="center">
										<input
											id="email-color-link"
											type="color"
											value={design.colors.link}
											onChange={(e) =>
												handleColorChange("link", e.target.value)
											}
											className={styles.colorPicker}
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
									</Stack>
								</FormField>
							</Stack>
						</Stack>

						<Divider />

						{/* Typography Section */}
						<Stack gap="md">
							<Text as="h4" size="md" weight="semibold">
								Typography
							</Text>
							<Stack gap="md">
								<FormField label="Font Family">
									<Input
										id="email-font-family"
										type="text"
										value={design.typography.fontFamily}
										onChange={(e) =>
											handleTypographyChange("fontFamily", e.target.value)
										}
										placeholder="Inter, sans-serif"
									/>
								</FormField>
								<FormField label="Font Size (px)">
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
								</FormField>
								<FormField label="Heading Weight">
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
								</FormField>
							</Stack>
						</Stack>

						<Divider />

						{/* Spacing Section */}
						<Stack gap="md">
							<Text as="h4" size="md" weight="semibold">
								Spacing
							</Text>
							<Stack gap="md">
								<FormField label="Content Padding (px)">
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
								</FormField>
								<FormField label="Block Gap (px)">
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
								</FormField>
								<FormField label="Border Radius (px)">
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
								</FormField>
							</Stack>
						</Stack>

						<Divider />

						{/* Footer Section */}
						<Stack gap="md">
							<Text as="h4" size="md" weight="semibold">
								Footer
							</Text>
							<FormField label="Footer Text">
								<Input
									id="email-footer-text"
									type="text"
									value={design.footerText || ""}
									onChange={(e) => handleFooterTextChange(e.target.value)}
									placeholder="If you didn't request this email..."
								/>
							</FormField>
						</Stack>
					</Stack>
				)}
			</div>
		);
	},
);

EmailStyleEditor.displayName = "EmailStyleEditor";
