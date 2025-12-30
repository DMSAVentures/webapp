/**
 * RewardBuilder Component
 * Form for creating or editing campaign rewards
 */

import { type FormEvent, type HTMLAttributes, memo, useState } from "react";
import { Button, Divider, Dropdown, TextArea, Input } from "@/proto-design-system";
import type { Reward } from "@/types/common.types";
import {
	validateDate,
	validateLength,
	validateNumber,
	validateRequired,
} from "@/utils/validation";
import styles from "./component.module.scss";

export interface CreateRewardRequest {
	name: string;
	description: string;
	type: Reward["type"];
	value?: string;
	tier: number;
	triggerType: Reward["triggerType"];
	triggerValue?: number;
	inventory?: number;
	expiryDate?: Date;
	deliveryMethod: Reward["deliveryMethod"];
}

export interface RewardBuilderProps
	extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
	/** Campaign ID this reward belongs to */
	campaignId: string;
	/** Initial reward data for editing */
	initialData?: Partial<Reward>;
	/** Submit handler */
	onSubmit: (data: CreateRewardRequest) => Promise<void> | void;
	/** Cancel handler */
	onCancel?: () => void;
	/** Loading state */
	loading?: boolean;
	/** Submit button text */
	submitText?: string;
	/** Additional CSS class name */
	className?: string;
}

interface FormErrors {
	name?: string;
	description?: string;
	value?: string;
	tier?: string;
	triggerValue?: string;
	inventory?: string;
	expiryDate?: string;
}

/**
 * RewardBuilder for creating/editing rewards
 */
