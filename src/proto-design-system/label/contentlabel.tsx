import React from "react";
import { Description } from "@/proto-design-system/Description/description.tsx";
import Label, { LabelProps } from "@/proto-design-system/label/label.tsx";
import Linkbutton from "@/proto-design-system/linkbutton/linkbutton.tsx";
import styles from "./contentlabel.module.scss";
export interface ContentLabelProps extends LabelProps {
	imageSrc?: string;
	centeredImage?: boolean;
	description: string;
	linkTitle?: string;
	linkHref?: string;
}
const ContentLabel: React.FC<ContentLabelProps> = (props) => {
	return (
		<div className={styles["content-label__container"]}>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			{props.imageSrc && (
				<img
					src={props.imageSrc}
					className={`${styles["content-label__image"]} ${props.centeredImage ? styles["content-label__image--centered"] : ""}`}
					alt={"content label image"}
				/>
			)}
			<div className={styles["content-label__text"]}>
				<Label
					text={props.text}
					subText={props.subText}
					badgeString={props.badgeString}
					badgeColour={props.badgeColour}
					disabled={props.disabled}
					required={props.required}
				/>
				<Description disabled={props.disabled}>{props.description}</Description>
				{props.linkTitle && props.linkHref && (
					<Linkbutton
						className={styles["content-label__link"]}
						variant={"primary"}
						styleType={"lighter"}
						size={"small"}
						disabled={props.disabled}
						href={props.linkHref}
						underline={false}
					>
						{props.linkTitle}
					</Linkbutton>
				)}
			</div>
		</div>
	);
};

export default ContentLabel;
