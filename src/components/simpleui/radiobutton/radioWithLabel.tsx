import React, {JSX} from "react";
import './radiowithlabel.scss'
import Radio, {RadioProps} from "@/components/simpleui/radiobutton/radio";
import ContentLabel, {ContentLabelProps} from "@/components/simpleui/label/contentlabel";


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
