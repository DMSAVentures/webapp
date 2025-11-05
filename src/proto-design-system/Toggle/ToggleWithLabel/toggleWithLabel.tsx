import ContentLabel, {
	ContentLabelProps,
} from "@/proto-design-system/label/contentlabel.tsx";
import { Toggle, ToggleProps } from "@/proto-design-system/Toggle/toggle.tsx";
import styles from "./toggle-with-label.module.scss";

type ToggleAndLabelProps = ContentLabelProps & ToggleProps;
export interface ToggleWithLabelProps extends ToggleAndLabelProps {
	flipCheckboxToRight: boolean;
}
export const ToggleWithLabel = (props: ToggleWithLabelProps) => {
	return (
		<div
			className={`${styles["toggle-labeled__container"]} ${props.flipCheckboxToRight ? styles["toggle-labeled__container--reversed"] : ""} ${props.disabled ? styles["toggle-card__container--disabled"] : ""}`}
		>
			<Toggle
				disabled={props.disabled}
				checked={props.checked}
				onChange={props.onChange}
			/>
			<ContentLabel
				description={props.description}
				text={props.text}
				subText={props.subText}
				badgeString={props.badgeString}
				badgeColour={"blue"}
				disabled={props.disabled}
				required={false}
				imageSrc={props.imageSrc}
				centeredImage={false}
				linkTitle={props.linkTitle}
				linkHref={props.linkHref}
			/>
		</div>
	);
};
