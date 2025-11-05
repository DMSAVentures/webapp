"use client";
import React, { ReactElement, ReactNode } from "react";
import Header from "@/proto-design-system/UIShell/Header/Header.tsx";
import { SidebarCollapsible } from "@/proto-design-system/UIShell/Sidebar/SidebarCollapsible.tsx";
import { SidebarContent } from "@/proto-design-system/UIShell/Sidebar/sidebarContent.tsx";
import styles from "./shell.module.scss";

interface UIShellWithCollapsibleNavigationProps {
	children: [ReactElement<typeof SidebarContent>, ...ReactNode[]];
}

export const UIShellWithCollapsibleNavigation: React.FC<
	UIShellWithCollapsibleNavigationProps
> = (props: UIShellWithCollapsibleNavigationProps) => {
	const [isLeftNavOpen, setIsLeftNavOpen] = React.useState(false);
	const toggleLeftNav = () => {
		setIsLeftNavOpen((prevState) => !prevState);
	};
	return (
		<div className={styles.shell}>
			<SidebarCollapsible isOpen={isLeftNavOpen}>
				{props.children[0]}
			</SidebarCollapsible>
			<div className={styles["shell-container"]}>
				<Header isLeftNavOpen={isLeftNavOpen} toggleLeftNav={toggleLeftNav} />
				<div className={styles["grid-wide"]}>{props.children.slice(1)}</div>
			</div>
		</div>
	);
};
