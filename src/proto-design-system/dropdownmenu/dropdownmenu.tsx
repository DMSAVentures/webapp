import React from "react";
import styles from "./dropdownmenu.module.scss";
import "remixicon/fonts/remixicon.css";
import ContentDivider, {
	ContentDividerProps,
} from "@/proto-design-system/contentdivider/contentdivider.tsx";

interface DropdownMenuItemProps {
	state: "default" | "active" | "disabled";
	size: "small" | "medium" | "large";
	checkbox: boolean;
	label: string;
	sublabel?: string;
	badge: boolean;
	shortcut: boolean;
	toggle: boolean;
	button: boolean;
	icon?: string;
	iconPosition: "left" | "right";
	onClick: () => void;
}

//TODO: Add Avatar as one of the props
type MenuItems = DropdownMenuItemProps | ContentDividerProps;
interface DropdownMenuProps {
	items: MenuItems[];
	bottomButton?: React.ReactNode;
	caption?: string;
}

function isMenuItemsContentDivider(
	props: MenuItems,
): props is ContentDividerProps {
	return (
		("size" in props && "text" in props) ||
		("styleType" in props && "text" in props)
	);
}
const DropdownMenu: React.FC<DropdownMenuProps> = (props) => {
	return (
		<div className={styles["dropdown-menu"]}>
			{props.items.map((item, index) => {
				if (isMenuItemsContentDivider(item)) {
					return <ContentDivider key={index} {...item} />;
				} else {
					return (
						<div
							key={index}
							className={`${styles["dropdown-menu__item"]} ${styles[`dropdown-menu__item--${item.size}`]} ${styles[`dropdown-menu__item--${item.state}`]} ${item.checkbox ? styles["dropdown-menu__item--checkbox"] : ""} ${item.badge ? styles["dropdown-menu__item--badge"] : ""} ${item.shortcut ? styles["dropdown-menu__item--shortcut"] : ""} ${item.toggle ? styles["dropdown-menu__item--toggle"] : ""} ${item.button ? styles["dropdown-menu__item--button"] : ""}`}
						>
							{item.icon && item.iconPosition === "left" && (
								<i
									className={`${styles["dropdown-menu__icon"]} ${styles["dropdown-menu__icon--left"]} ${item.icon}`}
								/>
							)}
							<div className={styles["dropdown-menu__label"]}>{item.label}</div>
							{item.sublabel && (
								<div className={styles["dropdown-menu__sublabel"]}>
									{item.sublabel}
								</div>
							)}
							{item.icon && item.iconPosition === "right" && (
								<i
									className={`${styles["dropdown-menu__icon"]} ${styles["dropdown-menu__icon--right"]} ${item.icon}`}
								/>
							)}
						</div>
					);
				}
			})}
			{props.bottomButton ? props.bottomButton : null}
			{props.caption && (
				<div className={styles["dropdown-menu__caption"]}>{props.caption}</div>
			)}
		</div>
	);
};

export default DropdownMenu;
