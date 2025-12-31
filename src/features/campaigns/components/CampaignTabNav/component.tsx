import { useLocation, useNavigate } from "@tanstack/react-router";
import {
	BarChart2,
	Code,
	FileText,
	LayoutGrid,
	Mail,
	Settings,
	User,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTier } from "@/contexts/tier";
import { Select } from "@/proto-design-system/components/forms/Select";
import {
	Tab,
	TabList,
	Tabs,
} from "@/proto-design-system/components/navigation/Tabs";
import { useIsMobile } from "@/proto-design-system/hooks/useMediaQuery";

interface TabConfig {
	id: string;
	path: string;
	label: string;
	icon: React.ReactNode;
	/** If true, requires pro tier or higher */
	requiresPro?: boolean;
}

const TABS: TabConfig[] = [
	{
		id: "overview",
		path: "",
		label: "Overview",
		icon: <LayoutGrid size={16} />,
	},
	{ id: "leads", path: "/leads", label: "Leads", icon: <User size={16} /> },
	{
		id: "analytics",
		path: "/analytics",
		label: "Analytics",
		icon: <BarChart2 size={16} />,
	},
	{
		id: "email-builder",
		path: "/email-builder",
		label: "Email",
		icon: <Mail size={16} />,
		requiresPro: true,
	},
	{
		id: "form-builder",
		path: "/form-builder",
		label: "Form",
		icon: <FileText size={16} />,
	},
	{ id: "embed", path: "/embed", label: "Embed", icon: <Code size={16} /> },
	{
		id: "settings",
		path: "/settings",
		label: "Settings",
		icon: <Settings size={16} />,
	},
];

interface CampaignTabNavProps {
	campaignId: string;
}

export function CampaignTabNav({ campaignId }: CampaignTabNavProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const { isAtLeast } = useTier();
	const isMobile = useIsMobile();

	const basePath = `/campaigns/${campaignId}`;
	const isPro = isAtLeast("pro");

	// Filter tabs based on tier
	const visibleTabs = useMemo(
		() => TABS.filter((tab) => !tab.requiresPro || isPro),
		[isPro],
	);

	// Convert tabs to select options for mobile
	const selectOptions = useMemo(
		() => visibleTabs.map((tab) => ({ value: tab.id, label: tab.label })),
		[visibleTabs],
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

	const handleSelectChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			handleTabChange(e.target.value);
		},
		[handleTabChange],
	);

	// Mobile: show dropdown
	if (isMobile) {
		return (
			<nav>
				<Select
					options={selectOptions}
					value={activeTabId}
					onChange={handleSelectChange}
					fullWidth
				/>
			</nav>
		);
	}

	// Desktop: show tabs
	return (
		<nav>
			<Tabs activeTab={activeTabId} onTabChange={handleTabChange} size={"lg"}>
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
