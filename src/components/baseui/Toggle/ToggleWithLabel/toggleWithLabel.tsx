import {Toggle, ToggleProps} from "@/components/baseui/Toggle/toggle";
import './toggle-with-label.scss'
import ContentLabel, {ContentLabelProps} from "@/components/baseui/label/contentlabel";
import React from "react";

type ToggleAndLabelProps = ContentLabelProps & ToggleProps;
export interface ToggleWithLabelProps extends ToggleAndLabelProps {
    flipCheckboxToRight: boolean;
}
export const ToggleWithLabel = (props: ToggleWithLabelProps) => {
    return (
        <div className={`toggle-labeled__container ${props.flipCheckboxToRight ? 'toggle-labeled__container--reversed' : ''} ${props.disabled ? 'toggle-card__container--disabled' : ''}`}>
            <Toggle disabled={props.disabled} checked={props.checked} onChange={props.onChange}/>
            <ContentLabel description={props.description} text={props.text} subText={props.subText} badgeString={props.badgeString} badgeColour={'blue'} disabled={props.disabled} required={false} imageSrc={props.imageSrc} centeredImage={false} linkTitle={props.linkTitle} linkHref={props.linkHref}/>
        </div>
    );
}
