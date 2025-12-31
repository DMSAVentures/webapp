import {
	BarChart,
	CreditCard,
	Filter,
	HelpCircle,
	Home,
	LogOut,
	Mail,
	Megaphone,
	Plug,
	Send,
	Settings,
	User,
	Users,
	Webhook,
} from "lucide-react";
import React, { memo } from "react";
import UserName from "@/components/user/Username";
import { usePersona } from "@/contexts/persona";
import {
	Sidebar,
	SidebarDivider,
	SidebarHeader,
	SidebarItem,
	SidebarLogo,
	SidebarMobileTrigger,
	SidebarSection,
	SidebarToggle,
} from "@/proto-design-system/components/navigation/Sidebar";
import styles from "./layout.module.scss";

interface LayoutProps {
	children: React.ReactNode;
}

// Map icon names to Lucide icons
const iconMap: Record<string, React.ReactNode> = {
	"home-line": <Home size={18} />,
	"settings-line": <Settings size={18} />,
	"user-line": <User size={18} />,
	"team-line": <Users size={18} />,
	"bar-chart-line": <BarChart size={18} />,
	"bank-card-line": <CreditCard size={18} />,
	"megaphone-line": <Megaphone size={18} />,
	"mail-line": <Mail size={18} />,
	"webhook-line": <Webhook size={18} />,
	"plug-line": <Plug size={18} />,
	"filter-line": <Filter size={18} />,
	"send-line": <Send size={18} />,
};

const getIcon = (iconClass?: string) => {
	if (!iconClass) return null;
	return iconMap[iconClass] || null;
};

const AppSidebar = memo(function AppSidebar() {
	const { getNavigationGroups } = usePersona();
	const navigationGroups = getNavigationGroups();

	return (
		<Sidebar>
			<SidebarHeader>
				<SidebarLogo>LaunchCamp</SidebarLogo>
				<SidebarToggle />
			</SidebarHeader>

			{navigationGroups.map((group) => (
				<SidebarSection key={group.label} title={group.label}>
					{group.items.map((item) => (
						<SidebarItem
							key={item.href}
							icon={getIcon(item.iconClass)}
							href={item.href}
							active={
								typeof window !== "undefined" &&
								window.location.pathname === item.href
							}
						>
							{item.label}
						</SidebarItem>
					))}
				</SidebarSection>
			))}

			<SidebarDivider />

			<SidebarSection title="Settings">
				<SidebarItem icon={<Settings size={18} />} href="/account">
					Settings
				</SidebarItem>
				<SidebarItem icon={<HelpCircle size={18} />} href="/help">
					Help
				</SidebarItem>
				<SidebarItem icon={<LogOut size={18} />} href="/signout">
					Log out
				</SidebarItem>
			</SidebarSection>

			<div style={{ marginTop: "auto", padding: "1rem" }}>
				<UserName />
			</div>
		</Sidebar>
	);
});

export const Layout = memo(function Layout({ children }: LayoutProps) {
	return (
		<div className={styles.container}>
			<AppSidebar />
			<div className={styles.content}>
				<header className={styles.header}>
					<SidebarMobileTrigger />
				</header>
				<main className={styles.main}>{children}</main>
			</div>
		</div>
	);
});
