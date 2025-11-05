import React from "react";
import styles from "./breadcrumbitem.module.scss";
import "remixicon/fonts/remixicon.css";
interface BreadcrumbItemWithTextProps {
	state: "default" | "active" | "disabled";
	path?: string;
	children: string;
}

// interface BreadcrumbItemWithIconProps {
//     state: 'default' | 'active' | 'disabled';
//     icon: string
//     onClick?: () => void;
// }

interface BreadcrumbItemWithTextAndIconProps {
	state: "default" | "active" | "disabled";
	icon?: string;
	path?: string;
	children: string;
}

export type BreadcrumbItemProps =
	| BreadcrumbItemWithTextProps
	| BreadcrumbItemWithTextAndIconProps;
const BreadcrumbItem: React.FC<BreadcrumbItemProps> = (props) => {
	const { state } = props;
	return (
		<div
			className={`${styles["breadcrumb-item"]} ${styles[`breadcrumb-item--${state}`]}`}
		>
			{"icon" in props && (
				<i className={`${styles["breadcrumb-item__icon"]} ${props.icon}`} />
			)}
			{"children" in props && (
				<span className={styles["breadcrumb-item__text"]}>
					{props.children}
				</span>
			)}
		</div>
	);
};

export default BreadcrumbItem;
