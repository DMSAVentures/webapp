import React from "react";
import Linkbutton from "@/components/baseui/linkbutton/linkbutton";
import './radiowithlabel.scss'
import Radio, {RadioProps} from "@/components/baseui/radiobutton/radio";
import {Badge} from "@/components/baseui/badge/badge";
import ContentLabel, {ContentLabelProps} from "@/components/baseui/label/contentlabel";
import {ToggleProps} from "@/components/baseui/Toggle/toggle";

type RadioAndLabelProps = ContentLabelProps & RadioProps;
export interface RadioWithLabelProps extends RadioAndLabelProps {
    flipRadioToRight: boolean;
}

const RadioWithLabel: React.FC<RadioWithLabelProps> = (props): JSX.Element => {
    return (
        <div className={`radio-labeled__container ${props.flipRadioToRight ? 'radio-labeled__container--reversed' : ''} ${props.disabled ? 'radio-card__container--disabled' : ''}`}>
            <Radio disabled={props.disabled} checked={props.checked} onChange={props.onChange}/>
            <ContentLabel description={props.description} text={props.text} subText={props.subText} badgeString={props.badgeString} badgeColour={'blue'} disabled={props.disabled} required={false} imageSrc={props.imageSrc} centeredImage={false} linkTitle={props.linkTitle} linkHref={props.linkHref}/>
        </div>
    );
}

export default RadioWithLabel;
