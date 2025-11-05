import React from "react";
import {
	ToggleWithLabel,
	ToggleWithLabelProps,
} from "@/proto-design-system/Toggle/ToggleWithLabel/toggleWithLabel.tsx";
import styles from "./toggle-card.module.scss";

type ToggleCardProps = Omit<ToggleWithLabelProps, "linkTitle" | "linkHref">;

export const ToggleCard: React.FC<ToggleCardProps> = (props) => {
	return (
		<div className={styles["toggle-card__container"]}>
			<ToggleWithLabel
				disabled={props.disabled}
				text={props.text}
				badgeString={props.badgeString}
				subText={props.subText}
				description={props.description}
				flipCheckboxToRight={props.flipCheckboxToRight}
				imageSrc={props.imageSrc}
				centeredImage={props.centeredImage}
			/>
		</div>
	);
};

export default ToggleCard;
