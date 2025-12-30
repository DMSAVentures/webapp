/**
 * CampaignCard Component
 * Displays campaign summary in list/grid view
 */

import {
	type HTMLAttributes,
	type ReactNode,
	memo,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Calendar, Copy, LineChart, MoreHorizontal, Pencil, Share2, Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { DropdownMenu } from "@/proto-design-system/components/overlays/DropdownMenu";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
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

/** Maps campaign status to Badge variant */
function getStatusVariant(
	status: Campaign["status"],
): "success" | "warning" | "secondary" | "primary" {
	switch (status) {
		case "active":
			return "success";
		case "draft":
			return "warning";
		case "paused":
			return "secondary";
		case "completed":
			return "primary";
		default:
			return "secondary";
	}
}

/** Converts status text to title case */
function toTitleCase(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/** Creates a standard menu item configuration */
function createMenuItem(
	id: string,
	label: string,
	leftIcon: ReactNode,
	onClick: () => void,
) {
	return {
		id,
		label,
		leftIcon,
		onClick,
	};
}

/** Creates a divider menu item */
function createDivider() {
	return {
		type: "divider" as const,
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
			createMenuItem("edit", "Edit", <Pencil size={16} />, () => {
				closeMenu();
				actions.onEdit?.();
			}),
		);
	}

	if (actions?.onDuplicate) {
		menuItems.push(
			createMenuItem("duplicate", "Duplicate", <Copy size={16} />, () => {
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
			createMenuItem("delete", "Delete", <Trash2 size={16} />, () => {
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
			<Stack gap="md">
				{/* Header */}
				<Stack direction="row" justify="between" align="start">
					<Stack direction="row" gap="sm" align="center" className={styles.headerContent}>
						<Text as="h3" size="md" weight="semibold">{campaign.name}</Text>
						<Badge variant={getStatusVariant(campaign.status)}>
							{toTitleCase(campaign.status)}
						</Badge>
					</Stack>

					{/* Action Menu */}
					{hasActions && (
						<div className={styles.actions} ref={menuRef}>
							<Button
								variant="ghost"
								size="sm"
								aria-label="More actions"
								onClick={(e) => {
									e.stopPropagation();
									toggleMenu();
								}}
							>
								<MoreHorizontal size={16} />
							</Button>
							{isMenuOpen && (
								<div className={styles.actionMenu}>
									<DropdownMenu items={menuItems} />
								</div>
							)}
						</div>
					)}
				</Stack>

				{/* Description */}
				{campaign.description && (
					<Text size="sm" color="muted" className={styles.description}>
						{campaign.description}
					</Text>
				)}

				{/* Stats */}
				{showStats && campaign.totalSignups !== undefined && (
					<Stack direction="row" gap="lg" className={styles.stats}>
						<Stack direction="row" gap="xs" align="center">
							<Icon icon={UserPlus} size="sm" color="muted" />
							<Stack gap="0">
								<Text size="sm" weight="semibold">{campaign.totalSignups.toLocaleString()}</Text>
								<Text size="xs" color="muted">Signups</Text>
							</Stack>
						</Stack>
						<Stack direction="row" gap="xs" align="center">
							<Icon icon={Share2} size="sm" color="muted" />
							<Stack gap="0">
								<Text size="sm" weight="semibold">{campaign.totalReferrals.toLocaleString()}</Text>
								<Text size="xs" color="muted">Referrals</Text>
							</Stack>
						</Stack>
						<Stack direction="row" gap="xs" align="center">
							<Icon icon={LineChart} size="sm" color="muted" />
							<Stack gap="0">
								<Text size="sm" weight="semibold">
									{calculateKFactor(campaign.totalSignups, campaign.totalReferrals)}
								</Text>
								<Text size="xs" color="muted">K-Factor</Text>
							</Stack>
						</Stack>
					</Stack>
				)}

				{/* Footer */}
				<Stack direction="row" gap="xs" align="center" className={styles.footer}>
					<Icon icon={Calendar} size="sm" color="muted" />
					<Text size="xs" color="muted">{formatCampaignDate(campaign)}</Text>
				</Stack>
			</Stack>
		</div>
	);
});

CampaignCard.displayName = "CampaignCard";
