import { useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import {
	LayoutGrid,
	User,
	BarChart2,
	Mail,
	Users,
	Send,
	FileText,
	Code,
	Settings,
} from "lucide-react";
import { useTier } from "@/contexts/tier";
import { Tabs, TabList, Tab } from "@/proto-design-system/components/navigation/Tabs";
import styles from "./component.module.scss";

interface TabConfig {
	id: string;
	path: string;
	label: string;
	icon: React.ReactNode;
	/** If true, requires pro tier or higher */
	requiresPro?: boolean;
}

const TABS: TabConfig[] = [
	{ id: "overview", path: "", label: "Overview", icon: <LayoutGrid size={16} /> },
	{ id: "leads", path: "/leads", label: "Leads", icon: <User size={16} /> },
	{ id: "analytics", path: "/analytics", label: "Analytics", icon: <BarChart2 size={16} /> },
	{
		id: "email-builder",
		path: "/email-builder",
		label: "Email",
		icon: <Mail size={16} />,
		requiresPro: true,
	},
	{
		id: "segments",
		path: "/segments",
		label: "Segments",
		icon: <Users size={16} />,
		requiresPro: true,
	},
	{
		id: "blasts",
		path: "/blasts",
		label: "Blasts",
		icon: <Send size={16} />,
		requiresPro: true,
	},
	{ id: "form-builder", path: "/form-builder", label: "Form", icon: <FileText size={16} /> },
	{ id: "embed", path: "/embed", label: "Embed", icon: <Code size={16} /> },
	{ id: "settings", path: "/settings", label: "Settings", icon: <Settings size={16} /> },
];

interface CampaignTabNavProps {
	campaignId: string;
}

export function CampaignTabNav({ campaignId }: CampaignTabNavProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const { isAtLeast } = useTier();

	const basePath = `/campaigns/${campaignId}`;
	const isPro = isAtLeast("pro");

	// Filter tabs based on tier
	const visibleTabs = useMemo(
		() => TABS.filter((tab) => !tab.requiresPro || isPro),
		[isPro],
	);

	// Determine active tab ID based on current pathname
	const activeTabId = useMemo(() => {
		const currentPath = location.pathname;

		// Check each tab in reverse order (most specific first)
		for (let i = visibleTabs.length - 1; i >= 0; i--) {
			const tab = visibleTabs[i];
			const fullPath = `${basePath}${tab.path}`;
			if (currentPath === fullPath || currentPath.startsWith(`${fullPath}/`)) {
				return tab.id;
			}
		}
		// Default to overview tab
		return "overview";
	}, [location.pathname, basePath, visibleTabs]);

	const handleTabChange = useCallback(
		(tabId: string) => {
			const tab = visibleTabs.find((t) => t.id === tabId);
			if (tab) {
				const targetPath = `${basePath}${tab.path}`;
				navigate({ to: targetPath });
			}
		},
		[navigate, basePath, visibleTabs],
	);

	return (
		<nav className={styles.tabNav}>
			<Tabs activeTab={activeTabId} onTabChange={handleTabChange}>
				<TabList>
					{visibleTabs.map((tab) => (
						<Tab key={tab.id} id={tab.id} icon={tab.icon}>
							{tab.label}
						</Tab>
					))}
				</TabList>
			</Tabs>
		</nav>
	);
}
