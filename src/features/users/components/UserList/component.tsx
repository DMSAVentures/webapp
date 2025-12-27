/**
 * UserList Component
 * Display waitlist users with filters and sorting
 */

import { type HTMLAttributes, memo, useCallback, useState } from "react";
import { useUserHelpers } from "@/hooks/useUserStatus";
import { Button } from "@/proto-design-system/Button/button";
import Checkbox from "@/proto-design-system/checkbox/checkbox";
import Pagination from "@/proto-design-system/pagination/pagination";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";
import { Table } from "@/proto-design-system/Table";
import type { FormField } from "@/types/campaign";
import type {
	SortDirection,
	UserSortField,
	WaitlistUser,
} from "@/types/users.types";
import { formatPosition } from "@/utils/positionFormatter";
import { UtmSourceBadge } from "../UtmSourceBadge/component";
import styles from "./component.module.scss";

export interface UserListProps extends HTMLAttributes<HTMLDivElement> {
	/** Campaign ID */
	campaignId: string;
	/** Users to display */
	users: WaitlistUser[];
	/** Loading state */
	loading?: boolean;
	/** Pagination - current page */
	currentPage?: number;
	/** Pagination - total pages */
	totalPages?: number;
	/** Pagination - items per page */
	pageSize?: number;
	/** Total users count (across all pages) */
	totalUsers?: number;
	/** Page change handler */
	onPageChange?: (page: number) => void;
	/** User click handler */
	onUserClick?: (user: WaitlistUser) => void;
	/** Export handler - receives selected user IDs (empty array means export all) */
	onExport?: (selectedUserIds: string[]) => Promise<void>;
	/** Whether referral feature is enabled for this campaign */
	referralEnabled?: boolean;
	/** Whether email verification is enabled for this campaign */
	emailVerificationEnabled?: boolean;
	/** Custom form fields for dynamic columns */
	formFields?: FormField[];
	/** Current sort field */
	sortField?: UserSortField;
	/** Current sort direction */
	sortDirection?: SortDirection;
	/** Sort change handler for server-side sorting */
	onSortChange?: (field: UserSortField, direction: SortDirection) => void;
	/** Additional CSS class name */
	className?: string;
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Filter out form fields that match built-in columns */
function filterCustomFormFields(
	formFields: FormField[] | undefined,
): FormField[] {
	return (
		formFields?.filter((field) => field.label.toLowerCase() !== "email") ?? []
	);
}

/** Format date for display */
function formatDate(date: string | Date): string {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return dateObj.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

/** Capitalize first letter of source */
function formatSource(source: string): string {
	return source.charAt(0).toUpperCase() + source.slice(1);
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing table row selection */
function useTableSelection(users: WaitlistUser[]) {
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

	const hasSelection = selectedUserIds.length > 0;
	const isAllSelected =
		selectedUserIds.length === users.length && users.length > 0;

	const handleSelectAll = useCallback(() => {
		if (isAllSelected) {
			setSelectedUserIds([]);
		} else {
			setSelectedUserIds(users.map((u) => u.id));
		}
	}, [isAllSelected, users]);

	const handleSelectUser = useCallback((userId: string) => {
		setSelectedUserIds((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId],
		);
	}, []);

	const clearSelection = useCallback(() => {
		setSelectedUserIds([]);
	}, []);

	const isUserSelected = useCallback(
		(userId: string) => selectedUserIds.includes(userId),
		[selectedUserIds],
	);

	return {
		selectedUserIds,
		hasSelection,
		isAllSelected,
		handleSelectAll,
		handleSelectUser,
		clearSelection,
		isUserSelected,
	};
}

/** Hook for managing table sorting */
function useTableSort(
	sortField: UserSortField,
	sortDirection: SortDirection,
	onSortChange?: (field: UserSortField, direction: SortDirection) => void,
) {
	const handleSort = useCallback(
		(field: UserSortField) => {
			if (!onSortChange) return;

			if (sortField === field) {
				onSortChange(field, sortDirection === "asc" ? "desc" : "asc");
			} else {
				onSortChange(field, "asc");
			}
		},
		[sortField, sortDirection, onSortChange],
	);

	const getSortDirection = useCallback(
		(field: UserSortField): SortDirection | null => {
			return sortField === field ? sortDirection : null;
		},
		[sortField, sortDirection],
	);

	return {
		handleSort,
		getSortDirection,
	};
}

/** Hook for managing export functionality */
function useExport(
	onExport: ((selectedUserIds: string[]) => Promise<void>) | undefined,
) {
	const [isExporting, setIsExporting] = useState(false);

	const handleExport = useCallback(
		async (selectedUserIds: string[]) => {
			if (!onExport) return;
			setIsExporting(true);
			try {
				await onExport(selectedUserIds);
			} finally {
				setIsExporting(false);
			}
		},
		[onExport],
	);

	return {
		isExporting,
		handleExport,
	};
}

// ============================================================================
// Component
// ============================================================================

/**
 * UserList displays a filterable, sortable list of waitlist users
 */
export const UserList = memo<UserListProps>(function UserList({
	campaignId,
	users,
	loading = false,
	currentPage = 1,
	totalPages = 1,
	pageSize = 25,
	totalUsers = 0,
	onPageChange,
	onUserClick,
	onExport,
	referralEnabled = true,
	emailVerificationEnabled = true,
	formFields,
	sortField = "position",
	sortDirection = "asc",
	onSortChange,
	className: customClassName,
	...props
}) {
	// Hooks
	const { getStatusVariant, formatStatus } = useUserHelpers();

	const {
		selectedUserIds,
		hasSelection,
		isAllSelected,
		handleSelectAll,
		handleSelectUser,
		clearSelection,
		isUserSelected,
	} = useTableSelection(users);

	const { handleSort, getSortDirection } = useTableSort(
		sortField,
		sortDirection,
		onSortChange,
	);

	const { isExporting, handleExport } = useExport(onExport);

	// Derived state
	const customFormFields = filterCustomFormFields(formFields);
	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Handlers
	const onExportClick = useCallback(() => {
		handleExport(selectedUserIds);
	}, [handleExport, selectedUserIds]);

	// Empty state
	if (!loading && users.length === 0) {
		return (
			<div className={styles.emptyState}>
				<div className={styles.emptyStateIcon}>
					<i className="ri-user-line" aria-hidden="true" />
				</div>
				<h3 className={styles.emptyStateTitle}>No users yet</h3>
				<p className={styles.emptyStateDescription}>
					Users who sign up for this campaign will appear here
				</p>
			</div>
		);
	}

	// Render
	return (
		<div className={classNames} {...props}>
			{/* Header with actions */}
			<div className={styles.header}>
				<div className={styles.headerActions}>
					<Button
						variant="secondary"
						leftIcon="ri-download-line"
						onClick={onExportClick}
						disabled={isExporting}
					>
						{isExporting
							? "Exporting..."
							: hasSelection
								? `Export Selected (${selectedUserIds.length})`
								: "Export All Users"}
					</Button>
					{hasSelection && (
						<Button variant="secondary" size="small" onClick={clearSelection}>
							Clear Selection
						</Button>
					)}
				</div>
			</div>

			{/* Main content */}
			<div className={styles.main}>
				{/* Results count */}
				<div className={styles.resultsInfo}>
					{hasSelection ? (
						<>
							<span className={styles.selectionCount}>
								{selectedUserIds.length} selected
							</span>
							<span className={styles.resultsDivider}>/</span>
						</>
					) : null}
					{totalUsers} user{totalUsers !== 1 ? "s" : ""} total
				</div>

				{/* User table */}
				{!loading && users.length === 0 ? (
					<div className={styles.noResults}>
						<i className="ri-search-line" aria-hidden="true" />
						<p>No users found</p>
					</div>
				) : (
					<Table loading={loading} loadingMessage="Loading users...">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell narrow>
									<Checkbox
										checked={isAllSelected ? "checked" : "unchecked"}
										onChange={handleSelectAll}
										aria-label="Select all users"
									/>
								</Table.HeaderCell>
								<Table.HeaderCell
									sortable
									sortDirection={getSortDirection("email")}
									onSort={() => handleSort("email")}
								>
									Email
								</Table.HeaderCell>
								{emailVerificationEnabled && (
									<Table.HeaderCell
										sortable
										sortDirection={getSortDirection("status")}
										onSort={() => handleSort("status")}
									>
										Status
									</Table.HeaderCell>
								)}
								{referralEnabled && (
									<>
										<Table.HeaderCell
											sortable
											sortDirection={getSortDirection("position")}
											onSort={() => handleSort("position")}
										>
											Position
										</Table.HeaderCell>
										<Table.HeaderCell
											sortable
											sortDirection={getSortDirection("referralCount")}
											onSort={() => handleSort("referralCount")}
										>
											Referrals
										</Table.HeaderCell>
										<Table.HeaderCell
											sortable
											sortDirection={getSortDirection("source")}
											onSort={() => handleSort("source")}
										>
											Source
										</Table.HeaderCell>
										<Table.HeaderCell>UTM Source</Table.HeaderCell>
									</>
								)}
								{/* Dynamic columns for custom form fields */}
								{customFormFields.map((field) => (
									<Table.HeaderCell key={field.id}>
										{field.label}
									</Table.HeaderCell>
								))}
								<Table.HeaderCell
									sortable
									sortDirection={getSortDirection("createdAt")}
									onSort={() => handleSort("createdAt")}
								>
									Date
								</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{users.map((user) => (
								<Table.Row
									key={user.id}
									selected={isUserSelected(user.id)}
									onClick={() => onUserClick?.(user)}
								>
									<Table.Cell narrow>
										<Checkbox
											checked={
												isUserSelected(user.id) ? "checked" : "unchecked"
											}
											onChange={() => handleSelectUser(user.id)}
											onClick={(e) => e.stopPropagation()}
										/>
									</Table.Cell>
									<Table.Cell>
										<span className={styles.email}>{user.email}</span>
									</Table.Cell>
									{emailVerificationEnabled && (
										<Table.Cell fitContent>
											<StatusBadge
												text={formatStatus(user.status)}
												variant={getStatusVariant(user.status)}
												styleType="light"
											/>
										</Table.Cell>
									)}
									{referralEnabled && (
										<>
											<Table.Cell>
												<span className={styles.position}>
													{formatPosition(user.position)}
												</span>
											</Table.Cell>
											<Table.Cell>
												<span className={styles.referralCount}>
													{user.referralCount}
												</span>
											</Table.Cell>
											<Table.Cell>
												<span className={styles.source}>
													{formatSource(user.source)}
												</span>
											</Table.Cell>
											<Table.Cell fitContent>
												<UtmSourceBadge source={user.utmSource} />
											</Table.Cell>
										</>
									)}
									{/* Dynamic cells for custom form fields */}
									{customFormFields.map((field) => (
										<Table.Cell key={field.id}>
											<span className={styles.customField}>
												{user.customFields?.[field.name] ?? "-"}
											</span>
										</Table.Cell>
									))}
									<Table.Cell>
										<span className={styles.date}>
											{formatDate(user.createdAt)}
										</span>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className={styles.pagination}>
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							itemsPerPage={pageSize}
							style="rounded"
							onPageChange={onPageChange ?? (() => undefined)}
						/>
					</div>
				)}
			</div>
		</div>
	);
});

UserList.displayName = "UserList";
