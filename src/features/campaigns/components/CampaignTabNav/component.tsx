import { useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { TabMenuHorizontal } from "@/proto-design-system/TabMenu/Horizontal/tabMenuHorizontal";
import { TabMenuHorizontalItem } from "@/proto-design-system/TabMenu/Horizontal/tabMenuHorizontalItem";
import styles from "./component.module.scss";

interface Tab {
	path: string;
	label: string;
	icon: string;
}

const TABS: Tab[] = [
	{ path: "", label: "Overview", icon: "ri-layout-grid-line" },
	{ path: "/leads", label: "Leads", icon: "ri-user-line" },
	{ path: "/analytics", label: "Analytics", icon: "ri-bar-chart-2-line" },
	{ path: "/email-builder", label: "Email", icon: "ri-mail-line" },
	{ path: "/form-builder", label: "Form", icon: "ri-survey-line" },
	{ path: "/embed", label: "Embed", icon: "ri-code-s-slash-line" },
	{ path: "/settings", label: "Settings", icon: "ri-settings-3-line" },
];

interface CampaignTabNavProps {
	campaignId: string;
}

export function CampaignTabNav({ campaignId }: CampaignTabNavProps) {
	const location = useLocation();
	const navigate = useNavigate();

	const basePath = `/campaigns/${campaignId}`;

	// Determine active tab based on current pathname
	const activeTabIndex = useMemo(() => {
		const currentPath = location.pathname;

		// Check each tab in reverse order (most specific first)
		for (let i = TABS.length - 1; i >= 0; i--) {
			const tab = TABS[i];
			const fullPath = `${basePath}${tab.path}`;
			if (currentPath === fullPath || currentPath.startsWith(`${fullPath}/`)) {
				return i;
			}
		}
		// Default to overview tab
		return 0;
	}, [location.pathname, basePath]);

	const handleTabClick = useCallback(
		(index: number) => {
			const tab = TABS[index];
			const targetPath = `${basePath}${tab.path}`;
			navigate({ to: targetPath });
		},
		[navigate, basePath],
	);

	const tabItems = useMemo(
		() =>
			TABS.map((tab, index) => (
				<TabMenuHorizontalItem
					key={tab.path || "overview"}
					active={index === activeTabIndex}
					leftIcon={tab.icon}
					text={tab.label}
				/>
			)),
		[activeTabIndex],
	);

	return (
		<nav className={styles.tabNav}>
			<TabMenuHorizontal
				items={tabItems}
				activeTab={activeTabIndex}
				onTabClick={handleTabClick}
			/>
		</nav>
	);
}
