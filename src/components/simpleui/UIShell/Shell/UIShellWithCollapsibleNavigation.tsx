"use client";
import React, { ReactElement, ReactNode } from "react";
import Header from "@/components/simpleui/UIShell/Header/Header";
import { SidebarCollapsible } from "@/components/simpleui/UIShell/Sidebar/SidebarCollapsible";
import { SidebarContent } from "@/components/simpleui/UIShell/Sidebar/sidebarContent";
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
