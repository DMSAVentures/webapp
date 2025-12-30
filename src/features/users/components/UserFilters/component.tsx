/**
 * UserFilters Component
 * Horizontal filter bar for waitlist users
 */

import { memo, useCallback, useState, useEffect } from "react";
import {
	Button,
	Checkbox,
	Input,
	Label,
	Select,
} from "@/proto-design-system";
import type { FormField } from "@/types/campaign";
import type {
	UserFilters as UserFiltersType,
	WaitlistUserStatus,
} from "@/types/users.types";
import styles from "./component.module.scss";

export interface UserFiltersProps {
	/** Current filter values */
	filters: UserFiltersType;
	/** Filter change handler */
	onChange: (filters: UserFiltersType) => void;
	/** Reset handler */
	onReset: () => void;
	/** Custom form fields for dynamic filters */
	formFields?: FormField[];
	/** Additional CSS class name */
	className?: string;
}

const STATUS_OPTIONS = [
	{ value: "pending", label: "Pending" },
	{ value: "verified", label: "Verified" },
	{ value: "invited", label: "Invited" },
	{ value: "active", label: "Active" },
	{ value: "rejected", label: "Rejected" },
];

const SOURCE_OPTIONS = [
	{ value: "organic", label: "Organic" },
	{ value: "referral", label: "Referral" },
	{ value: "twitter", label: "Twitter" },
	{ value: "facebook", label: "Facebook" },
	{ value: "linkedin", label: "LinkedIn" },
	{ value: "instagram", label: "Instagram" },
	{ value: "email", label: "Email" },
	{ value: "other", label: "Other" },
];

/** Debounced text input component for filter fields */
interface DebouncedTextInputProps {
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	debounceMs?: number;
}

function DebouncedTextInput({
	placeholder,
	value,
	onChange,
	debounceMs = 300,
}: DebouncedTextInputProps) {
	const [localValue, setLocalValue] = useState(value);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (localValue !== value) {
				onChange(localValue);
			}
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [localValue, value, onChange, debounceMs]);

	return (
		<Input
			placeholder={placeholder}
			value={localValue}
			onChange={(e) => setLocalValue(e.target.value)}
		/>
	);
}

/**
 * UserFilters displays a horizontal filter bar for waitlist users
 */
