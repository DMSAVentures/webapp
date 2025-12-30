/**
 * BulkActions Component
 * Bulk operations toolbar for selected users
 */

import { AlertTriangle, CheckSquare, Download, Mail, RefreshCw, Trash2, X } from "lucide-react";
import { type HTMLAttributes, memo, useState } from "react";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Modal } from "@/proto-design-system/components/overlays/Modal";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
import styles from "./component.module.scss";

export interface BulkActionsProps extends HTMLAttributes<HTMLDivElement> {
	/** Selected user IDs */
	selectedUserIds: string[];
	/** Action handler */
	onAction: (action: "email" | "status" | "export" | "delete") => Promise<void>;
	/** Clear selection handler */
	onClearSelection: () => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * BulkActions displays a toolbar for bulk operations on selected users
 */
export const BulkActions = memo<BulkActionsProps>(function BulkActions({
	selectedUserIds,
	onAction,
	onClearSelection,
	className: customClassName,
	...props
}) {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	const handleAction = async (
		action: "email" | "status" | "export" | "delete",
	) => {
		// Show confirmation for delete action
		if (action === "delete") {
			setIsDeleteModalOpen(true);
			return;
		}

		setIsLoading(true);
		try {
			await onAction(action);
		} catch (error) {
			console.error(`Failed to ${action}:`, error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleConfirmDelete = async () => {
		setIsLoading(true);
		try {
			await onAction("delete");
			setIsDeleteModalOpen(false);
		} catch (error) {
			console.error("Failed to delete users:", error);
		} finally {
			setIsLoading(false);
		}
	};

	if (selectedUserIds.length === 0) {
		return null;
	}

	return (
		<>
			<Stack direction="row" gap="md" align="center" className={classNames} {...props}>
				{/* Selection count */}
				<Stack direction="row" gap="sm" align="center">
					<Icon icon={CheckSquare} size="md" color="secondary" />
					<Text weight="medium">
						{selectedUserIds.length} user
						{selectedUserIds.length !== 1 ? "s" : ""} selected
					</Text>
				</Stack>

				{/* Action buttons */}
				<Stack direction="row" gap="sm">
					<Button
						variant="secondary"
						leftIcon={<Mail size={16} />}
						onClick={() => handleAction("email")}
						disabled={isLoading}
					>
						Send Email
					</Button>
					<Button
						variant="secondary"
						leftIcon={<RefreshCw size={16} />}
						onClick={() => handleAction("status")}
						disabled={isLoading}
					>
						Update Status
					</Button>
					<Button
						variant="secondary"
						leftIcon={<Download size={16} />}
						onClick={() => handleAction("export")}
						disabled={isLoading}
					>
						Export
					</Button>
					<Button
						variant="secondary"
						leftIcon={<Trash2 size={16} />}
						onClick={() => handleAction("delete")}
						disabled={isLoading}
					>
						Delete
					</Button>
				</Stack>

				{/* Clear selection */}
				<Button
					leftIcon={<X size={16} />}
					variant="secondary"
					aria-label="Clear selection"
					onClick={onClearSelection}
					disabled={isLoading}
				/>
			</Stack>

			{/* Delete confirmation modal */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="Delete Users"
				description={`Are you sure you want to delete ${selectedUserIds.length} user${selectedUserIds.length !== 1 ? "s" : ""}? This action cannot be undone.`}
				icon={<AlertTriangle />}
				footer={
					<>
						<Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isLoading}>
							Cancel
						</Button>
						<Button variant="primary" onClick={handleConfirmDelete} disabled={isLoading}>
							{isLoading ? "Deleting..." : "Delete"}
						</Button>
					</>
				}
			>
				<></>
			</Modal>
		</>
	);
});

BulkActions.displayName = "BulkActions";
