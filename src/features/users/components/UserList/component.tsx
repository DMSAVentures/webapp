/**
 * UserList Component
 * Display waitlist users with filters and sorting
 */

import {
	type HTMLAttributes,
	memo,
	useCallback,
	useMemo,
	useState,
} from "react";
import { useUserHelpers } from "@/hooks/useUserStatus";
import { Button } from "@/proto-design-system/Button/button";
import Checkbox from "@/proto-design-system/checkbox/checkbox";
import Modal from "@/proto-design-system/modal/modal";
import Pagination from "@/proto-design-system/pagination/pagination";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";
import { Table } from "@/proto-design-system/Table";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
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
	className: customClassName,
	...props
}) {
	const { getStatusVariant, formatStatus } = useUserHelpers();
	const [searchQuery, setSearchQuery] = useState("");
	const [sortField, setSortField] = useState<UserSortField>("position");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isBulkLoading, setIsBulkLoading] = useState(false);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");
	const hasSelection = selectedUserIds.length > 0;

	// Handle sort
	const handleSort = useCallback(
		(field: UserSortField) => {
			if (sortField === field) {
				setSortDirection(sortDirection === "asc" ? "desc" : "asc");
			} else {
				setSortField(field);
				setSortDirection("asc");
			}
		},
		[sortField, sortDirection],
	);

	// Filter and sort users (client-side search and sort only)
	const filteredAndSortedUsers = useMemo(() => {
		let filtered = users;

		// Apply search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter((user) =>
				user.email.toLowerCase().includes(query),
			);
		}

		// Sort
		const sorted = [...filtered].sort((a, b) => {
			let aValue: string | number;
			let bValue: string | number;

			switch (sortField) {
				case "email":
					aValue = a.email;
					bValue = b.email;
					break;
				case "status":
					aValue = a.status;
					bValue = b.status;
					break;
				case "position":
					aValue = a.position;
					bValue = b.position;
					break;
				case "referralCount":
					aValue = a.referralCount;
					bValue = b.referralCount;
					break;
				case "source":
					aValue = a.source;
					bValue = b.source;
					break;
				case "createdAt":
					aValue = new Date(a.createdAt).getTime();
					bValue = new Date(b.createdAt).getTime();
					break;
				default:
					return 0;
			}

			if (typeof aValue === "string" && typeof bValue === "string") {
				return sortDirection === "asc"
					? aValue.localeCompare(bValue)
					: bValue.localeCompare(aValue);
			}

			if (typeof aValue === "number" && typeof bValue === "number") {
				return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
			}

			return 0;
		});

		return sorted;
	}, [users, searchQuery, sortField, sortDirection]);

	// Handle select all
	const handleSelectAll = useCallback(() => {
		if (selectedUserIds.length === filteredAndSortedUsers.length) {
			setSelectedUserIds([]);
		} else {
			setSelectedUserIds(filteredAndSortedUsers.map((u) => u.id));
		}
	}, [selectedUserIds, filteredAndSortedUsers]);

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
			{/* Header with search and actions */}
			<div className={styles.header}>
				{/* Search */}
				<div className={styles.searchBox}>
					<TextInput
						label="Search"
						placeholder="Search by email..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						leftIcon="ri-search-line"
						showLeftIcon={true}
					/>
					{searchQuery && (
						<button
							className={styles.searchClear}
							onClick={() => setSearchQuery("")}
							aria-label="Clear search"
						>
							<i className="ri-close-line" aria-hidden="true" />
						</button>
					)}
				</div>

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
					{searchQuery ? (
						<>
							{filteredAndSortedUsers.length} user
							{filteredAndSortedUsers.length !== 1 ? "s" : ""} matching "
							{searchQuery}"
						</>
					) : (
						<>
							{totalUsers} user{totalUsers !== 1 ? "s" : ""} total
						</>
					)}
				</div>

				{/* User table */}
				{!loading && filteredAndSortedUsers.length === 0 ? (
					<div className={styles.noResults}>
						<i className="ri-search-line" aria-hidden="true" />
						<p>No users found</p>
						{searchQuery && (
							<Button onClick={() => setSearchQuery("")} variant="secondary">
								Clear search
							</Button>
						)}
					</div>
				) : (
					<Table loading={loading} loadingMessage="Loading users...">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell narrow>
									<Checkbox
										checked={
											selectedUserIds.length ===
												filteredAndSortedUsers.length &&
											filteredAndSortedUsers.length > 0
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
							{filteredAndSortedUsers.map((user) => (
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
