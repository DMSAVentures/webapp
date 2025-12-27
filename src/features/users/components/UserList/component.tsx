/**
 * UserList Component
 * Display waitlist users with filters and sorting
 */

import { type HTMLAttributes, memo, useCallback, useState } from "react";
import { useUserHelpers } from "@/hooks/useUserStatus";
import { Button } from "@/proto-design-system/Button/button";
import Checkbox from "@/proto-design-system/checkbox/checkbox";
import Modal from "@/proto-design-system/modal/modal";
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
	/** Export handler */
	onExport?: () => Promise<void>;
	/** Bulk action handler */
	onBulkAction?: (action: string, userIds: string[]) => Promise<void>;
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
	onBulkAction,
	referralEnabled = true,
	emailVerificationEnabled = true,
	formFields,
	sortField = "position",
	sortDirection = "asc",
	onSortChange,
	className: customClassName,
	...props
}) {
	const { getStatusVariant, formatStatus } = useUserHelpers();
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isBulkLoading, setIsBulkLoading] = useState(false);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");
	const hasSelection = selectedUserIds.length > 0;

	// Filter out form fields that match built-in columns
	const customFormFields = formFields?.filter(
		(field) => field.label.toLowerCase() !== "email",
	);

	// Handle sort - trigger server-side sorting via callback
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

	// Handle select all
	const handleSelectAll = useCallback(() => {
		if (selectedUserIds.length === users.length) {
			setSelectedUserIds([]);
		} else {
			setSelectedUserIds(users.map((u) => u.id));
		}
	}, [selectedUserIds, users]);

	// Handle select user
	const handleSelectUser = useCallback((userId: string) => {
		setSelectedUserIds((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId],
		);
	}, []);

	// Handle bulk action
	const handleBulkAction = async (
		action: "email" | "status" | "export" | "delete",
	) => {
		if (action === "delete") {
			setIsDeleteModalOpen(true);
			return;
		}

		if (action === "export" && onExport) {
			await onExport();
			setSelectedUserIds([]);
			return;
		}

		setIsBulkLoading(true);
		try {
			if (onBulkAction) {
				await onBulkAction(action, selectedUserIds);
			}
			setSelectedUserIds([]);
		} finally {
			setIsBulkLoading(false);
		}
	};

	// Handle confirm delete
	const handleConfirmDelete = async () => {
		setIsBulkLoading(true);
		try {
			if (onBulkAction) {
				await onBulkAction("delete", selectedUserIds);
			}
			setSelectedUserIds([]);
			setIsDeleteModalOpen(false);
		} finally {
			setIsBulkLoading(false);
		}
	};

	// Handle export CSV
	const handleExportAll = async () => {
		if (onExport) {
			await onExport();
		}
	};

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

	return (
		<div className={classNames} {...props}>
			{/* Header with actions */}
			<div className={styles.header}>
				{/* Actions */}
				<div className={styles.headerActions}>
					<Button
						variant="secondary"
						leftIcon="ri-download-line"
						onClick={handleExportAll}
					>
						Export CSV
					</Button>
					{hasSelection && (
						<>
							<Button
								variant="secondary"
								leftIcon="ri-mail-line"
								onClick={() => handleBulkAction("email")}
								disabled={isBulkLoading}
							>
								Email
							</Button>
							<Button
								variant="secondary"
								leftIcon="ri-refresh-line"
								onClick={() => handleBulkAction("status")}
								disabled={isBulkLoading}
							>
								Update Status
							</Button>
							<Button
								variant="secondary"
								leftIcon="ri-delete-bin-line"
								onClick={() => handleBulkAction("delete")}
								disabled={isBulkLoading}
							>
								Delete
							</Button>
							<Button
								variant="secondary"
								onClick={() => setSelectedUserIds([])}
								disabled={isBulkLoading}
							>
								Clear
							</Button>
						</>
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
										checked={
											selectedUserIds.length === users.length &&
											users.length > 0
												? "checked"
												: "unchecked"
										}
										onChange={handleSelectAll}
										aria-label="Select all users"
									/>
								</Table.HeaderCell>
								<Table.HeaderCell
									sortable
									sortDirection={sortField === "email" ? sortDirection : null}
									onSort={() => handleSort("email")}
								>
									Email
								</Table.HeaderCell>
								{emailVerificationEnabled && (
									<Table.HeaderCell
										sortable
										sortDirection={
											sortField === "status" ? sortDirection : null
										}
										onSort={() => handleSort("status")}
									>
										Status
									</Table.HeaderCell>
								)}
								{referralEnabled && (
									<>
										<Table.HeaderCell
											sortable
											sortDirection={
												sortField === "position" ? sortDirection : null
											}
											onSort={() => handleSort("position")}
										>
											Position
										</Table.HeaderCell>
										<Table.HeaderCell
											sortable
											sortDirection={
												sortField === "referralCount" ? sortDirection : null
											}
											onSort={() => handleSort("referralCount")}
										>
											Referrals
										</Table.HeaderCell>
										<Table.HeaderCell
											sortable
											sortDirection={
												sortField === "source" ? sortDirection : null
											}
											onSort={() => handleSort("source")}
										>
											Source
										</Table.HeaderCell>
										<Table.HeaderCell>UTM Source</Table.HeaderCell>
									</>
								)}
								{/* Dynamic columns for custom form fields */}
								{customFormFields?.map((field) => (
									<Table.HeaderCell key={field.id}>
										{field.label}
									</Table.HeaderCell>
								))}
								<Table.HeaderCell
									sortable
									sortDirection={
										sortField === "createdAt" ? sortDirection : null
									}
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
									selected={selectedUserIds.includes(user.id)}
									onClick={() => onUserClick?.(user)}
								>
									<Table.Cell narrow>
										<Checkbox
											checked={
												selectedUserIds.includes(user.id)
													? "checked"
													: "unchecked"
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
													{user.source.charAt(0).toUpperCase() +
														user.source.slice(1)}
												</span>
											</Table.Cell>
											<Table.Cell fitContent>
												<UtmSourceBadge source={user.utmSource} />
											</Table.Cell>
										</>
									)}
									{/* Dynamic cells for custom form fields */}
									{customFormFields?.map((field) => (
										<Table.Cell key={field.id}>
											<span className={styles.customField}>
												{user.customFields?.[field.id] ?? "-"}
											</span>
										</Table.Cell>
									))}
									<Table.Cell>
										<span className={styles.date}>
											{new Date(user.createdAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
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

			{/* Delete confirmation modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="Delete Users"
				description={`Are you sure you want to delete ${selectedUserIds.length} user${selectedUserIds.length !== 1 ? "s" : ""}? This action cannot be undone.`}
				icon="warning"
				dismissibleByCloseIcon={true}
				proceedText={isBulkLoading ? "Deleting..." : "Delete"}
				cancelText="Cancel"
				onCancel={() => setIsDeleteModalOpen(false)}
				onProceed={handleConfirmDelete}
			/>
		</div>
	);
});

UserList.displayName = "UserList";
