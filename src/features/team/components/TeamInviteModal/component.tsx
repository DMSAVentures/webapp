/**
 * TeamInviteModal Component
 * Modal for inviting new team members
 */

import { AlertTriangle, Mail } from "lucide-react";
import { type HTMLAttributes, memo, useState } from "react";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Dropdown } from "@/proto-design-system/components/overlays/Dropdown";
import { Modal } from "@/proto-design-system/components/overlays/Modal";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import type { TeamMember } from "@/types/common.types";

type RoleOption = { id: string; label: string; description?: string };

import styles from "./component.module.scss";

export interface TeamInviteModalProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onSubmit"> {
	/** Whether the modal is open */
	isOpen: boolean;
	/** Callback when modal is closed */
	onClose: () => void;
	/** Callback when invite is submitted */
	onInvite: (data: {
		email: string;
		role: TeamMember["role"];
	}) => Promise<void>;
	/** Loading state during submission */
	loading?: boolean;
}

/**
 * Role options for the dropdown
 */
const ROLE_OPTIONS: RoleOption[] = [
	{
		id: "viewer",
		label: "Viewer",
		description: "Can view campaigns and analytics",
	},
	{
		id: "editor",
		label: "Editor",
		description: "Can edit campaigns and manage users",
	},
	{
		id: "admin",
		label: "Admin",
		description: "Full access except billing",
	},
];

/**
 * Validates email format
 */
const validateEmail = (email: string): string | null => {
	if (!email) return "Email is required";
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
	return null;
};

/**
 * TeamInviteModal allows inviting new team members
 */
export const TeamInviteModal = memo(function TeamInviteModal({
	isOpen,
	onClose,
	onInvite,
	loading = false,
	...props
}: TeamInviteModalProps) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<TeamMember["role"]>("viewer");
	const [emailError, setEmailError] = useState<string | null>(null);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Handle email change
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		setEmailError(null);
		setSubmitError(null);
	};

	// Handle role change
	const handleRoleChange = (id: string) => {
		setRole(id as TeamMember["role"]);
		setSubmitError(null);
	};

	// Handle form submission
	const handleSubmit = async () => {
		// Validate email
		const error = validateEmail(email);
		if (error) {
			setEmailError(error);
			return;
		}

		try {
			await onInvite({ email, role });
			// Reset form on success
			setEmail("");
			setRole("viewer");
			setEmailError(null);
			setSubmitError(null);
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "Failed to invite team member";
			setSubmitError(message);
		}
	};

	// Handle modal close
	const handleClose = () => {
		// Reset form
		setEmail("");
		setRole("viewer");
		setEmailError(null);
		setSubmitError(null);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Invite Team Member"
			description="Send an invitation to join your team"
			footer={
				<>
					<Button variant="secondary" onClick={handleClose} disabled={loading}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleSubmit} disabled={loading}>
						{loading ? "Sending..." : "Send Invite"}
					</Button>
				</>
			}
		>
			<div className={styles.root} {...props}>
				<div className={styles.formGroup}>
					<label className={styles.label}>Email Address</label>
					<Input
						placeholder="team@example.com"
						type="email"
						value={email}
						onChange={handleEmailChange}
						isError={!!emailError}
						disabled={loading}
						required
						leftElement={<Mail />}
					/>
					{emailError && <span className={styles.errorText}>{emailError}</span>}
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>Role</label>
					<Dropdown
						placeholder="Select a role"
						items={ROLE_OPTIONS}
						value={role}
						size="md"
						onChange={handleRoleChange}
						disabled={loading}
					/>
				</div>

				{submitError && (
					<div className={styles.error}>
						<Icon icon={AlertTriangle} size="sm" />
						{submitError}
					</div>
				)}
			</div>
		</Modal>
	);
});

TeamInviteModal.displayName = "TeamInviteModal";
