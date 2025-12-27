/**
 * CampaignCard Component
 * Displays campaign summary in list/grid view
 */

import {
	type HTMLAttributes,
	memo,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
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

interface MenuAction {
	onEdit?: () => void;
	onDuplicate?: () => void;
	onDelete?: () => void;
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Maps campaign status to StatusBadge variant */
function getStatusVariant(
	status: Campaign["status"],
): "completed" | "pending" | "failed" | "disabled" {
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
}

/** Converts status text to title case */
function toTitleCase(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/** Creates a standard menu item configuration */
function createMenuItem(label: string, icon: string, onClick: () => void) {
	return {
		state: "default" as const,
		size: "medium" as const,
		checkbox: false,
		label,
		badge: false,
		shortcut: false,
		toggle: false,
		button: false,
		icon,
		iconPosition: "left" as const,
		onClick,
	};
}

/** Creates a divider menu item */
function createDivider() {
	return {
		size: "thin" as const,
		text: "",
	};
}

/** Builds menu items from action handlers */
function buildMenuItems(
	actions: MenuAction | undefined,
	closeMenu: () => void,
) {
	const menuItems: ReturnType<typeof createMenuItem | typeof createDivider>[] =
		[];

	if (actions?.onEdit) {
		menuItems.push(
			createMenuItem("Edit", "ri-edit-line", () => {
				closeMenu();
				actions.onEdit?.();
			}),
		);
	}

	if (actions?.onDuplicate) {
		menuItems.push(
			createMenuItem("Duplicate", "ri-file-copy-line", () => {
				closeMenu();
				actions.onDuplicate?.();
			}),
		);
	}

	if (actions?.onDelete) {
		if (menuItems.length > 0) {
			menuItems.push(createDivider());
		}
		menuItems.push(
			createMenuItem("Delete", "ri-delete-bin-line", () => {
				closeMenu();
				actions.onDelete?.();
			}),
		);
	}

	return menuItems;
}

/** Formats campaign date for display */
function formatCampaignDate(campaign: Campaign): string {
	if (campaign.status === "completed" && campaign.endDate) {
		const dateStr = new Date(campaign.endDate).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
		return `Completed ${dateStr}`;
	}

	if (campaign.createdAt && !isNaN(new Date(campaign.createdAt).getTime())) {
		const dateStr = new Date(campaign.createdAt).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
		return `Created ${dateStr}`;
	}

	return "Created Unknown";
}

/** Calculates K-Factor from signups and referrals */
function calculateKFactor(
	totalSignups: number,
	totalReferrals: number,
): string {
	if (totalSignups === 0) return "0.0";
	return (totalReferrals / totalSignups).toFixed(1);
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for handling click outside to close menu */
function useClickOutside(
	ref: RefObject<HTMLDivElement | null>,
	isOpen: boolean,
	onClose: () => void,
) {
	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				onClose();
			}
		},
		[ref, onClose],
	);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}
	}, [isOpen, handleClickOutside]);
}

/** Hook for managing dropdown menu state */
function useDropdownMenu(actions: MenuAction | undefined) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const closeMenu = useCallback(() => setIsMenuOpen(false), []);
	const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

	useClickOutside(menuRef, isMenuOpen, closeMenu);

	const menuItems = buildMenuItems(actions, closeMenu);

	return {
		isMenuOpen,
		menuRef,
		toggleMenu,
		menuItems,
	};
}

// ============================================================================
// Component
// ============================================================================

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
	// Hooks
	const { isMenuOpen, menuRef, toggleMenu, menuItems } =
		useDropdownMenu(actions);

	// Derived state
	const hasActions =
		actions && (actions.onEdit || actions.onDuplicate || actions.onDelete);
	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

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
								toggleMenu();
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
			{showStats && campaign.totalSignups !== undefined && (
				<>
					<div className={styles.stats}>
						<div className={styles.statItem}>
							<i className="ri-user-add-line" aria-hidden="true" />
							<div className={styles.statContent}>
								<span className={styles.statValue}>
									{campaign.totalSignups.toLocaleString()}
								</span>
								<span className={styles.statLabel}>Signups</span>
							</div>
						</div>
						<div className={styles.statItem}>
							<i className="ri-share-forward-line" aria-hidden="true" />
							<div className={styles.statContent}>
								<span className={styles.statValue}>
									{campaign.totalReferrals.toLocaleString()}
								</span>
								<span className={styles.statLabel}>Referrals</span>
							</div>
						</div>
						<div className={styles.statItem}>
							<i className="ri-line-chart-line" aria-hidden="true" />
							<div className={styles.statContent}>
								<span className={styles.statValue}>
									{calculateKFactor(
										campaign.totalSignups,
										campaign.totalReferrals,
									)}
								</span>
								<span className={styles.statLabel}>K-Factor</span>
							</div>
						</div>
					</div>
				</>
			)}

			{/* Footer */}
			<div className={styles.footer}>
				<span className={styles.date}>
					<i className="ri-calendar-line" aria-hidden="true" />
					{formatCampaignDate(campaign)}
				</span>
			</div>
		</div>
	);
});

CampaignCard.displayName = "CampaignCard";
