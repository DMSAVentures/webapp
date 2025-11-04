import React from "react";
import "remixicon/fonts/remixicon.css";

import { motion } from "motion/react";
import { IconOnlyButton } from "@/components/simpleui/Button/IconOnlyButton";
import { Sidebar } from "@/components/simpleui/UIShell/Sidebar/Sidebar";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar";
import styles from "./layout.module.scss";

interface LayoutProps {
	children: React.ReactNode;
	title?: string;
}

const Header = () => {
	const { toggleSidebar } = useSidebar();
	return (
		<header className={styles.header}>
			<IconOnlyButton
				iconClass={"menu-line"}
				ariaLabel={"menu"}
				onClick={toggleSidebar}
				variant={"secondary"}
			/>
			{/*<Breadcrumb items={breadcrumbitem} divider={'arrow'}/>*/}
		</header>
	);
};

const LayoutContent = ({ children }: LayoutProps) => {
	const { isOpen } = useSidebar();
	const contentClass = `${styles.content} ${isOpen ? "" : styles["content--is-full-width"]}`;
	return (
		<motion.div
			className={styles.container}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<Sidebar />
			<main className={contentClass}>
				<Header />
				<div className={styles.scrollArea}>{children}</div>
			</main>
		</motion.div>
	);
};

// Wrapper component that provides the sidebar context
export function Layout({ children, title }: LayoutProps) {
	return (
		<SidebarProvider>
			<LayoutContent title={title}>{children}</LayoutContent>
		</SidebarProvider>
	);
}
