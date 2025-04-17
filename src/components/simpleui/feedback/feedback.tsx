import React, {HTMLAttributes, useState} from 'react';
import './feedback.scss';
import 'remixicon/fonts/remixicon.css';
import Linkbutton from "@/components/simpleui/linkbutton/linkbutton";

function isDetailedFeedbackProps(props: any): props is DetailedFeedbackProps {
    return 'alertDescription' in props && props.alertDescription != "";
}

interface SimpleFeedbackProps extends HTMLAttributes<HTMLElement> {
    feedbackType: 'success' | 'error' | 'warning' | 'info' | 'feature';
    variant: 'filled' | 'light' | 'lighter' | 'stroke';
    size: 'small' | 'x-small';
    dismissable?: boolean;
    alertTitle: string;
    linkTitle?: string;
    linkHref?: string;
}
interface DetailedFeedbackProps extends HTMLAttributes<HTMLElement> {
    feedbackType: 'success' | 'error' | 'warning' | 'info' | 'feature';
    variant: 'filled' | 'light' | 'lighter' | 'stroke';
    size: 'large';
    dismissable?: boolean;
    alertTitle: string;
    alertDescription: string;
    linkTitle?: string;
    linkHref?: string;
    secondaryLinkTitle?: string;
    secondaryLinkHref?: string;
}

function getIconBasedOnFeedbackType(feedbackType: string) {
        switch (feedbackType) {
            case 'success':
                return <i className="feedback__icon ri-checkbox-circle-fill"></i>;
            case 'error':
                return <i className="feedback__icon ri-checkbox-circle-fill"></i>;
            case 'warning':
                return <i className="feedback__icon ri-alert-fill"></i>;
            case 'info':
                return <i className="feedback__icon ri-checkbox-circle-fill"></i>;
            case 'feature':
                return <i className="feedback__icon ri-magic-fill"></i>;
            default:
                return <i className="feedback__icon ri-checkbox-circle-fill"></i>;
        }
}

const SimpleFeedback: React.FC<SimpleFeedbackProps> = (props) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;
    const feedbackIcon = getIconBasedOnFeedbackType(props.feedbackType);
    return (
        <div className={`feedback feedback--${props.size} feedback--${props.variant} feedback--${props.feedbackType}`}>
            {feedbackIcon}
            <div className="feedback__title">{props.alertTitle}</div>
            {props.linkTitle && <Linkbutton variant={props.variant == 'filled' ? 'gray' : 'neutral' } size={props.size == 'small' ? 'medium' : 'small'} styleType={'lighter'} href={props.linkHref!} underline={true}>{props.linkTitle}</Linkbutton>}
            {props.dismissable && <i className={'feedback__dismiss ri-close-fill'} onClick={() => setVisible(false)} />}
        </div>
    );
}

const DetailedFeedback: React.FC<DetailedFeedbackProps> = (props) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;
    const feedbackIcon = getIconBasedOnFeedbackType(props.feedbackType);
    return (
        <div className={`feedback feedback--${props.size} feedback--${props.variant} feedback--${props.feedbackType}`}>
            {feedbackIcon}
            <div className='feedback-detailed__content'>
                <div className='feedback-detailed__text'>
                    <div className="feedback__title">{props.alertTitle}</div>
                    <div className="feedback__description">{props.alertDescription}</div>
                </div>
                <div className={'feedback-detailed__buttons'}>
                    <div>
                        {props.linkTitle && <Linkbutton variant={props.variant == 'filled' ? 'gray' : 'neutral' } size={'medium'} styleType={'lighter'}  href={props.linkHref!} underline={true}>{props.linkTitle}</Linkbutton>}
                    </div>
                    <div className={'feedback-detailed__buttons__separator'}>&#8226;</div>
                    <div>
                        {props.secondaryLinkTitle &&
                            <Linkbutton variant={props.variant == 'filled' ? 'gray' : 'neutral' } size={'medium'} styleType={'lighter'} href={props.linkHref!} underline={true}>{props.secondaryLinkTitle}</Linkbutton>}
                    </div>
                </div>
            </div>
            {props.dismissable && <i className={'feedback__dismiss ri-close-fill'} onClick={() => setVisible(false)} />}
        </div>
    );
}

const Feedback: React.FC<SimpleFeedbackProps | DetailedFeedbackProps> = (props) => {
    if (isDetailedFeedbackProps(props)) {
        return <DetailedFeedback {...props} />;
    }
    return <SimpleFeedback {...props} />;
};

export default Feedback;
