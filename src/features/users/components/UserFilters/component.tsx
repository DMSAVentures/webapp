/**
 * UserFilters Component
 * Filter panel for waitlist users
 */

import { memo, useState } from "react";
import { Button } from "@/proto-design-system/Button/button";
import CheckboxWithLabel from "@/proto-design-system/checkbox/checkboxWithLabel";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
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

const STATUS_OPTIONS: Array<{ value: WaitlistUserStatus; label: string }> = [
	{ value: "pending", label: "Pending" },
	{ value: "verified", label: "Verified" },
	{ value: "invited", label: "Invited" },
	{ value: "active", label: "Active" },
	{ value: "rejected", label: "Rejected" },
];

const SOURCE_OPTIONS = [
	"organic",
	"referral",
	"twitter",
	"facebook",
	"linkedin",
	"instagram",
	"email",
	"other",
];

/**
 * UserFilters displays a filter panel for waitlist users
 */
export const UserFilters = memo<UserFiltersProps>(function UserFilters({
	filters,
	onChange,
	onReset,
	className: customClassName,
	...props
}) {
	const [localFilters, setLocalFilters] = useState<UserFiltersType>(filters);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Handle status toggle
	const handleStatusToggle = (status: WaitlistUserStatus) => {
		const currentStatuses = localFilters.status || [];
		const newStatuses = currentStatuses.includes(status)
			? currentStatuses.filter((s) => s !== status)
			: [...currentStatuses, status];

		setLocalFilters({
			...localFilters,
			status: newStatuses.length > 0 ? newStatuses : undefined,
		});
	};

	// Handle source toggle
	const handleSourceToggle = (source: string) => {
		const currentSources = localFilters.source || [];
		const newSources = currentSources.includes(source)
			? currentSources.filter((s) => s !== source)
			: [...currentSources, source];

		setLocalFilters({
			...localFilters,
			source: newSources.length > 0 ? newSources : undefined,
		});
	};

	// Handle date range change
	const handleDateRangeChange = (field: "start" | "end", value: string) => {
		const dateValue = value ? new Date(value) : undefined;
		if (!dateValue) {
			if (field === "start" && localFilters.dateRange?.end) {
				setLocalFilters({
					...localFilters,
					dateRange: undefined,
				});
			} else if (field === "end" && localFilters.dateRange?.start) {
				setLocalFilters({
					...localFilters,
					dateRange: undefined,
				});
			}
			return;
		}

		setLocalFilters({
			...localFilters,
			dateRange: {
				start:
					field === "start"
						? dateValue
						: localFilters.dateRange?.start || dateValue,
				end:
					field === "end"
						? dateValue
						: localFilters.dateRange?.end || dateValue,
			},
		});
	};

	// Handle position range change
	const handlePositionChange = (field: "min" | "max", value: string) => {
		const numValue = value ? parseInt(value, 10) : undefined;
		setLocalFilters({
			...localFilters,
			[field === "min" ? "minPosition" : "maxPosition"]: numValue,
		});
	};

	// Handle apply
	const handleApply = () => {
		onChange(localFilters);
	};

	// Handle reset
	const handleReset = () => {
		const emptyFilters: UserFiltersType = {};
		setLocalFilters(emptyFilters);
		onReset();
	};

	return (
		<div className={classNames} {...props}>
			<div className={styles.header}>
				<h3 className={styles.title}>Filters</h3>
				<button
					className={styles.resetButton}
					onClick={handleReset}
					aria-label="Reset filters"
				>
					<i className="ri-refresh-line" aria-hidden="true" />
					Reset
				</button>
			</div>

			{/* Status Filter */}
			<div className={styles.filterSection}>
				<h4 className={styles.filterLabel}>Status</h4>
				<div className={styles.checkboxGroup}>
					{STATUS_OPTIONS.map(({ value, label }) => (
						<CheckboxWithLabel
							key={value}
							text={label}
							description=""
							checked={
								localFilters.status?.includes(value) ? "checked" : "unchecked"
							}
							onChange={() => handleStatusToggle(value)}
							flipCheckboxToRight={false}
						/>
					))}
				</div>
			</div>

			{/* Date Range Filter */}
			<div className={styles.filterSection}>
				<h4 className={styles.filterLabel}>Date Range</h4>
				<div className={styles.dateRangeInputs}>
					<TextInput
						label="From"
						type="date"
						value={
							localFilters.dateRange?.start
								? localFilters.dateRange.start.toISOString().split("T")[0]
								: ""
						}
						onChange={(e) => handleDateRangeChange("start", e.target.value)}
					/>
					<TextInput
						label="To"
						type="date"
						value={
							localFilters.dateRange?.end
								? localFilters.dateRange.end.toISOString().split("T")[0]
								: ""
						}
						onChange={(e) => handleDateRangeChange("end", e.target.value)}
					/>
				</div>
			</div>

			{/* Source Filter */}
			<div className={styles.filterSection}>
				<h4 className={styles.filterLabel}>Source</h4>
				<div className={styles.checkboxGroup}>
					{SOURCE_OPTIONS.map((source) => (
						<CheckboxWithLabel
							key={source}
							text={source.charAt(0).toUpperCase() + source.slice(1)}
							description=""
							checked={
								localFilters.source?.includes(source) ? "checked" : "unchecked"
							}
							onChange={() => handleSourceToggle(source)}
							flipCheckboxToRight={false}
						/>
					))}
				</div>
			</div>

			{/* Has Referrals Filter */}
			<div className={styles.filterSection}>
				<CheckboxWithLabel
					text="Has referrals"
					description=""
					checked={localFilters.hasReferrals ? "checked" : "unchecked"}
					onChange={() =>
						setLocalFilters({
							...localFilters,
							hasReferrals: !localFilters.hasReferrals || undefined,
						})
					}
					flipCheckboxToRight={false}
				/>
			</div>

			{/* Position Range Filter */}
			<div className={styles.filterSection}>
				<h4 className={styles.filterLabel}>Position Range</h4>
				<div className={styles.positionInputs}>
					<TextInput
						label="Min"
						type="number"
						min={1}
						placeholder="1"
						value={localFilters.minPosition?.toString() || ""}
						onChange={(e) => handlePositionChange("min", e.target.value)}
					/>
					<TextInput
						label="Max"
						type="number"
						min={1}
						placeholder="100"
						value={localFilters.maxPosition?.toString() || ""}
						onChange={(e) => handlePositionChange("max", e.target.value)}
					/>
				</div>
			</div>

			{/* Action Buttons */}
			<div className={styles.actions}>
				<Button
					onClick={handleApply}
					variant="primary"
					className={styles.applyButton}
				>
					Apply Filters
				</Button>
			</div>
		</div>
	);
});

UserFilters.displayName = "UserFilters";
