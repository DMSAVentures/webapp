import React from "react";
import RadioWithLabel, {
	RadioWithLabelProps,
} from "@/components/simpleui/radiobutton/radioWithLabel";
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
