import Label, {LabelProps} from "@/components/baseui/label/label";
import React from "react";
import './contentlabel.scss';
interface ContentLabelProps extends LabelProps {
    imageSrc?: string;
    centeredImage?: boolean;
    description: string;
}
const ContentLabel: React.FC<ContentLabelProps> = (props) => {
    return (
        <div className={`content-label__container content-label__container--${props.disabled ? 'disabled' :''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {props.imageSrc && <img src={props.imageSrc} className={`content-label__image ${props.centeredImage ? 'content-label__image--centered' : ''}`} alt={'content label image'}/>}
            <div className={'content-label__text'}>
                <Label text={props.text} subText={props.subText} badgeString={props.badgeString} badgeColour={props.badgeColour} disabled={props.disabled} required={props.required}/>
                <span className={`content-label__description__string ${props.disabled ?  'content-label__description__string--disabled' : ''}`}>
                    {props.description}
                </span>
            </div>
        </div>
    );
}


export default ContentLabel;
