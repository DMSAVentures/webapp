import React from "react";
import { Caption } from "@/proto-design-system/Caption/caption.tsx";
import styles from "./hinttext.module.scss";
import "remixicon/fonts/remixicon.css";

interface HintTextProps {
	hintText: string;
	state: "default" | "error" | "disabled";
	hide?: boolean;
}
const HintText: React.FC<HintTextProps> = (props) => {
	if (props.hide) {
		return null;
	}

	const classNames = [
		styles["hint-text"],
		props.state === "error" && styles["hint-text--error"],
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={classNames}>
			<i className={`${styles["hint-text__tooltip"]} ri-information-fill`} />
			<Caption disabled={props.state === "disabled"}>
				{props.hintText}
			</Caption>
		</div>
	);
};

export default HintText;
