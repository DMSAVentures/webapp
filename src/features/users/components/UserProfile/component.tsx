/**
 * UserProfile Component
 * User detail modal with full information and actions
 */

import { type HTMLAttributes, memo, useState } from "react";
import {
	Badge,
	Button,
	Divider,
	Dropdown,
	Modal,
} from "@/proto-design-system";
import type { RewardEarned, WaitlistUser } from "@/types/common.types";
import { formatPosition } from "@/utils/positionFormatter";
import styles from "./component.module.scss";

export interface UserProfileProps extends HTMLAttributes<HTMLDivElement> {
	/** User ID to display */
	userId: string;
	/** User data */
	user: WaitlistUser;
	/** Referred users (referral tree) */
	referredUsers?: WaitlistUser[];
	/** Rewards earned */
	rewards?: RewardEarned[];
	/** Close handler */
	onClose: () => void;
	/** Send email handler */
	onSendEmail?: (userId: string) => void;
	/** Update status handler */
	onUpdateStatus?: (userId: string, status: WaitlistUser["status"]) => void;
	/** Delete handler */
	onDelete?: (userId: string) => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Maps waitlist user status to Badge variant
 */
const getStatusVariant = (
	status: WaitlistUser["status"],
): "success" | "warning" | "error" | "secondary" => {
	switch (status) {
		case "verified":
		case "active":
			return "success";
		case "pending":
			return "warning";
		case "rejected":
			return "error";
		case "invited":
			return "warning";
		default:
			return "warning";
	}
};

/**
 * Formats status for display
 */
const formatStatus = (status: string): string => {
	return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Status options for dropdown
 */
const STATUS_OPTIONS = [
	{ id: "pending", label: "Pending" },
	{ id: "verified", label: "Verified" },
	{ id: "invited", label: "Invited" },
	{ id: "active", label: "Active" },
	{ id: "rejected", label: "Rejected" },
];

/**
 * UserProfile displays detailed user information in a modal
 */
export const UserProfile = memo<UserProfileProps>(function UserProfile({
	userId,
	user,
	referredUsers = [],
	rewards = [],
	onClose,
	onSendEmail,
	onUpdateStatus,
	onDelete,
	className: customClassName,
	...props
}) {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<WaitlistUser["status"]>(
		user.status,
	);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	const handleUpdateStatus = () => {
		if (onUpdateStatus && selectedStatus !== user.status) {
			onUpdateStatus(userId, selectedStatus);
		}
	};

	const handleStatusChange = (id: string) => {
		setSelectedStatus(id as WaitlistUser["status"]);
	};

	const handleDelete = () => {
		if (onDelete) {
			onDelete(userId);
			setIsDeleteModalOpen(false);
			onClose();
		}
	};

	return (
		<>
			<Modal
				isOpen={true}
				onClose={onClose}
				title="User Profile"
			>
				<div className={classNames} {...props}>

					{/* Header */}
					<div className={styles.header}>
						<div className={styles.headerContent}>
							<div className={styles.userAvatar}>
								<i className="ri-user-line" aria-hidden="true" />
							</div>
							<div className={styles.userInfo}>
								<h2 className={styles.userName}>{user.email}</h2>
								<p className={styles.userEmail}>
									{user.emailVerified ? "Verified" : "Not verified"}
								</p>
							</div>
							<Badge
								variant={getStatusVariant(user.status)}
							>
								{formatStatus(user.status)}
							</Badge>
						</div>
						<Button
							leftIcon="ri-close-line"
							variant="secondary"
							aria-label="Close"
							onClick={onClose}
						/>
					</div>

					<Divider />

					{/* Stats Grid */}
					<div className={styles.statsGrid}>
						<div className={styles.statCard}>
							<i className="ri-number-1" aria-hidden="true" />
							<div className={styles.statContent}>
								<span className={styles.statValue}>
									{formatPosition(user.position)}
								</span>
								<span className={styles.statLabel}>Position</span>
							</div>
						</div>
						<div className={styles.statCard}>
							<i className="ri-share-forward-line" aria-hidden="true" />
							<div className={styles.statContent}>
								<span className={styles.statValue}>{user.referralCount}</span>
								<span className={styles.statLabel}>Referrals</span>
							</div>
						</div>
						<div className={styles.statCard}>
							<i className="ri-star-line" aria-hidden="true" />
							<div className={styles.statContent}>
								<span className={styles.statValue}>{user.points}</span>
								<span className={styles.statLabel}>Points</span>
							</div>
						</div>
						<div className={styles.statCard}>
							<i className="ri-link" aria-hidden="true" />
							<div className={styles.statContent}>
								<span className={styles.statValue}>{user.source}</span>
								<span className={styles.statLabel}>Source</span>
							</div>
						</div>
					</div>

					<Divider />

					{/* Details Section */}
					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>Details</h3>
						<div className={styles.detailsGrid}>
							<div className={styles.detailItem}>
								<span className={styles.detailLabel}>Referral Code</span>
								<span className={styles.detailValue}>{user.referralCode}</span>
							</div>
							{user.referredById && (
								<div className={styles.detailItem}>
									<span className={styles.detailLabel}>Referred By</span>
									<span className={styles.detailValue}>
										{user.referredById}
									</span>
								</div>
							)}
							<div className={styles.detailItem}>
								<span className={styles.detailLabel}>Created At</span>
								<span className={styles.detailValue}>
									{new Date(user.createdAt).toLocaleString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
										hour: "numeric",
										minute: "2-digit",
									})}
								</span>
							</div>
						</div>
					</div>

					{/* UTM Parameters */}
					{(user.utmSource ||
						user.utmMedium ||
						user.utmCampaign ||
						user.utmContent ||
						user.utmTerm) && (
						<>
							<Divider />
							<div className={styles.section}>
								<h3 className={styles.sectionTitle}>UTM Parameters</h3>
								<div className={styles.detailsGrid}>
									{user.utmSource && (
										<div className={styles.detailItem}>
											<span className={styles.detailLabel}>Source</span>
											<span className={styles.detailValue}>
												{user.utmSource}
											</span>
										</div>
									)}
									{user.utmMedium && (
										<div className={styles.detailItem}>
											<span className={styles.detailLabel}>Medium</span>
											<span className={styles.detailValue}>
												{user.utmMedium}
											</span>
										</div>
									)}
									{user.utmCampaign && (
										<div className={styles.detailItem}>
											<span className={styles.detailLabel}>Campaign</span>
											<span className={styles.detailValue}>
												{user.utmCampaign}
											</span>
										</div>
									)}
									{user.utmContent && (
										<div className={styles.detailItem}>
											<span className={styles.detailLabel}>Content</span>
											<span className={styles.detailValue}>
												{user.utmContent}
											</span>
										</div>
									)}
									{user.utmTerm && (
										<div className={styles.detailItem}>
											<span className={styles.detailLabel}>Term</span>
											<span className={styles.detailValue}>{user.utmTerm}</span>
										</div>
									)}
								</div>
							</div>
						</>
					)}

					{/* Referral Tree */}
					{referredUsers.length > 0 && (
						<>
							<Divider />
							<div className={styles.section}>
								<h3 className={styles.sectionTitle}>
									Referred Users ({referredUsers.length})
								</h3>
								<div className={styles.referralList}>
									{referredUsers.map((referredUser) => (
										<div key={referredUser.id} className={styles.referralItem}>
											<div className={styles.referralInfo}>
												<i className="ri-user-line" aria-hidden="true" />
												<div>
													<div className={styles.referralName}>
														{referredUser.email}
													</div>
												</div>
											</div>
											<Badge
												variant={getStatusVariant(referredUser.status)}
											>
												{formatStatus(referredUser.status)}
											</Badge>
										</div>
									))}
								</div>
							</div>
						</>
					)}

					{/* Rewards Earned */}
					{rewards.length > 0 && (
						<>
							<Divider />
							<div className={styles.section}>
								<h3 className={styles.sectionTitle}>
									Rewards Earned ({rewards.length})
								</h3>
								<div className={styles.rewardList}>
									{rewards.map((reward) => (
										<div key={reward.id} className={styles.rewardItem}>
											<i className="ri-gift-line" aria-hidden="true" />
											<div className={styles.rewardInfo}>
												<div className={styles.rewardStatus}>
													{reward.status.charAt(0).toUpperCase() +
														reward.status.slice(1)}
												</div>
												<div className={styles.rewardDate}>
													Earned{" "}
													{new Date(reward.earnedAt).toLocaleDateString()}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</>
					)}

					<Divider />

					{/* Actions Section */}
					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>Actions</h3>
						<div className={styles.actionsGrid}>
							{/* Update Status */}
							<div className={styles.actionItem}>
								<label className={styles.detailLabel}>Update Status</label>
								<Dropdown
									items={STATUS_OPTIONS}
									value={selectedStatus}
									placeholder="Select status"
									size="md"
									onChange={handleStatusChange}
								/>
								<Button
									variant="secondary"
									onClick={handleUpdateStatus}
									disabled={selectedStatus === user.status}
									className={styles.updateButton}
								>
									Update
								</Button>
							</div>

							{/* Send Email */}
							{onSendEmail && (
								<div className={styles.actionItem}>
									<Button
										variant="secondary"
										leftIcon="ri-mail-line"
										onClick={() => onSendEmail(userId)}
										className={styles.actionButton}
									>
										Send Email
									</Button>
								</div>
							)}

							{/* Delete User */}
							{onDelete && (
								<div className={styles.actionItem}>
									<Button
										variant="secondary"
										leftIcon="ri-delete-bin-line"
										onClick={() => setIsDeleteModalOpen(true)}
										className={styles.actionButton}
									>
										Delete User
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</Modal>

			{/* Delete confirmation modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="Delete User"
				description={`Are you sure you want to delete ${user.email}? This action cannot be undone.`}
				icon="warning"
				footer={
					<>
						<Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
							Cancel
						</Button>
						<Button variant="primary" onClick={handleDelete}>
							Delete
						</Button>
					</>
				}
			>
				{null}
			</Modal>
		</>
	);
});

UserProfile.displayName = "UserProfile";
