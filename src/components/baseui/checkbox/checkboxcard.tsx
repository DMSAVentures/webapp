import React from "react";
import CheckboxWithLabel, {CheckboxWithLabelProps} from "@/components/baseui/checkbox/checkboxWithLabel";
import './checkboxcard.scss';

type CheckboxWithLabelWithoutLinkProps = Omit<CheckboxWithLabelProps, 'linkButton' | 'linkTitle' | 'linkHref'>;
interface CheckboxCardProps extends CheckboxWithLabelWithoutLinkProps {
    imageSrc?: string;
    centeredImage?: boolean;
}
const CheckboxCard: React.FC<CheckboxCardProps> = (props) => {
return (
    <div className={`checkbox-card__container`}>
        {props.imageSrc && <img src={props.imageSrc} className={`checkbox-card__image ${props.centeredImage ? 'checkbox-card__image--centered' : ''}`} alt={'checkbox card image'}/>}
        <CheckboxWithLabel
            disabled={props.disabled}
            subLabel={props.subLabel}
            badge={props.badge}
            badgeString={props.badgeString}
            editLabel={props.editLabel}
            editSubLabel={props.editSubLabel}
            editDescription={props.editDescription}
            flipCheckboxToRight={true}
            linkButton={false}/>

    </div>
);
}

export default CheckboxCard;
