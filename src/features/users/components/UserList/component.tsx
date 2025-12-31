/**
 * UserList Component
 * Display waitlist users with filters and sorting
 */

import { ArrowUp, Download, Lock, Search, User } from "lucide-react";
import { type HTMLAttributes, memo, useCallback, useState } from "react";
import { useUserHelpers } from "@/hooks/useUserStatus";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/proto-design-system/components/data/Table";
import { Checkbox } from "@/proto-design-system/components/forms/Checkbox";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Pagination } from "@/proto-design-system/components/navigation/Pagination";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Text } from "@/proto-design-system/components/primitives/Text";
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
	/** Number of leads that are gated (hidden due to plan limit) */
	gatedLeadsCount?: number;
	/** Callback when upgrade CTA is clicked */
	onUpgradeClick?: () => void;
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
	gatedLeadsCount = 0,
	onUpgradeClick,
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

	// Phantom rows for gated leads (show max 3 phantom rows)
	const phantomRowCount = Math.min(gatedLeadsCount, 3);
	const hasGatedLeads = gatedLeadsCount > 0;

	// Handlers
	const onExportClick = useCallback(() => {
		handleExport(selectedUserIds);
	}, [handleExport, selectedUserIds]);

	// Empty state
	if (!loading && users.length === 0) {
		return (
			<Stack gap="md" align="center" className={styles.emptyState}>
				<Icon icon={User} size="2xl" color="muted" />
				<Text as="h3" size="lg" weight="semibold">
					No users yet
				</Text>
				<Text color="secondary">
					Users who sign up for this campaign will appear here
				</Text>
			</Stack>
		);
	}

	// Render
	return (
		<Stack gap="md" className={classNames} {...props}>
			{/* Header with actions */}
			<Stack direction="row" gap="sm" align="center">
				<Button
					variant="secondary"
					leftIcon={<Download size={16} />}
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
					<Button variant="secondary" size="sm" onClick={clearSelection}>
						Clear Selection
					</Button>
				)}
			</Stack>

			{/* Main content */}
			<Stack gap="md">
				{/* Results count */}
				<Stack direction="row" gap="xs" align="center">
					{hasSelection && (
						<>
							<Text weight="semibold" color="primary">
								{selectedUserIds.length} selected
							</Text>
							<Text color="muted">/</Text>
						</>
					)}
					<Text color="secondary">
						{totalUsers} user{totalUsers !== 1 ? "s" : ""} total
					</Text>
				</Stack>

				{/* User table */}
				{!loading && users.length === 0 ? (
					<Stack gap="sm" align="center" className={styles.noResults}>
						<Icon icon={Search} size="lg" color="muted" />
						<Text color="secondary">No users found</Text>
					</Stack>
				) : (
					<Table loading={loading} loadingMessage="Loading users...">
						<TableHeader>
							<TableRow>
								<TableHead narrow>
									<Checkbox
										checked={isAllSelected}
										onChange={handleSelectAll}
										aria-label="Select all users"
									/>
								</TableHead>
								<TableHead
									sortDirection={getSortDirection("email")}
									onSort={() => handleSort("email")}
								>
									Email
								</TableHead>
								{emailVerificationEnabled && (
									<TableHead
										sortDirection={getSortDirection("status")}
										onSort={() => handleSort("status")}
									>
										Status
									</TableHead>
								)}
								{referralEnabled && (
									<>
										<TableHead
											sortDirection={getSortDirection("position")}
											onSort={() => handleSort("position")}
										>
											Position
										</TableHead>
										<TableHead
											sortDirection={getSortDirection("referralCount")}
											onSort={() => handleSort("referralCount")}
										>
											Referrals
										</TableHead>
										<TableHead
											sortDirection={getSortDirection("source")}
											onSort={() => handleSort("source")}
										>
											Source
										</TableHead>
										<TableHead>UTM Source</TableHead>
									</>
								)}
								{/* Dynamic columns for custom form fields */}
								{customFormFields.map((field) => (
									<TableHead key={field.id}>{field.label}</TableHead>
								))}
								<TableHead
									sortDirection={getSortDirection("createdAt")}
									onSort={() => handleSort("createdAt")}
								>
									Date
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow
									key={user.id}
									selected={isUserSelected(user.id)}
									onClick={() => onUserClick?.(user)}
								>
									<TableCell>
										<Checkbox
											checked={isUserSelected(user.id)}
											onChange={() => handleSelectUser(user.id)}
											onClick={(e) => e.stopPropagation()}
										/>
									</TableCell>
									<TableCell>
										<span className={styles.email}>{user.email}</span>
									</TableCell>
									{emailVerificationEnabled && (
										<TableCell>
											<Badge variant={getStatusVariant(user.status)}>
												{formatStatus(user.status)}
											</Badge>
										</TableCell>
									)}
									{referralEnabled && (
										<>
											<TableCell>
												<span className={styles.position}>
													{formatPosition(user.position)}
												</span>
											</TableCell>
											<TableCell>
												<span className={styles.referralCount}>
													{user.referralCount}
												</span>
											</TableCell>
											<TableCell>
												<span className={styles.source}>
													{formatSource(user.source)}
												</span>
											</TableCell>
											<TableCell>
												<UtmSourceBadge source={user.utmSource} />
											</TableCell>
										</>
									)}
									{/* Dynamic cells for custom form fields */}
									{customFormFields.map((field) => (
										<TableCell key={field.id}>
											<span className={styles.customField}>
												{user.customFields?.[field.name] ?? "-"}
											</span>
										</TableCell>
									))}
									<TableCell>
										<span className={styles.date}>
											{formatDate(user.createdAt)}
										</span>
									</TableCell>
								</TableRow>
							))}
							{/* Phantom rows for gated leads */}
							{hasGatedLeads &&
								Array.from({ length: phantomRowCount }).map((_, index) => (
									<TableRow
										key={`phantom-${index}`}
										className={styles.phantomRow}
									>
										<TableCell>
											<div className={styles.phantomCell} />
										</TableCell>
										<TableCell>
											<div
												className={styles.phantomCell}
												style={{ width: "180px" }}
											/>
										</TableCell>
										{emailVerificationEnabled && (
											<TableCell>
												<div
													className={styles.phantomCell}
													style={{ width: "70px" }}
												/>
											</TableCell>
										)}
										{referralEnabled && (
											<>
												<TableCell>
													<div
														className={styles.phantomCell}
														style={{ width: "40px" }}
													/>
												</TableCell>
												<TableCell>
													<div
														className={styles.phantomCell}
														style={{ width: "30px" }}
													/>
												</TableCell>
												<TableCell>
													<div
														className={styles.phantomCell}
														style={{ width: "60px" }}
													/>
												</TableCell>
												<TableCell>
													<div
														className={styles.phantomCell}
														style={{ width: "50px" }}
													/>
												</TableCell>
											</>
										)}
										{customFormFields.map((field) => (
											<TableCell key={field.id}>
												<div
													className={styles.phantomCell}
													style={{ width: "80px" }}
												/>
											</TableCell>
										))}
										<TableCell>
											<div
												className={styles.phantomCell}
												style={{ width: "80px" }}
											/>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				)}

				{/* Gated leads upgrade CTA */}
				{hasGatedLeads && (
					<Stack
						direction="row"
						gap="md"
						align="center"
						justify="center"
						className={styles.gatedOverlay}
					>
						<Icon icon={Lock} size="lg" color="muted" />
						<Stack gap="xs">
							<Text weight="semibold">
								{gatedLeadsCount} more lead{gatedLeadsCount !== 1 ? "s" : ""}{" "}
								hidden
							</Text>
							<Text size="sm" color="secondary">
								Upgrade your plan to view all your leads
							</Text>
						</Stack>
						<Button
							variant="primary"
							size="sm"
							onClick={onUpgradeClick}
							leftIcon={<ArrowUp size={16} />}
						>
							Upgrade Plan
						</Button>
					</Stack>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<Pagination
						page={currentPage}
						totalPages={totalPages}
						onPageChange={onPageChange ?? (() => undefined)}
					/>
				)}
			</Stack>
		</Stack>
	);
});

UserList.displayName = "UserList";
