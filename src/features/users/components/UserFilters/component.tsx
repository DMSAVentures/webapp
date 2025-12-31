/**
 * UserFilters Component
 * Horizontal filter bar for waitlist users
 */

import { RefreshCw } from "lucide-react";
import { memo, useCallback, useMemo, useState, useEffect } from "react";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Checkbox } from "@/proto-design-system/components/forms/Checkbox";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Label } from "@/proto-design-system/components/forms/Label";
import { MultiSelect } from "@/proto-design-system/components/composite/MultiSelect/MultiSelect";
import { Select } from "@/proto-design-system/components/forms/Select";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
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
	{ id: "pending", label: "Pending" },
	{ id: "verified", label: "Verified" },
	{ id: "invited", label: "Invited" },
	{ id: "active", label: "Active" },
	{ id: "rejected", label: "Rejected" },
];

const SOURCE_OPTIONS = [
	{ id: "organic", label: "Organic" },
	{ id: "referral", label: "Referral" },
	{ id: "twitter", label: "Twitter" },
	{ id: "facebook", label: "Facebook" },
	{ id: "linkedin", label: "LinkedIn" },
	{ id: "instagram", label: "Instagram" },
	{ id: "email", label: "Email" },
	{ id: "other", label: "Other" },
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

	// Convert filters to Set for MultiSelect
	const statusValue = useMemo(
		() => new Set(filters.status || []),
		[filters.status],
	);

	const sourceValue = useMemo(
		() => new Set(filters.source || []),
		[filters.source],
	);

	// Handle status change
	const handleStatusChange = useCallback(
		(selectedIds: Set<string>) => {
			const statusArray = Array.from(selectedIds) as WaitlistUserStatus[];
			onChange({
				...filters,
				status: statusArray.length > 0 ? statusArray : undefined,
			});
		},
		[filters, onChange],
	);

	// Handle source change
	const handleSourceChange = useCallback(
		(selectedIds: Set<string>) => {
			const sourceArray = Array.from(selectedIds);
			onChange({
				...filters,
				source: sourceArray.length > 0 ? sourceArray : undefined,
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
		<Stack direction="row" gap="md" wrap className={classNames}>
			{/* Status Filter */}
			<Stack gap="xs" className={styles.filterGroup}>
				<Label>Status</Label>
				<MultiSelect
					items={STATUS_OPTIONS}
					value={statusValue}
					onChange={handleStatusChange}
					placeholder="All Statuses"
				/>
			</Stack>

			{/* Source Filter */}
			<Stack gap="xs" className={styles.filterGroup}>
				<Label>Source</Label>
				<MultiSelect
					items={SOURCE_OPTIONS}
					value={sourceValue}
					onChange={handleSourceChange}
					placeholder="All Sources"
				/>
			</Stack>

			{/* Date Range Filter */}
			<Stack gap="xs" className={styles.filterGroup}>
				<Label>Date Range</Label>
				<Stack direction="row" gap="xs" align="center">
					<Input
						type="date"
						value={
							filters.dateRange?.start
								? filters.dateRange.start.toISOString().split("T")[0]
								: ""
						}
						onChange={(e) => handleDateChange("start", e.target.value)}
					/>
					<Text size="sm" color="muted">to</Text>
					<Input
						type="date"
						value={
							filters.dateRange?.end
								? filters.dateRange.end.toISOString().split("T")[0]
								: ""
						}
						onChange={(e) => handleDateChange("end", e.target.value)}
					/>
				</Stack>
			</Stack>

			{/* Position Range Filter */}
			<Stack gap="xs" className={styles.filterGroup}>
				<Label>Position</Label>
				<Stack direction="row" gap="xs" align="center">
					<Input
						type="number"
						placeholder="Min"
						min={1}
						value={filters.minPosition ?? ""}
						onChange={(e) => handlePositionChange("min", e.target.value)}
					/>
					<Text size="sm" color="muted">-</Text>
					<Input
						type="number"
						placeholder="Max"
						min={1}
						value={filters.maxPosition ?? ""}
						onChange={(e) => handlePositionChange("max", e.target.value)}
					/>
				</Stack>
			</Stack>

			{/* Has Referrals Filter */}
			<Stack gap="xs" className={styles.filterGroup}>
				<Label>Referrals</Label>
				<Stack direction="row" gap="sm" align="center">
					<Checkbox
						checked={filters.hasReferrals || false}
						onChange={handleReferralsToggle}
					/>
					<Text size="sm">Has referrals</Text>
				</Stack>
			</Stack>

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
						<Stack key={field.id} gap="xs" className={styles.filterGroup}>
							<Label>{field.label}</Label>
							<Select
								options={options}
								value={selectedValue}
								onChange={(e) =>
									handleCustomFieldSelect(field.name, e)
								}
								placeholder={`All ${field.label}`}
							/>
						</Stack>
					);
				}

				if (field.fieldType === "text") {
					return (
						<Stack key={field.id} gap="xs" className={styles.filterGroup}>
							<Label>{field.label}</Label>
							<DebouncedTextInput
								placeholder={`Filter by ${field.label.toLowerCase()}`}
								value={(fieldValue as string) || ""}
								onChange={(value) => handleCustomFieldText(field.name, value)}
							/>
						</Stack>
					);
				}

				return null;
			})}

			{/* Actions */}
			{hasActiveFilters && (
				<Button
					variant="secondary"
					size="sm"
					leftIcon={<RefreshCw size={16} />}
					onClick={onReset}
				>
					Reset filters
				</Button>
			)}
		</Stack>
	);
});

UserFilters.displayName = "UserFilters";
