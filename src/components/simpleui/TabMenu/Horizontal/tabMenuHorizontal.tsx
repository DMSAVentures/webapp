import React, { useCallback } from "react";
import { TabMenuHorizontalItemProps } from "@/components/simpleui/TabMenu/Horizontal/tabMenuHorizontalItem";
import styles from "./tab-menu-horizontal.module.scss";

interface TabMenuHorizontalProps {
	items: React.ReactElement<TabMenuHorizontalItemProps>[];
	activeTab?: number;
	onTabClick: (index: number) => void;
}
export const TabMenuHorizontal: React.FC<TabMenuHorizontalProps> = (props) => {
	const { onTabClick } = props;
	const handleTabClick = useCallback(
		(index: number) => {
			onTabClick(index);
		},
		[onTabClick],
	);
	const itemsMemo = React.useMemo(() => props.items || [], [props.items]);
	const activeTab = props.activeTab || 0;
	return (
		<nav className={styles["tab-menu-horizontal"]}>
			<ul>
				{itemsMemo.map((item, index) => {
					return (
						<li
							className={`${styles["tab-menu-horizontal__item"]} ${activeTab === index ? styles["tab-menu-horizontal__item--active"] : ""}`}
							onClick={() => handleTabClick(index)}
							key={index}
						>
							{item}
						</li>
					);
				})}
			</ul>
		</nav>
	);
};
