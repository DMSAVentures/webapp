import React from "react";
import ContentLabel, {
	ContentLabelProps,
} from "@/components/simpleui/label/contentlabel";
import styles from "./contentcard.module.scss";
import "remixicon/fonts/remixicon.css";
interface ContentCardProps extends ContentLabelProps {
	dismissible?: boolean;
	onDismiss?: () => void;
}
const ContentCard: React.FC<ContentCardProps> = (props) => {
	const [dismissed, setDismissed] = React.useState(false);
	if (dismissed) return null;

	const onDismiss = () => {
		if (props.onDismiss) {
			props.onDismiss();
		}
		setDismissed(true);
	};

	return (
		<div className={styles["content-card__container"]}>
			<ContentLabel
				description={props.description}
				text={props.text}
				subText={props.subText}
				badgeString={props.badgeString}
				badgeColour={props.badgeColour}
				disabled={props.disabled}
				required={props.required}
				imageSrc={props.imageSrc}
				centeredImage={props.centeredImage}
				linkTitle={props.linkTitle}
				linkHref={props.linkHref}
			/>
			{props.dismissible && (
				<i
					className={`${styles["content-card__dismiss"]} ri-close-fill`}
					onClick={onDismiss}
				/>
			)}
		</div>
	);
};
export default ContentCard;
