import React from "react";
import Checkbox, {CheckboxProps} from "@/components/simpleui/checkbox/checkbox";
import './checkboxwithlabel.scss'
import ContentLabel, {ContentLabelProps} from "@/components/baseui/label/contentlabel";

type CheckboxAndLabelProps = ContentLabelProps & CheckboxProps;
export interface CheckboxWithLabelProps extends CheckboxAndLabelProps {
    flipCheckboxToRight: boolean;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = (props): JSX.Element => {
    return (
        <div className={`checkbox-labeled__container ${props.flipCheckboxToRight ? 'checkbox-labeled__container--reversed' : ''} ${props.disabled ? 'checkbox-card__container--disabled' : ''}`}>
            <Checkbox disabled={props.disabled} checked={props.checked} onChange={props.onChange}/>
            <ContentLabel description={props.description} text={props.text} subText={props.subText} badgeString={props.badgeString} badgeColour={'blue'} disabled={props.disabled} required={false} imageSrc={props.imageSrc} centeredImage={false} linkTitle={props.linkTitle} linkHref={props.linkHref}/>
        </div>
    );
}

export default CheckboxWithLabel;
