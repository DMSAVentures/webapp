/**
 * TemplateSelector Component
 * Displays a grid of pre-built form design templates for quick selection
 */

import { Check } from "lucide-react";
import { type HTMLAttributes, memo, useCallback } from "react";
import { Icon, Stack, Text } from "@/proto-design-system";
import type { FormDesign } from "@/types/common.types";
import {
	FORM_DESIGN_TEMPLATES,
	type FormDesignTemplate,
} from "../../constants";
import styles from "./component.module.scss";

export interface TemplateSelectorProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSelect"> {
	/** Currently selected template ID */
	selectedTemplateId?: string;
	/** Callback when a template is selected */
	onTemplateSelect: (design: FormDesign, templateId: string) => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Mini form preview component that shows how the template looks
 */
const TemplatePreview = memo<{ design: FormDesign }>(function TemplatePreview({
	design,
}) {
	const inputRadius = Math.min(design.borderRadius, 8);
	const buttonRadius = Math.min(design.borderRadius, 12);
	const formRadius = Math.min(design.borderRadius, 16);
	const isButtonLight = isLightColor(design.colors.primary);

	return (
		<div
			className={styles.preview}
			style={{
				backgroundColor: design.colors.background,
				borderRadius: `${formRadius}px`,
				padding: `${Math.min(design.spacing.padding, 14)}px`,
				gap: `${Math.min(design.spacing.gap, 10)}px`,
			}}
		>
			{/* Label preview */}
			<div
				className={styles.previewLabel}
				style={{
					backgroundColor: design.colors.text,
					opacity: 0.8,
				}}
			/>

			{/* Input field preview */}
			<div
				className={styles.previewInput}
				style={{
					borderColor: design.colors.border,
					borderRadius: `${inputRadius}px`,
					borderWidth: design.borderRadius <= 4 ? "1px" : "1.5px",
					backgroundColor: design.colors.background,
				}}
			>
				<div
					className={styles.previewPlaceholder}
					style={{ backgroundColor: design.colors.text, opacity: 0.25 }}
				/>
			</div>

			{/* Second input to show form depth */}
			<div
				className={styles.previewInput}
				style={{
					borderColor: design.colors.border,
					borderRadius: `${inputRadius}px`,
					borderWidth: design.borderRadius <= 4 ? "1px" : "1.5px",
					backgroundColor: design.colors.background,
				}}
			>
				<div
					className={styles.previewPlaceholder}
					style={{
						backgroundColor: design.colors.text,
						opacity: 0.25,
						width: "40%",
					}}
				/>
			</div>

			{/* Button preview */}
			<div
				className={styles.previewButton}
				style={{
					backgroundColor: design.colors.primary,
					borderRadius: `${buttonRadius}px`,
					boxShadow:
						design.borderRadius >= 16
							? `0 2px 4px ${design.colors.primary}40`
							: "none",
				}}
			>
				<div
					className={styles.previewButtonText}
					style={{
						backgroundColor: isButtonLight
							? "rgba(0,0,0,0.25)"
							: "rgba(255,255,255,0.6)",
					}}
				/>
			</div>
		</div>
	);
});

/**
 * Helper to determine if a color is light
 */
function isLightColor(hexColor: string): boolean {
	const hex = hexColor.replace("#", "");
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5;
}

/**
 * TemplateSelector displays a grid of form design templates
 */
export const TemplateSelector = memo<TemplateSelectorProps>(
	function TemplateSelector({
		selectedTemplateId,
		onTemplateSelect,
		className: customClassName,
		...props
	}) {
		const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

		const handleSelect = useCallback(
			(template: FormDesignTemplate) => {
				onTemplateSelect({ ...template.design }, template.id);
			},
			[onTemplateSelect],
		);

		return (
			<div className={classNames} {...props}>
				<Stack gap="xs" className={styles.header}>
					<Text as="h4" size="md" weight="semibold">Design Templates</Text>
					<Text size="sm" color="muted">
						Choose a starting point for your form
					</Text>
				</Stack>

				<div className={styles.grid}>
					{FORM_DESIGN_TEMPLATES.map((template) => {
						const isSelected = selectedTemplateId === template.id;
						const cardClasses = [
							styles.card,
							isSelected && styles.selected,
							template.preview.isDark && styles.dark,
						]
							.filter(Boolean)
							.join(" ");

						return (
							<button
								key={template.id}
								type="button"
								className={cardClasses}
								onClick={() => handleSelect(template)}
								aria-pressed={isSelected}
								aria-label={`Select ${template.name} template`}
							>
								<div
									className={styles.previewWrapper}
									style={{
										backgroundColor: template.preview.isDark
											? "#1a1a1a"
											: "#f5f5f5",
									}}
								>
									<TemplatePreview design={template.design} />

									{/* Color accent indicator */}
									<div
										className={styles.accentBar}
										style={{ backgroundColor: template.preview.accentColor }}
									/>
								</div>

								<Stack gap="0" className={styles.cardContent}>
									<Text size="sm" weight="medium">{template.name}</Text>
									<Text size="xs" color="muted">
										{template.description}
									</Text>
								</Stack>

								{isSelected && (
									<div className={styles.selectedBadge}>
										<Icon icon={Check} size="sm" />
									</div>
								)}
							</button>
						);
					})}
				</div>
			</div>
		);
	},
);

TemplateSelector.displayName = "TemplateSelector";
