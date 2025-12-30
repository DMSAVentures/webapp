/**
 * UserProfile Component
 * User detail modal with full information and actions
 */

import { Gift, Hash, Link, Mail, Share2, Star, Trash2, User, X } from "lucide-react";
import { type HTMLAttributes, memo, useState } from "react";
import {
	Badge,
	Button,
	Divider,
	Dropdown,
	Icon,
	Modal,
	Stack,
	Text,
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
				<Stack gap="md" className={classNames} {...props}>

					{/* Header */}
					<Stack direction="row" justify="between" align="start">
						<Stack direction="row" gap="md" align="center">
							<Stack align="center" justify="center" className={styles.userAvatar}>
								<Icon icon={User} size="lg" color="muted" />
							</Stack>
							<Stack gap="xs">
								<Text as="h2" size="lg" weight="semibold">{user.email}</Text>
								<Text size="sm" color="secondary">
									{user.emailVerified ? "Verified" : "Not verified"}
								</Text>
							</Stack>
							<Badge
								variant={getStatusVariant(user.status)}
							>
								{formatStatus(user.status)}
							</Badge>
						</Stack>
						<Button
							leftIcon={<X size={16} />}
							variant="secondary"
							aria-label="Close"
							onClick={onClose}
						/>
					</Stack>

					<Divider />

					{/* Stats Grid */}
					<Stack direction="row" gap="md" wrap className={styles.statsGrid}>
						<Stack direction="row" gap="sm" align="center" className={styles.statCard}>
							<Icon icon={Hash} size="md" color="secondary" />
							<Stack gap="0">
								<Text weight="semibold">{formatPosition(user.position)}</Text>
								<Text size="xs" color="muted">Position</Text>
							</Stack>
						</Stack>
						<Stack direction="row" gap="sm" align="center" className={styles.statCard}>
							<Icon icon={Share2} size="md" color="secondary" />
							<Stack gap="0">
								<Text weight="semibold">{user.referralCount}</Text>
								<Text size="xs" color="muted">Referrals</Text>
							</Stack>
						</Stack>
						<Stack direction="row" gap="sm" align="center" className={styles.statCard}>
							<Icon icon={Star} size="md" color="secondary" />
							<Stack gap="0">
								<Text weight="semibold">{user.points}</Text>
								<Text size="xs" color="muted">Points</Text>
							</Stack>
						</Stack>
						<Stack direction="row" gap="sm" align="center" className={styles.statCard}>
							<Icon icon={Link} size="md" color="secondary" />
							<Stack gap="0">
								<Text weight="semibold">{user.source}</Text>
								<Text size="xs" color="muted">Source</Text>
							</Stack>
						</Stack>
					</Stack>

					<Divider />

					{/* Details Section */}
					<Stack gap="sm">
						<Text as="h3" size="md" weight="semibold">Details</Text>
						<Stack gap="md" className={styles.detailsGrid}>
							<Stack gap="xs">
								<Text size="xs" color="muted">Referral Code</Text>
								<Text size="sm">{user.referralCode}</Text>
							</Stack>
							{user.referredById && (
								<Stack gap="xs">
									<Text size="xs" color="muted">Referred By</Text>
									<Text size="sm">{user.referredById}</Text>
								</Stack>
							)}
							<Stack gap="xs">
								<Text size="xs" color="muted">Created At</Text>
								<Text size="sm">
									{new Date(user.createdAt).toLocaleString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
										hour: "numeric",
										minute: "2-digit",
									})}
								</Text>
							</Stack>
						</Stack>
					</Stack>

					{/* UTM Parameters */}
					{(user.utmSource ||
						user.utmMedium ||
						user.utmCampaign ||
						user.utmContent ||
						user.utmTerm) && (
						<>
							<Divider />
							<Stack gap="sm">
								<Text as="h3" size="md" weight="semibold">UTM Parameters</Text>
								<Stack gap="md" className={styles.detailsGrid}>
									{user.utmSource && (
										<Stack gap="xs">
											<Text size="xs" color="muted">Source</Text>
											<Text size="sm">{user.utmSource}</Text>
										</Stack>
									)}
									{user.utmMedium && (
										<Stack gap="xs">
											<Text size="xs" color="muted">Medium</Text>
											<Text size="sm">{user.utmMedium}</Text>
										</Stack>
									)}
									{user.utmCampaign && (
										<Stack gap="xs">
											<Text size="xs" color="muted">Campaign</Text>
											<Text size="sm">{user.utmCampaign}</Text>
										</Stack>
									)}
									{user.utmContent && (
										<Stack gap="xs">
											<Text size="xs" color="muted">Content</Text>
											<Text size="sm">{user.utmContent}</Text>
										</Stack>
									)}
									{user.utmTerm && (
										<Stack gap="xs">
											<Text size="xs" color="muted">Term</Text>
											<Text size="sm">{user.utmTerm}</Text>
										</Stack>
									)}
								</Stack>
							</Stack>
						</>
					)}

					{/* Referral Tree */}
					{referredUsers.length > 0 && (
						<>
							<Divider />
							<Stack gap="sm">
								<Text as="h3" size="md" weight="semibold">
									Referred Users ({referredUsers.length})
								</Text>
								<Stack gap="sm" className={styles.referralList}>
									{referredUsers.map((referredUser) => (
										<Stack key={referredUser.id} direction="row" justify="between" align="center" className={styles.referralItem}>
											<Stack direction="row" gap="sm" align="center">
												<Icon icon={User} size="sm" color="muted" />
												<Text size="sm">{referredUser.email}</Text>
											</Stack>
											<Badge
												variant={getStatusVariant(referredUser.status)}
											>
												{formatStatus(referredUser.status)}
											</Badge>
										</Stack>
									))}
								</Stack>
							</Stack>
						</>
					)}

					{/* Rewards Earned */}
					{rewards.length > 0 && (
						<>
							<Divider />
							<Stack gap="sm">
								<Text as="h3" size="md" weight="semibold">
									Rewards Earned ({rewards.length})
								</Text>
								<Stack gap="sm" className={styles.rewardList}>
									{rewards.map((reward) => (
										<Stack key={reward.id} direction="row" gap="sm" align="center" className={styles.rewardItem}>
											<Icon icon={Gift} size="md" color="secondary" />
											<Stack gap="0">
												<Text size="sm" weight="medium">
													{reward.status.charAt(0).toUpperCase() +
														reward.status.slice(1)}
												</Text>
												<Text size="xs" color="muted">
													Earned{" "}
													{new Date(reward.earnedAt).toLocaleDateString()}
												</Text>
											</Stack>
										</Stack>
									))}
								</Stack>
							</Stack>
						</>
					)}

					<Divider />

					{/* Actions Section */}
					<Stack gap="sm">
						<Text as="h3" size="md" weight="semibold">Actions</Text>
						<Stack gap="md" className={styles.actionsGrid}>
							{/* Update Status */}
							<Stack gap="xs">
								<Text size="xs" color="muted">Update Status</Text>
								<Stack direction="row" gap="sm" align="center">
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
									>
										Update
									</Button>
								</Stack>
							</Stack>

							{/* Send Email */}
							{onSendEmail && (
								<Button
									variant="secondary"
									leftIcon={<Mail size={16} />}
									onClick={() => onSendEmail(userId)}
								>
									Send Email
								</Button>
							)}

							{/* Delete User */}
							{onDelete && (
								<Button
									variant="secondary"
									leftIcon={<Trash2 size={16} />}
									onClick={() => setIsDeleteModalOpen(true)}
								>
									Delete User
								</Button>
							)}
						</Stack>
					</Stack>
				</Stack>
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
