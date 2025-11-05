import React from "react";
import RadioWithLabel, {
	RadioWithLabelProps,
} from "@/proto-design-system/radiobutton/radioWithLabel.tsx";
import styles from "./radiocard.module.scss";

type RadioCardProps = Omit<RadioWithLabelProps, "linkTitle" | "linkHref">;

const RadioCard: React.FC<RadioCardProps> = (props) => {
	return (
		<div className={styles["radio-card__container"]}>
			<RadioWithLabel {...props} flipRadioToRight={true} />
		</div>
	);
};

export default RadioCard;
