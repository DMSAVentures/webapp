import React from "react";
import "remixicon/fonts/remixicon.css";

import { Home, Settings, Users, Mail, BarChart, Webhook, Key, CreditCard, User } from "lucide-react";
import { motion } from "motion/react";
import { GlobalBannerContainer } from "@/components/GlobalBannerContainer/component";
import UserName from "@/components/user/Username";
import { usePersona } from "@/contexts/persona";
import { Sidebar, SidebarProvider, SidebarHeader, SidebarLogo, SidebarToggle, SidebarSection, SidebarItem, SidebarDivider, SidebarMobileTrigger } from "@/proto-design-system/components/navigation/Sidebar";
import styles from "./layout.module.scss";

interface LayoutProps {
	children: React.ReactNode;
	title?: string;
}

// Map icon names to Lucide icons
const iconMap: Record<string, React.ReactNode> = {
	"home-line": <Home size={18} />,
	"settings-line": <Settings size={18} />,
	"user-line": <User size={18} />,
	"team-line": <Users size={18} />,
	"mail-line": <Mail size={18} />,
	"bar-chart-line": <BarChart size={18} />,
	"webhook-line": <Webhook size={18} />,
	"key-2-line": <Key size={18} />,
	"bank-card-line": <CreditCard size={18} />,
};

const getIcon = (iconClass?: string) => {
	if (!iconClass) return null;
	return iconMap[iconClass] || <i className={`ri-${iconClass}`} />;
};

const AppSidebar = () => {
	const { getNavigationGroups } = usePersona();
	const navigationGroups = getNavigationGroups();

	return (
		<Sidebar responsive>
			<SidebarHeader>
				<SidebarLogo>DMSA Ventures</SidebarLogo>
				<SidebarToggle />
			</SidebarHeader>

			{navigationGroups.map((group) => (
				<SidebarSection key={group.label} title={group.label}>
					{group.items.map((item) => (
						<SidebarItem
							key={item.href}
							icon={getIcon(item.iconClass)}
							href={item.href}
							active={typeof window !== "undefined" && window.location.pathname === item.href}
						>
							{item.label}
						</SidebarItem>
					))}
				</SidebarSection>
			))}

			<SidebarDivider />

			<SidebarSection title="Settings">
				<SidebarItem icon={<User size={18} />} href="/account">
					Account
				</SidebarItem>
				<SidebarItem icon={<CreditCard size={18} />} href="/billing">
					Billing
				</SidebarItem>
			</SidebarSection>

			<div style={{ marginTop: "auto", padding: "1rem" }}>
				<UserName />
			</div>
		</Sidebar>
	);
};

const Header = () => {
	return (
		<header className={styles.header}>
			<SidebarMobileTrigger />
		</header>
	);
};

export function Layout({ children }: LayoutProps) {
	return (
		<SidebarProvider responsive>
			<motion.div
				className={styles.container}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<AppSidebar />
				<main className={styles.content}>
					<Header />
					<GlobalBannerContainer />
					<div className={styles.scrollArea}>{children}</div>
				</main>
			</motion.div>
		</SidebarProvider>
	);
}
