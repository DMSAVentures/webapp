import React, {JSX} from "react";
import Checkbox, {CheckboxProps} from "@/components/simpleui/checkbox/checkbox";
import styles from './checkboxwithlabel.module.scss'
import ContentLabel, {ContentLabelProps} from "@/components/simpleui/label/contentlabel";

type CheckboxAndLabelProps = ContentLabelProps & CheckboxProps;
export interface CheckboxWithLabelProps extends CheckboxAndLabelProps {
    flipCheckboxToRight: boolean;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = (props): JSX.Element => {
    return (
        <div className={`${styles['checkbox-labeled__container']} ${props.flipCheckboxToRight ? styles['checkbox-labeled__container--reversed'] : ''} ${props.disabled ? styles['checkbox-card__container--disabled'] : ''}`}>
            <Checkbox disabled={props.disabled} checked={props.checked} onChange={props.onChange}/>
            <ContentLabel description={props.description} text={props.text} subText={props.subText} badgeString={props.badgeString} badgeColour={'blue'} disabled={props.disabled} required={false} imageSrc={props.imageSrc} centeredImage={false} linkTitle={props.linkTitle} linkHref={props.linkHref}/>
        </div>
    );
}

export default CheckboxWithLabel;
