import React from "react";
import CheckboxWithLabel, {
	CheckboxWithLabelProps,
} from "@/proto-design-system/checkbox/checkboxWithLabel.tsx";
import styles from "./checkboxcard.module.scss";

type CheckboxCardProps = Omit<CheckboxWithLabelProps, "linkTitle" | "linkHref">;

const CheckboxCard: React.FC<CheckboxCardProps> = (props) => {
	return (
		<div className={styles["checkbox-card__container"]}>
			<CheckboxWithLabel
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

export default CheckboxCard;
