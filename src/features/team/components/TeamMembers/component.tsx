/**
 * TeamMembers Component
 * Displays team member list with management capabilities
 */

import { type HTMLAttributes, memo, useState } from "react";
import { Button } from "@/proto-design-system/Button/button";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import { Badge } from "@/proto-design-system/badge/badge";
import Dropdown, {
	type DropdownOptionInput,
} from "@/proto-design-system/dropdown/dropdown";
import type { TeamMember } from "@/types/common.types";
import { useGetTeamMembers } from "../../hooks/useGetTeamMembers";
import { useInviteTeamMember } from "../../hooks/useInviteTeamMember";
import { useRemoveTeamMember } from "../../hooks/useRemoveTeamMember";
import { useUpdateMemberRole } from "../../hooks/useUpdateMemberRole";
import { TeamInviteModal } from "../TeamInviteModal/component";
import styles from "./component.module.scss";

export interface TeamMembersProps extends HTMLAttributes<HTMLDivElement> {
	/** Callback when invite button is clicked (optional) */
	onInvite?: () => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Role options for the dropdown
 */
const ROLE_OPTIONS: DropdownOptionInput[] = [
	{ value: "viewer", label: "Viewer" },
	{ value: "editor", label: "Editor" },
	{ value: "admin", label: "Admin" },
	{ value: "owner", label: "Owner", disabled: true },
];

/**
 * Get badge variant for role
 */
const getRoleBadgeVariant = (
	role: TeamMember["role"],
): "gray" | "blue" | "purple" | "green" => {
	switch (role) {
		case "owner":
			return "purple";
		case "admin":
			return "blue";
		case "editor":
			return "green";
		case "viewer":
			return "gray";
		default:
			return "gray";
	}
};

/**
 * Get initials from name
 */
const getInitials = (name: string): string => {
	const parts = name.split(" ");
	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}
	return name.substring(0, 2).toUpperCase();
};

/**
 * Format last active date
 */
const formatLastActive = (date?: Date): string => {
	if (!date) return "Never";

	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor(diff / (1000 * 60));

	if (days > 30) {
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	} else if (days > 0) {
		return `${days} day${days > 1 ? "s" : ""} ago`;
	} else if (hours > 0) {
		return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	} else if (minutes > 0) {
		return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	}
	return "Just now";
};

/**
 * TeamMembers displays the team member list
 */
