import {Toggle, ToggleProps} from "@/components/simpleui/Toggle/toggle";
import styles from './toggle-with-label.module.scss'
import ContentLabel, {ContentLabelProps} from "@/components/simpleui/label/contentlabel";

type ToggleAndLabelProps = ContentLabelProps & ToggleProps;
export interface ToggleWithLabelProps extends ToggleAndLabelProps {
    flipCheckboxToRight: boolean;
}
export const ToggleWithLabel = (props: ToggleWithLabelProps) => {
    return (
        <div className={`${styles['toggle-labeled__container']} ${props.flipCheckboxToRight ? styles['toggle-labeled__container--reversed'] : ''} ${props.disabled ? styles['toggle-card__container--disabled'] : ''}`}>
            <Toggle disabled={props.disabled} checked={props.checked} onChange={props.onChange}/>
            <ContentLabel description={props.description} text={props.text} subText={props.subText} badgeString={props.badgeString} badgeColour={'blue'} disabled={props.disabled} required={false} imageSrc={props.imageSrc} centeredImage={false} linkTitle={props.linkTitle} linkHref={props.linkHref}/>
        </div>
    );
}