export const UserFilters = memo<UserFiltersProps>(function UserFilters({
	filters,
	onChange,
	onReset,
	formFields,
	className: customClassName,
}) {
	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Check if any filters are active
	const hasActiveFilters =
		(filters.status && filters.status.length > 0) ||
		(filters.source && filters.source.length > 0) ||
		filters.hasReferrals ||
		filters.minPosition !== undefined ||
		filters.maxPosition !== undefined ||
		filters.dateRange !== undefined ||
		(filters.customFields && Object.keys(filters.customFields).length > 0);

	// Get filterable custom fields (select, radio types have predefined options)
	const filterableFields =
		formFields?.filter(
			(field) =>
				field.fieldType === "select" ||
				field.fieldType === "radio" ||
				field.fieldType === "text",
		) || [];

	// Handle status change
	const handleStatusChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const value = e.target.value;
			onChange({
				...filters,
				status: value ? ([value] as WaitlistUserStatus[]) : undefined,
			});
		},
		[filters, onChange],
	);

	// Handle source change
	const handleSourceChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const value = e.target.value;
			onChange({
				...filters,
				source: value ? [value] : undefined,
			});
		},
		[filters, onChange],
	);

	// Handle date range change
	const handleDateChange = (field: "start" | "end", value: string) => {
		const dateValue = value ? new Date(value) : undefined;

		if (!dateValue) {
			// If clearing a date, check if we should remove the whole range
			if (field === "start" && !filters.dateRange?.end) {
				onChange({ ...filters, dateRange: undefined });
			} else if (field === "end" && !filters.dateRange?.start) {
				onChange({ ...filters, dateRange: undefined });
			} else if (field === "start") {
				onChange({
					...filters,
					dateRange: filters.dateRange?.end
						? { start: new Date(0), end: filters.dateRange.end }
						: undefined,
				});
			} else {
				onChange({
					...filters,
					dateRange: filters.dateRange?.start
						? { start: filters.dateRange.start, end: new Date() }
						: undefined,
				});
			}
			return;
		}

		onChange({
			...filters,
			dateRange: {
				start:
					field === "start"
						? dateValue
						: filters.dateRange?.start || new Date(0),
				end: field === "end" ? dateValue : filters.dateRange?.end || new Date(),
			},
		});
	};

	// Handle position change
	const handlePositionChange = (field: "min" | "max", value: string) => {
		const numValue = value ? parseInt(value, 10) : undefined;
		onChange({
			...filters,
			[field === "min" ? "minPosition" : "maxPosition"]: numValue,
		});
	};

	// Handle has referrals toggle
	const handleReferralsToggle = () => {
		onChange({
			...filters,
			hasReferrals: !filters.hasReferrals || undefined,
		});
	};

	// Handle custom field change (for select/radio fields)
	const handleCustomFieldSelect = useCallback(
		(fieldId: string, e: React.ChangeEvent<HTMLSelectElement>) => {
			const value = e.target.value;
			const currentCustomFields = filters.customFields || {};
			if (value) {
				onChange({
					...filters,
					customFields: {
						...currentCustomFields,
						[fieldId]: value,
					},
				});
			} else {
				const { [fieldId]: _, ...rest } = currentCustomFields;
				onChange({
					...filters,
					customFields: Object.keys(rest).length > 0 ? rest : undefined,
				});
			}
		},
		[filters, onChange],
	);

	// Handle custom field text input (debouncing handled by DebouncedTextInput)
	const handleCustomFieldText = useCallback(
		(fieldName: string, value: string) => {
			const currentCustomFields = filters.customFields || {};
			if (value) {
				onChange({
					...filters,
					customFields: {
						...currentCustomFields,
						[fieldName]: value,
					},
				});
			} else {
				const { [fieldName]: _, ...rest } = currentCustomFields;
				onChange({
					...filters,
					customFields: Object.keys(rest).length > 0 ? rest : undefined,
				});
			}
		},
		[filters, onChange],
	);

	return (
		<div className={classNames}>
			{/* Status Filter */}
			<div className={styles.filterGroup}>
				<Label>Status</Label>
				<Select
					options={STATUS_OPTIONS}
					value={filters.status?.[0] || ""}
					onChange={handleStatusChange}
					placeholder="All Statuses"
				/>
			</div>

			{/* Source Filter */}
			<div className={styles.filterGroup}>
				<Label>Source</Label>
				<Select
					options={SOURCE_OPTIONS}
					value={filters.source?.[0] || ""}
					onChange={handleSourceChange}
					placeholder="All Sources"
				/>
			</div>

			{/* Date Range Filter */}
			<div className={styles.filterGroup}>
				<Label>Date Range</Label>
				<div className={styles.inputRow}>
					<Input
						type="date"
						value={
							filters.dateRange?.start
								? filters.dateRange.start.toISOString().split("T")[0]
								: ""
						}
						onChange={(e) => handleDateChange("start", e.target.value)}
					/>
					<span className={styles.separator}>to</span>
					<Input
						type="date"
						value={
							filters.dateRange?.end
								? filters.dateRange.end.toISOString().split("T")[0]
								: ""
						}
						onChange={(e) => handleDateChange("end", e.target.value)}
					/>
				</div>
			</div>

			{/* Position Range Filter */}
			<div className={styles.filterGroup}>
				<Label>Position</Label>
				<div className={styles.inputRow}>
					<Input
						type="number"
						placeholder="Min"
						min={1}
						value={filters.minPosition ?? ""}
						onChange={(e) => handlePositionChange("min", e.target.value)}
					/>
					<span className={styles.separator}>-</span>
					<Input
						type="number"
						placeholder="Max"
						min={1}
						value={filters.maxPosition ?? ""}
						onChange={(e) => handlePositionChange("max", e.target.value)}
					/>
				</div>
			</div>

			{/* Has Referrals Filter */}
			<div className={styles.filterGroup}>
				<Label>Referrals</Label>
				<div className={styles.checkboxWrapper}>
					<Checkbox
						checked={filters.hasReferrals || false}
						onChange={handleReferralsToggle}
					/>
					<span className={styles.checkboxLabel}>Has referrals</span>
				</div>
			</div>

			{/* Custom Form Field Filters */}
			{filterableFields.map((field) => {
				// Use field.name as key since that's how data is stored in metadata
				const fieldValue = filters.customFields?.[field.name];
				const selectedValue = Array.isArray(fieldValue)
					? fieldValue[0]
					: fieldValue || "";

				if (field.fieldType === "select" || field.fieldType === "radio") {
					const options =
						field.options?.map((opt) => ({
							value: opt,
							label: opt,
						})) || [];

					return (
						<div key={field.id} className={styles.filterGroup}>
							<Label>{field.label}</Label>
							<Select
								options={options}
								value={selectedValue}
								onChange={(e) =>
									handleCustomFieldSelect(field.name, e)
								}
								placeholder={`All ${field.label}`}
							/>
						</div>
					);
				}

				if (field.fieldType === "text") {
					return (
						<div key={field.id} className={styles.filterGroup}>
							<Label>{field.label}</Label>
							<DebouncedTextInput
								placeholder={`Filter by ${field.label.toLowerCase()}`}
								value={(fieldValue as string) || ""}
								onChange={(value) => handleCustomFieldText(field.name, value)}
							/>
						</div>
					);
				}

				return null;
			})}

			{/* Actions */}
			<div className={styles.actions}>
				{hasActiveFilters && (
					<Button
						variant="secondary"
						size="sm"
						leftIcon="ri-refresh-line"
						onClick={onReset}
					>
						Reset filters
					</Button>
				)}
			</div>
		</div>
	);
});

UserFilters.displayName = "UserFilters";
