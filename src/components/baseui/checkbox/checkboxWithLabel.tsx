import React from "react";
import Checkbox, {CheckboxProps} from "@/components/baseui/checkbox/checkbox";
import Badge from "@/components/baseui/badge/badge";
import Linkbutton from "@/components/baseui/linkbutton/linkbutton";
import './checkboxwithlabel.scss'

interface CheckboxWithLabel extends CheckboxProps {
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

const CheckboxWithLabel: React.FC<CheckboxWithLabel> = (props): JSX.Element => {
    return (
        <div className={`checkbox-labeled__container ${props.flipCheckboxToRight ? 'checkbox-labeled__container--reversed' : ''}`}>
            <Checkbox disabled={props.disabled} checked={props.checked} onChange={props.onChange}/>
            <div className={'checkbox-labeled__label-container'}>
                <div className={'checkbox-labeled__label'}>
                    <span className={'checkbox-labeled__label__string'}>{props.editLabel}</span>
                    {props.subLabel && <span className={'checkbox-labeled__sublabel__string'}>({props.editSubLabel})</span>}
                    {props.badge && <Badge text={props.badgeString} variant={'blue'} styleType={'lighter'} size={'small'}/>}
                </div>
                {props.editDescription && <span className={'checkbox-labeled__description__string'}>
                    {props.editDescription}
                </span>}
                {props.linkButton && <Linkbutton className={'checkbox-labeled__link'} variant={'primary'} styleType={'lighter'} size={'small'} text={props.linkTitle} href={props.linkHref} underline={false} />}
            </div>
        </div>
    );
}

export default CheckboxWithLabel;