export const RewardBuilder = memo<RewardBuilderProps>(function RewardBuilder({
	campaignId,
	initialData,
	onSubmit,
	onCancel,
	loading = false,
	submitText = "Create Reward",
	className: customClassName,
	...props
}) {
	// Form state
	const [formData, setFormData] = useState<CreateRewardRequest>({
		name: initialData?.name || "",
		description: initialData?.description || "",
		type: initialData?.type || "early_access",
		value: initialData?.value || "",
		tier: initialData?.tier || 1,
		triggerType: initialData?.triggerType || "referral_count",
		triggerValue: initialData?.triggerValue,
		inventory: initialData?.inventory,
		expiryDate: initialData?.expiryDate,
		deliveryMethod: initialData?.deliveryMethod || "email",
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	// Validation
	const validateField = (
		name: keyof FormErrors,
		value: string | number | Date | undefined,
	): string | null => {
		switch (name) {
			case "name":
				return (
					validateRequired(value, "Reward name") ||
					validateLength(value as string, {
						min: 3,
						max: 100,
						fieldName: "Reward name",
					})
				);
			case "description":
				return (
					validateRequired(value, "Description") ||
					validateLength(value as string, {
						min: 10,
						max: 500,
						fieldName: "Description",
					})
				);
			case "value":
				if (value) {
					return validateLength(value as string, {
						max: 100,
						fieldName: "Reward value",
					});
				}
				return null;
			case "tier":
				return (
					validateRequired(value, "Tier") ||
					validateNumber(value as number, {
						min: 1,
						max: 10,
						fieldName: "Tier",
					})
				);
			case "triggerValue":
				if (formData.triggerType !== "manual" && !value) {
					return "Trigger value is required for this trigger type";
				}
				if (value) {
					return validateNumber(value as number, {
						min: 1,
						fieldName: "Trigger value",
					});
				}
				return null;
			case "inventory":
				if (value) {
					return validateNumber(value as number, {
						min: 1,
						fieldName: "Inventory",
					});
				}
				return null;
			case "expiryDate":
				if (value) {
					return validateDate(value as Date, {
						minDate: new Date(),
						fieldName: "Expiry date",
					});
				}
				return null;
			default:
				return null;
		}
	};

	const handleBlur = (field: keyof FormErrors) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
		const value = formData[field as keyof CreateRewardRequest];
		const error = validateField(field, value);
		setErrors((prev) => ({ ...prev, [field]: error || undefined }));
	};

	const handleChange = (
		field: keyof CreateRewardRequest,
		value: string | number | Date | undefined,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (touched[field]) {
			const error = validateField(field as keyof FormErrors, value);
			setErrors((prev) => ({ ...prev, [field]: error || undefined }));
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		// Validate all fields
		const nameError = validateField("name", formData.name);
		const descriptionError = validateField("description", formData.description);
		const tierError = validateField("tier", formData.tier);
		const triggerValueError = validateField(
			"triggerValue",
			formData.triggerValue,
		);

		if (nameError || descriptionError || tierError || triggerValueError) {
			setErrors({
				name: nameError || undefined,
				description: descriptionError || undefined,
				tier: tierError || undefined,
				triggerValue: triggerValueError || undefined,
			});
			setTouched({
				name: true,
				description: true,
				tier: true,
				triggerValue: true,
			});
			return;
		}

		await onSubmit(formData);
	};

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	return (
		<form className={classNames} onSubmit={handleSubmit} {...props}>
			{/* Reward Name */}
			<div className={styles.fieldGroup}>
				<label htmlFor="reward-name" className={styles.label}>Reward Name</label>
				<Input
					id="reward-name"
					type="text"
					value={formData.name}
					onChange={(e) => handleChange("name", e.target.value)}
					onBlur={() => handleBlur("name")}
					placeholder="e.g., VIP Early Access"
					disabled={loading}
					required
					isError={!!(touched.name && errors.name)}
				/>
			</div>

			{/* Description */}
			<div className={styles.fieldGroup}>
				<label htmlFor="reward-description" className={styles.label}>Description</label>
				<TextArea
					id="reward-description"
					value={formData.description}
					onChange={(e) => handleChange("description", e.target.value)}
					onBlur={() => handleBlur("description")}
					placeholder="Describe what users will receive..."
					rows={4}
					disabled={loading}
					maxLength={500}
					required
					isError={!!(touched.description && errors.description)}
				/>
			</div>

			{/* Reward Type */}
			<div className={styles.fieldGroup}>
				<label className={styles.label}>Reward Type</label>
				<Dropdown
					placeholder="Select reward type"
					items={[
						{ id: "early_access", label: "Early Access" },
						{ id: "discount", label: "Discount" },
						{ id: "premium_feature", label: "Premium Feature" },
						{ id: "merchandise", label: "Merchandise" },
						{ id: "custom", label: "Custom" },
					]}
					disabled={loading}
					onChange={(id) =>
						handleChange("type", id as Reward["type"])
					}
				/>
			</div>

			{/* Reward Value */}
			<div className={styles.fieldGroup}>
				<label htmlFor="reward-value" className={styles.label}>Reward Value</label>
				<Input
					id="reward-value"
					type="text"
					value={formData.value || ""}
					onChange={(e) => handleChange("value", e.target.value)}
					onBlur={() => handleBlur("value")}
					placeholder='e.g., "20% off", "Free for 6 months"'
					disabled={loading}
					isError={!!(touched.value && errors.value)}
				/>
			</div>

			{/* Tier */}
			<div className={styles.fieldGroup}>
				<label htmlFor="reward-tier" className={styles.label}>Reward Tier</label>
				<Input
					id="reward-tier"
					type="number"
					value={formData.tier.toString()}
					onChange={(e) => handleChange("tier", parseInt(e.target.value) || 1)}
					onBlur={() => handleBlur("tier")}
					placeholder="1"
					disabled={loading}
					required
					min={1}
					max={10}
					isError={!!(touched.tier && errors.tier)}
				/>
			</div>

			{/* Divider */}
			<Divider />

			{/* Trigger Section */}
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Unlock Requirements</h3>

				{/* Trigger Type */}
				<div className={styles.fieldGroup}>
					<label className={styles.label}>Trigger Type</label>
					<Dropdown
						placeholder="Select trigger type"
						items={[
							{ id: "referral_count", label: "Referral Count" },
							{ id: "position", label: "Waitlist Position" },
							{ id: "manual", label: "Manual" },
						]}
						disabled={loading}
						onChange={(id) =>
							handleChange("triggerType", id as Reward["triggerType"])
						}
					/>
				</div>

				{/* Trigger Value (conditional) */}
				{formData.triggerType !== "manual" && (
					<div className={styles.fieldGroup}>
						<label htmlFor="reward-trigger-value" className={styles.label}>
							{formData.triggerType === "referral_count"
								? "Number of Referrals"
								: "Position Threshold"}
						</label>
						<Input
							id="reward-trigger-value"
							type="number"
							value={formData.triggerValue?.toString() || ""}
							onChange={(e) =>
								handleChange(
									"triggerValue",
									parseInt(e.target.value) || undefined,
								)
							}
							onBlur={() => handleBlur("triggerValue")}
							placeholder={
								formData.triggerType === "referral_count"
									? "e.g., 5"
									: "e.g., 100"
							}
							disabled={loading}
							required
							min={1}
							isError={!!(touched.triggerValue && errors.triggerValue)}
						/>
					</div>
				)}
			</div>

			{/* Divider */}
			<Divider />

			{/* Delivery Settings */}
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Delivery Settings</h3>

				{/* Delivery Method */}
				<div className={styles.fieldGroup}>
					<label className={styles.label}>Delivery Method</label>
					<Dropdown
						placeholder="Select delivery method"
						items={[
							{ id: "email", label: "Email" },
							{ id: "dashboard", label: "Dashboard" },
							{ id: "api_webhook", label: "API/Webhook" },
						]}
						disabled={loading}
						onChange={(id) =>
							handleChange(
								"deliveryMethod",
								id as Reward["deliveryMethod"],
							)
						}
					/>
				</div>

				{/* Inventory (optional) */}
				<div className={styles.fieldGroup}>
					<label htmlFor="reward-inventory" className={styles.label}>Inventory Limit</label>
					<Input
						id="reward-inventory"
						type="number"
						value={formData.inventory?.toString() || ""}
						onChange={(e) =>
							handleChange(
								"inventory",
								e.target.value ? parseInt(e.target.value) : undefined,
							)
						}
						onBlur={() => handleBlur("inventory")}
						placeholder="Unlimited"
						disabled={loading}
						min={1}
						isError={!!(touched.inventory && errors.inventory)}
					/>
				</div>

				{/* Expiry Date (optional) */}
				<div className={styles.fieldGroup}>
					<label htmlFor="reward-expiry" className={styles.label}>Expiry Date</label>
					<Input
						id="reward-expiry"
						type="date"
						value={
							formData.expiryDate
								? new Date(formData.expiryDate).toISOString().split("T")[0]
								: ""
						}
						onChange={(e) =>
							handleChange(
								"expiryDate",
								e.target.value ? new Date(e.target.value) : undefined,
							)
						}
						onBlur={() => handleBlur("expiryDate")}
						disabled={loading}
						isError={!!(touched.expiryDate && errors.expiryDate)}
					/>
				</div>
			</div>

			{/* Divider */}
			<Divider />

			{/* Preview Card */}
			<div className={styles.preview}>
				<h3 className={styles.previewTitle}>Preview</h3>
				<div className={styles.previewCard}>
					<div className={styles.previewHeader}>
						<div className={styles.previewTier}>Tier {formData.tier}</div>
						<div className={styles.previewType}>
							{formData.type.replace("_", " ")}
						</div>
					</div>
					<h4 className={styles.previewName}>
						{formData.name || "Reward Name"}
					</h4>
					<p className={styles.previewDescription}>
						{formData.description || "Reward description will appear here..."}
					</p>
					{formData.value && (
						<div className={styles.previewValue}>
							<i className="ri-gift-line" aria-hidden="true" />
							{formData.value}
						</div>
					)}
					{formData.triggerType !== "manual" && formData.triggerValue && (
						<div className={styles.previewRequirement}>
							<i className="ri-checkbox-circle-line" aria-hidden="true" />
							{formData.triggerType === "referral_count"
								? `Refer ${formData.triggerValue} ${formData.triggerValue === 1 ? "person" : "people"}`
								: `Top ${formData.triggerValue} on waitlist`}
						</div>
					)}
				</div>
			</div>

			{/* Divider */}
			<Divider />

			{/* Form Actions */}
			<div className={styles.actions}>
				{onCancel && (
					<Button
						type="button"
						onClick={onCancel}
						disabled={loading}
						variant="secondary"
					>
						Cancel
					</Button>
				)}
				<Button
					type="submit"
					disabled={loading}
					variant="primary"
					leftIcon={loading ? "ri-loader-4-line ri-spin" : "ri-check-line"}
				>
					{loading ? "Saving..." : submitText}
				</Button>
			</div>
		</form>
	);
});

RewardBuilder.displayName = "RewardBuilder";
