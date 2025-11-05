import React, { HTMLAttributes, useState } from "react";
import styles from "./feedback.module.scss";
import "remixicon/fonts/remixicon.css";
import Linkbutton from "@/proto-design-system/linkbutton/linkbutton.tsx";

function isDetailedFeedbackProps(
	props: SimpleFeedbackProps | DetailedFeedbackProps,
): props is DetailedFeedbackProps {
	return "alertDescription" in props && props.alertDescription != "";
}

interface SimpleFeedbackProps extends HTMLAttributes<HTMLElement> {
	feedbackType: "success" | "error" | "warning" | "info" | "feature";
	variant: "filled" | "light" | "lighter" | "stroke";
	size: "small" | "x-small";
	dismissable?: boolean;
	alertTitle: string;
	linkTitle?: string;
	linkHref?: string;
}
interface DetailedFeedbackProps extends HTMLAttributes<HTMLElement> {
	feedbackType: "success" | "error" | "warning" | "info" | "feature";
	variant: "filled" | "light" | "lighter" | "stroke";
	size: "large";
	dismissable?: boolean;
	alertTitle: string;
	alertDescription: string;
	linkTitle?: string;
	linkHref?: string;
	secondaryLinkTitle?: string;
	secondaryLinkHref?: string;
}

function getIconBasedOnFeedbackType(feedbackType: string) {
	switch (feedbackType) {
		case "success":
			return (
				<i
					className={`${styles["feedback__icon"]} ri-checkbox-circle-fill`}
				></i>
			);
		case "error":
			return (
				<i
					className={`${styles["feedback__icon"]} ri-checkbox-circle-fill`}
				></i>
			);
		case "warning":
			return <i className={`${styles["feedback__icon"]} ri-alert-fill`}></i>;
		case "info":
			return (
				<i
					className={`${styles["feedback__icon"]} ri-checkbox-circle-fill`}
				></i>
			);
		case "feature":
			return <i className={`${styles["feedback__icon"]} ri-magic-fill`}></i>;
		default:
			return (
				<i
					className={`${styles["feedback__icon"]} ri-checkbox-circle-fill`}
				></i>
			);
	}
}

const SimpleFeedback: React.FC<SimpleFeedbackProps> = (props) => {
	const [visible, setVisible] = useState(true);

	if (!visible) return null;
	const feedbackIcon = getIconBasedOnFeedbackType(props.feedbackType);
	return (
		<div
			className={`${styles.feedback} ${styles[`feedback--${props.size}`]} ${styles[`feedback--${props.variant}`]} ${styles[`feedback--${props.feedbackType}`]}`}
		>
			{feedbackIcon}
			<div className={styles["feedback__title"]}>{props.alertTitle}</div>
			{props.linkTitle && (
				<Linkbutton
					variant={props.variant == "filled" ? "gray" : "neutral"}
					size={props.size == "small" ? "medium" : "small"}
					styleType={"lighter"}
					href={props.linkHref!}
					underline={true}
				>
					{props.linkTitle}
				</Linkbutton>
			)}
			{props.dismissable && (
				<i
					className={`${styles["feedback__dismiss"]} ri-close-fill`}
					onClick={() => setVisible(false)}
				/>
			)}
		</div>
	);
};

const DetailedFeedback: React.FC<DetailedFeedbackProps> = (props) => {
	const [visible, setVisible] = useState(true);

	if (!visible) return null;
	const feedbackIcon = getIconBasedOnFeedbackType(props.feedbackType);
	return (
		<div
			className={`${styles.feedback} ${styles[`feedback--${props.size}`]} ${styles[`feedback--${props.variant}`]} ${styles[`feedback--${props.feedbackType}`]}`}
		>
			{feedbackIcon}
			<div className={styles["feedback-detailed__content"]}>
				<div className={styles["feedback-detailed__text"]}>
					<div className={styles["feedback__title"]}>{props.alertTitle}</div>
					<div className={styles["feedback__description"]}>
						{props.alertDescription}
					</div>
				</div>
				<div className={styles["feedback-detailed__buttons"]}>
					<div>
						{props.linkTitle && (
							<Linkbutton
								variant={props.variant == "filled" ? "gray" : "neutral"}
								size={"medium"}
								styleType={"lighter"}
								href={props.linkHref!}
								underline={true}
							>
								{props.linkTitle}
							</Linkbutton>
						)}
					</div>
					<div className={styles["feedback-detailed__buttons__separator"]}>
						&#8226;
					</div>
					<div>
						{props.secondaryLinkTitle && (
							<Linkbutton
								variant={props.variant == "filled" ? "gray" : "neutral"}
								size={"medium"}
								styleType={"lighter"}
								href={props.linkHref!}
								underline={true}
							>
								{props.secondaryLinkTitle}
							</Linkbutton>
						)}
					</div>
				</div>
			</div>
			{props.dismissable && (
				<i
					className={`${styles["feedback__dismiss"]} ri-close-fill`}
					onClick={() => setVisible(false)}
				/>
			)}
		</div>
	);
};

const Feedback: React.FC<SimpleFeedbackProps | DetailedFeedbackProps> = (
	props,
) => {
	if (isDetailedFeedbackProps(props)) {
		return <DetailedFeedback {...props} />;
	}
	return <SimpleFeedback {...props} />;
};

export default Feedback;
