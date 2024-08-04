import React from "react";
import './radiocard.scss';
import RadioWithLabel, {RadioWithLabelProps} from "@/components/baseui/radiobutton/radioWithLabel";

type RadioWithLabelWithoutLinkProps = Omit<RadioWithLabelProps, 'linkButton' | 'linkTitle' | 'linkHref'>;
interface RadioCardProps extends RadioWithLabelWithoutLinkProps {
    imageSrc?: string;
    centeredImage?: boolean;
}
const RadioCard: React.FC<RadioCardProps> = (props) => {
return (
    <div className={`radio-card__container`}>
        {props.imageSrc && <img src={props.imageSrc} className={`radio-card__image ${props.centeredImage ? 'radio-card__image--centered' : ''}`} alt={'radio card image'}/>}
        <RadioWithLabel
            disabled={props.disabled}
            subLabel={props.subLabel}
            badge={props.badge}
            badgeString={props.badgeString}
            editLabel={props.editLabel}
            editSubLabel={props.editSubLabel}
            editDescription={props.editDescription}
            flipRadioToRight={true}
            linkButton={false}/>

    </div>
);
}

export default RadioCard;
