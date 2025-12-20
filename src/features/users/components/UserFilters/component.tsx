/**
 * UserFilters Component
 * Horizontal filter bar for waitlist users
 */

import { memo, useCallback } from "react";
import { Button } from "@/proto-design-system/Button/button";
import CheckboxWithLabel from "@/proto-design-system/checkbox/checkboxWithLabel";
import { SelectDropdown } from "@/proto-design-system/SelectDropdown/selectDropdown";
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

/**
 * UserFilters displays a horizontal filter bar for waitlist users
 */
export const UserFilters = memo<UserFiltersProps>(function UserFilters({
	filters,
	onChange,
	onReset,
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
		filters.dateRange !== undefined;

	// Handle status change
	const handleStatusChange = useCallback(
		(selected: string[]) => {
			onChange({
				...filters,
				status:
					selected.length > 0 ? (selected as WaitlistUserStatus[]) : undefined,
			});
		},
		[filters, onChange],
	);

	// Handle source change
	const handleSourceChange = useCallback(
		(selected: string[]) => {
			onChange({
				...filters,
				source: selected.length > 0 ? selected : undefined,
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

	return (
		<div className={classNames}>
			{/* Status Filter */}
			<div className={styles.filterGroup}>
				<label className={styles.filterLabel}>Status</label>
				<SelectDropdown
					mode="multi"
					options={STATUS_OPTIONS}
					value={filters.status || []}
					onChange={handleStatusChange}
					placeholder="All Statuses"
				/>
			</div>

			{/* Source Filter */}
			<div className={styles.filterGroup}>
				<label className={styles.filterLabel}>Source</label>
				<SelectDropdown
					mode="multi"
					options={SOURCE_OPTIONS}
					value={filters.source || []}
					onChange={handleSourceChange}
					placeholder="All Sources"
				/>
			</div>

			{/* Date Range Filter */}
			<div className={styles.filterGroup}>
				<label className={styles.filterLabel}>Date Range</label>
				<div className={styles.dateInputs}>
					<input
						type="date"
						className={styles.dateInput}
						value={
							filters.dateRange?.start
								? filters.dateRange.start.toISOString().split("T")[0]
								: ""
						}
						onChange={(e) => handleDateChange("start", e.target.value)}
					/>
					<span className={styles.dateSeparator}>to</span>
					<input
						type="date"
						className={styles.dateInput}
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
				<label className={styles.filterLabel}>Position</label>
				<div className={styles.positionInputs}>
					<input
						type="number"
						className={styles.positionInput}
						placeholder="Min"
						min={1}
						value={filters.minPosition ?? ""}
						onChange={(e) => handlePositionChange("min", e.target.value)}
					/>
					<span className={styles.dateSeparator}>-</span>
					<input
						type="number"
						className={styles.positionInput}
						placeholder="Max"
						min={1}
						value={filters.maxPosition ?? ""}
						onChange={(e) => handlePositionChange("max", e.target.value)}
					/>
				</div>
			</div>

			{/* Has Referrals Filter */}
			<div className={styles.filterGroup}>
				<label className={styles.filterLabel}>Referrals</label>
				<div className={styles.checkboxFilter}>
					<CheckboxWithLabel
						checked={filters.hasReferrals ? "checked" : "unchecked"}
						onChange={handleReferralsToggle}
						text="Has referrals"
						description=""
						flipCheckboxToRight={false}
					/>
				</div>
			</div>

			{/* Actions */}
			<div className={styles.actions}>
				{hasActiveFilters && (
					<Button
						variant="secondary"
						size="small"
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
