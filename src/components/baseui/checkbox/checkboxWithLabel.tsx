import React from "react";
import Checkbox, {CheckboxProps} from "@/components/baseui/checkbox/checkbox";
import Badge from "@/components/baseui/badge/badge";
import Linkbutton from "@/components/baseui/linkbutton/linkbutton";
import './checkboxwithlabel.scss'
import Label from "@/components/baseui/label/label";

export interface CheckboxWithLabelProps extends CheckboxProps {
    subLabel: boolean;
    badge: boolean;
    badgeString: string;
    linkButton: boolean;
    editLabel: string;
    editSubLabel: string;
    editDescription: string;
    linkTitle?: string;
    linkHref?: string;
    flipCheckboxToRight: boolean;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = (props): JSX.Element => {
    return (
        <div className={`checkbox-labeled__container ${props.flipCheckboxToRight ? 'checkbox-labeled__container--reversed' : ''} ${props.disabled ? 'checkbox-card__container--disabled' : ''}`}>
            <Checkbox disabled={props.disabled} checked={props.checked} onChange={props.onChange}/>
            <div className={'checkbox-labeled__label-container'}>
                <Label text={props.editLabel} subText={props.editSubLabel} disabled={props.disabled} badgeString={props.badgeString} badgeColour={'blue'} required={false}/>
                {props.editDescription && <span className={'checkbox-labeled__description__string'}>
                    {props.editDescription}
                </span>}
                {props.linkButton && <Linkbutton className={'checkbox-labeled__link'} variant={'primary'} styleType={'lighter'} size={'small'} disabled={props.disabled} text={props.linkTitle} href={props.linkHref} underline={false} />}
            </div>
        </div>
    );
}

export default CheckboxWithLabel;