export const TeamMembers = memo(function TeamMembers({
	onInvite,
	className: customClassName,
	...props
}: TeamMembersProps) {
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	// Hooks
	const { teamMembers, loading, error, refetch } = useGetTeamMembers();
	const { inviteTeamMember, loading: inviteLoading } = useInviteTeamMember();
	const { updateMemberRole, loading: updateLoading } = useUpdateMemberRole();
	const { removeTeamMember, loading: removeLoading } = useRemoveTeamMember();

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Handle invite
	const handleInvite = async (data: {
		email: string;
		role: TeamMember["role"];
	}) => {
		const result = await inviteTeamMember(data);
		if (result) {
			setIsInviteModalOpen(false);
			refetch();
			if (onInvite) {
				onInvite();
			}
		}
	};

	// Handle role change
	const handleRoleChange = async (
		memberId: string,
		option: DropdownOptionInput,
	) => {
		const newRole = option.value as TeamMember["role"];
		const result = await updateMemberRole(memberId, { role: newRole });
		if (result) {
			refetch();
		}
	};

	// Handle remove member
	const handleRemove = async (memberId: string) => {
		if (confirmDeleteId !== memberId) {
			setConfirmDeleteId(memberId);
			return;
		}

		const result = await removeTeamMember(memberId);
		if (result) {
			setConfirmDeleteId(null);
			refetch();
		}
	};

	// Separate pending invitations from active members
	const activeMembers = teamMembers.filter((m) => m.joinedAt);
	const pendingInvitations = teamMembers.filter((m) => !m.joinedAt);

	return (
		<div className={classNames} {...props}>
			{/* Header */}
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<h2 className={styles.title}>Team Members</h2>
					<p className={styles.subtitle}>
						Manage your team and their access levels
					</p>
				</div>
				<Button
					variant="primary"
					leftIcon="user-add-line"
					onClick={() => setIsInviteModalOpen(true)}
				>
					Invite Member
				</Button>
			</div>

			{/* Loading state */}
			{loading && (
				<div className={styles.loading}>
					<i className="ri-loader-4-line ri-spin" aria-hidden="true" />
					Loading team members...
				</div>
			)}

			{/* Error state */}
			{error && (
				<div className={styles.error}>
					<i className="ri-error-warning-line" aria-hidden="true" />
					{error.error}
				</div>
			)}

			{/* Members table */}
			{!loading && !error && (
				<>
					{/* Active Members */}
					{activeMembers.length > 0 && (
						<div className={styles.section}>
							<h3 className={styles.sectionTitle}>
								Active Members ({activeMembers.length})
							</h3>
							<div className={styles.table}>
								<div className={styles.tableHeader}>
									<div className={styles.tableCell}>Member</div>
									<div className={styles.tableCell}>Role</div>
									<div className={styles.tableCell}>Last Active</div>
									<div className={styles.tableCell}>Actions</div>
								</div>
								{activeMembers.map((member) => (
									<div key={member.id} className={styles.tableRow}>
										<div className={styles.tableCell}>
											<div className={styles.memberInfo}>
												<div className={styles.avatar}>
													{getInitials(member.name)}
												</div>
												<div className={styles.memberDetails}>
													<div className={styles.memberName}>{member.name}</div>
													<div className={styles.memberEmail}>
														{member.email}
													</div>
												</div>
											</div>
										</div>
										<div className={styles.tableCell}>
											{member.role === "owner" ? (
												<Badge
													text={
														member.role.charAt(0).toUpperCase() +
														member.role.slice(1)
													}
													variant={getRoleBadgeVariant(member.role)}
													styleType="light"
													size="small"
												/>
											) : (
												<div className={styles.roleDropdown}>
													<Dropdown
														placeholderText="Select role"
														options={ROLE_OPTIONS}
														size="x-small"
														onChange={(option) =>
															handleRoleChange(member.id, option)
														}
														disabled={updateLoading}
													/>
												</div>
											)}
										</div>
										<div className={styles.tableCell}>
											<span className={styles.lastActive}>
												{formatLastActive(member.lastActiveAt)}
											</span>
										</div>
										<div className={styles.tableCell}>
											{member.role !== "owner" && (
												<IconOnlyButton
													iconClass={
														confirmDeleteId === member.id
															? "check-line"
															: "delete-bin-line"
													}
													variant="secondary"
													ariaLabel={
														confirmDeleteId === member.id
															? "Confirm delete"
															: "Remove member"
													}
													onClick={() => handleRemove(member.id)}
													disabled={removeLoading}
												/>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Pending Invitations */}
					{pendingInvitations.length > 0 && (
						<div className={styles.section}>
							<h3 className={styles.sectionTitle}>
								Pending Invitations ({pendingInvitations.length})
							</h3>
							<div className={styles.table}>
								<div className={styles.tableHeader}>
									<div className={styles.tableCell}>Member</div>
									<div className={styles.tableCell}>Role</div>
									<div className={styles.tableCell}>Invited</div>
									<div className={styles.tableCell}>Actions</div>
								</div>
								{pendingInvitations.map((member) => (
									<div key={member.id} className={styles.tableRow}>
										<div className={styles.tableCell}>
											<div className={styles.memberInfo}>
												<div
													className={`${styles.avatar} ${styles.avatarPending}`}
												>
													<i className="ri-mail-line" aria-hidden="true" />
												</div>
												<div className={styles.memberDetails}>
													<div className={styles.memberEmail}>
														{member.email}
													</div>
													<div className={styles.pendingLabel}>
														Pending invitation
													</div>
												</div>
											</div>
										</div>
										<div className={styles.tableCell}>
											<Badge
												text={
													member.role.charAt(0).toUpperCase() +
													member.role.slice(1)
												}
												variant={getRoleBadgeVariant(member.role)}
												styleType="light"
												size="small"
											/>
										</div>
										<div className={styles.tableCell}>
											<span className={styles.lastActive}>
												{new Date(member.invitedAt).toLocaleDateString(
													"en-US",
													{
														month: "short",
														day: "numeric",
														year: "numeric",
													},
												)}
											</span>
										</div>
										<div className={styles.tableCell}>
											<IconOnlyButton
												iconClass={
													confirmDeleteId === member.id
														? "check-line"
														: "delete-bin-line"
												}
												variant="secondary"
												ariaLabel={
													confirmDeleteId === member.id
														? "Confirm delete"
														: "Remove invitation"
												}
												onClick={() => handleRemove(member.id)}
												disabled={removeLoading}
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Empty state */}
					{teamMembers.length === 0 && (
						<div className={styles.empty}>
							<i className="ri-team-line" aria-hidden="true" />
							<h3 className={styles.emptyTitle}>No team members yet</h3>
							<p className={styles.emptyText}>
								Invite your first team member to start collaborating
							</p>
							<Button
								variant="primary"
								leftIcon="user-add-line"
								onClick={() => setIsInviteModalOpen(true)}
							>
								Invite Member
							</Button>
						</div>
					)}
				</>
			)}

			{/* Invite Modal */}
			<TeamInviteModal
				isOpen={isInviteModalOpen}
				onClose={() => setIsInviteModalOpen(false)}
				onInvite={handleInvite}
				loading={inviteLoading}
			/>
		</div>
	);
});

TeamMembers.displayName = "TeamMembers";
