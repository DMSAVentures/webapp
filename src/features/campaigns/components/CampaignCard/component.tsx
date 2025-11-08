/**
 * CampaignCard Component
 * Displays campaign summary in list/grid view
 */

import {
	type HTMLAttributes,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";
import DropdownMenu from "@/proto-design-system/dropdownmenu/dropdownmenu";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";
import type { Campaign } from "@/types/campaign";
import styles from "./component.module.scss";

export interface CampaignCardProps extends HTMLAttributes<HTMLDivElement> {
	/** Campaign data to display */
	campaign: Campaign;
	/** Show statistics in the card */
	showStats?: boolean;
	/** Action handlers */
	actions?: {
		onEdit?: () => void;
		onDuplicate?: () => void;
		onDelete?: () => void;
	};
	/** Additional CSS class name */
	className?: string;
}

/**
 * Maps campaign status to StatusBadge variant
 */
const getStatusVariant = (
	status: Campaign["status"],
): "completed" | "pending" | "failed" | "disabled" => {
	switch (status) {
		case "active":
			return "completed";
		case "draft":
			return "pending";
		case "paused":
			return "disabled";
		case "completed":
			return "completed";
		default:
			return "pending";
	}
};

/**
 * Converts status text to title case
 */
const toTitleCase = (text: string): string => {
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * CampaignCard displays a summary of a campaign
 */
export const CampaignCard = memo<CampaignCardProps>(function CampaignCard({
	campaign,
	showStats = false,
	actions,
	className: customClassName,
	onClick,
	...props
}) {
	const hasActions =
		actions && (actions.onEdit || actions.onDuplicate || actions.onDelete);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Close menu on click outside
	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
			setIsMenuOpen(false);
		}
	}, []);

	useEffect(() => {
		if (isMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}
	}, [isMenuOpen, handleClickOutside]);

	// Build menu items
	const menuItems = [];
	if (actions?.onEdit) {
		menuItems.push({
			state: "default" as const,
			size: "medium" as const,
			checkbox: false,
			label: "Edit",
			badge: false,
			shortcut: false,
			toggle: false,
			button: false,
			icon: "ri-edit-line",
			iconPosition: "left" as const,
			onClick: () => {
				setIsMenuOpen(false);
				actions.onEdit?.();
			},
		});
	}
	if (actions?.onDuplicate) {
		menuItems.push({
			state: "default" as const,
			size: "medium" as const,
			checkbox: false,
			label: "Duplicate",
			badge: false,
			shortcut: false,
			toggle: false,
			button: false,
			icon: "ri-file-copy-line",
			iconPosition: "left" as const,
			onClick: () => {
				setIsMenuOpen(false);
				actions.onDuplicate?.();
			},
		});
	}
	if (actions?.onDelete) {
		if (menuItems.length > 0) {
			menuItems.push({
				size: "thin" as const,
				text: "",
			});
		}
		menuItems.push({
			state: "default" as const,
			size: "medium" as const,
			checkbox: false,
			label: "Delete",
			badge: false,
			shortcut: false,
			toggle: false,
			button: false,
			icon: "ri-delete-bin-line",
			iconPosition: "left" as const,
			onClick: () => {
				setIsMenuOpen(false);
				actions.onDelete?.();
			},
		});
	}

	return (
		<div
			className={classNames}
			onClick={onClick}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
			{...props}
		>
			{/* Header */}
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<h3 className={styles.title}>{campaign.name}</h3>
					<StatusBadge
						text={toTitleCase(campaign.status)}
						variant={getStatusVariant(campaign.status)}
						styleType="stroke"
					/>
				</div>

				{/* Action Menu */}
				{hasActions && (
					<div className={styles.actions} ref={menuRef}>
						<IconOnlyButton
							iconClass="more-2-fill"
							variant="secondary"
							ariaLabel="More actions"
							onClick={(e) => {
								e.stopPropagation();
								setIsMenuOpen(!isMenuOpen);
							}}
						/>
						{isMenuOpen && (
							<div className={styles.actionMenu}>
								<DropdownMenu items={menuItems} />
							</div>
						)}
					</div>
				)}
			</div>

			{/* Description */}
			{campaign.description && (
				<p className={styles.description}>{campaign.description}</p>
			)}

			{/* Stats */}
			{showStats && campaign.total_signups !== undefined && (
				<>
					<ContentDivider size="thin" />
					<div className={styles.stats}>
						<div className={styles.statItem}>
							<i className="ri-user-add-line" aria-hidden="true" />
							<div className={styles.statContent}>
								<span className={styles.statValue}>
									{campaign.total_signups.toLocaleString()}
								</span>
								<span className={styles.statLabel}>Signups</span>
							</div>
						</div>
						<div className={styles.statItem}>
							<i className="ri-share-forward-line" aria-hidden="true" />
							<div className={styles.statContent}>
								<span className={styles.statValue}>
									{campaign.total_referrals.toLocaleString()}
								</span>
								<span className={styles.statLabel}>Referrals</span>
							</div>
						</div>
						<div className={styles.statItem}>
							<i className="ri-line-chart-line" aria-hidden="true" />
							<div className={styles.statContent}>
								<span className={styles.statValue}>
									{campaign.total_signups > 0
										? (campaign.total_referrals / campaign.total_signups).toFixed(1)
										: "0.0"}
								</span>
								<span className={styles.statLabel}>K-Factor</span>
							</div>
						</div>
					</div>
				</>
			)}

			{/* Footer */}
			<ContentDivider size="thin" />
			<div className={styles.footer}>
				<span className={styles.date}>
					<i className="ri-calendar-line" aria-hidden="true" />
					{campaign.status === "completed" && campaign.end_date ? (
						<>
							Completed{" "}
							{new Date(campaign.end_date).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</>
					) : campaign.created_at && !isNaN(new Date(campaign.created_at).getTime()) ? (
						<>
							Created{" "}
							{new Date(campaign.created_at).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</>
					) : (
						<>Created Unknown</>
					)}
				</span>
			</div>
		</div>
	);
});

CampaignCard.displayName = "CampaignCard";
