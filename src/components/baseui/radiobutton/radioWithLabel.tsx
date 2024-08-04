import React from "react";
import Badge from "@/components/baseui/badge/badge";
import Linkbutton from "@/components/baseui/linkbutton/linkbutton";
import './radiowithlabel.scss'
import Radio, {RadioProps} from "@/components/baseui/radiobutton/radio";

export interface RadioWithLabelProps extends RadioProps {
    subLabel: boolean;
    badge: boolean;
    badgeString: string;
    linkButton: boolean;
    editLabel: string;
    editSubLabel: string;
    editDescription: string;
    linkTitle?: string;
    linkHref?: string;
    flipRadioToRight: boolean;
}

const RadioWithLabel: React.FC<RadioWithLabelProps> = (props): JSX.Element => {
    return (
        <div className={`radio-labeled__container ${props.flipRadioToRight ? 'radio-labeled__container--reversed' : ''} ${props.disabled ? 'radio-card__container--disabled' : ''}`}>
            <Radio disabled={props.disabled} checked={props.checked} onChange={props.onChange}/>
            <div className={'radio-labeled__label-container'}>
                <div className={'radio-labeled__label'}>
                    <span className={'radio-labeled__label__string'}>{props.editLabel}</span>
                    {props.subLabel && <span className={'radio-labeled__sublabel__string'}>({props.editSubLabel})</span>}
                    {props.badge && <Badge text={props.badgeString} variant={'blue'} styleType={'lighter'} size={'small'} disabled={props.disabled}/>}
                </div>
                {props.editDescription && <span className={'radio-labeled__description__string'}>
                    {props.editDescription}
                </span>}
                {props.linkButton && <Linkbutton className={'radio-labeled__link'} variant={'primary'} styleType={'lighter'} size={'small'} disabled={props.disabled} text={props.linkTitle} href={props.linkHref} underline={false} />}
            </div>
        </div>
    );
}

export default RadioWithLabel;
