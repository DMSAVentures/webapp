import React, { JSX } from "react";
import { Badge } from "@/proto-design-system/badge/badge.tsx";
import Linkbutton from "@/proto-design-system/linkbutton/linkbutton.tsx";
import { Sublabel } from "@/proto-design-system/Sublabel/sublabel.tsx";
import styles from "./label.module.scss";

export interface LabelProps {
	text: string;
	subText?: string;
	badgeString?: string;
	badgeColour?:
		| "gray"
		| "blue"
		| "orange"
		| "red"
		| "green"
		| "purple"
		| "yellow"
		| "pink"
		| "sky"
		| "teal";
	disabled?: boolean;
	required?: boolean;
	linkTitle?: string;
	linkHref?: string;
}
const Label: React.FC<LabelProps> = (props): JSX.Element => {
	return (
		<div className={styles["label__container"]}>
			<span className={styles["label__string"]}>
				{props.text}
				{props.required && <sup>*</sup>}
			</span>

			{props.subText && (
				<Sublabel disabled={props.disabled}>({props.subText})</Sublabel>
			)}
			{props.badgeString && (
				<Badge
					text={props.badgeString}
					variant={props.badgeColour!}
					styleType={"filled"}
					size={"small"}
					disabled={false}
				/>
			)}
			{props.linkTitle && props.linkHref && (
				<Linkbutton
					className={styles["label__link"]}
					variant="primary"
					styleType="lighter"
					size="small"
					href={props.linkHref}
					underline={false}
				>
					{props.linkTitle}
				</Linkbutton>
			)}
		</div>
	);
};

export default Label;
