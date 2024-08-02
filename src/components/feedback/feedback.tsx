import React, { HTMLAttributes } from 'react';
import './feedback.scss';
import Linkbutton from "@/components/linkbutton/linkbutton";

function isDetailedFeedbackProps(props: any): props is DetailedFeedbackProps {
    return 'alertDescription' in props && props.alertDescription != "";
}

interface SimpleFeedbackProps extends HTMLAttributes<HTMLElement> {
    feedbackType: 'success' | 'error' | 'warning' | 'info' | 'feature';
    variant: 'filled' | 'light' | 'lighter' | 'stroke';
    size: 'large';
    dismissable?: boolean;
    alertTitle: string;
    linkTitle?: string;
    linkHref?: string;
}
interface DetailedFeedbackProps extends HTMLAttributes<HTMLElement> {
    feedbackType: 'success' | 'error' | 'warning' | 'info' | 'feature';
    variant: 'filled' | 'light' | 'lighter' | 'stroke';
    size: 'small' | 'x-small';
    dismissable?: boolean;
    alertTitle: string;
    alertDescription: string;
    linkTitle?: string;
    linkHref?: string;
    secondaryLinkTitle?: string;
    secondaryLinkHref?: string;
}

function getIconBasedOnFeedbackType(feedbackType: string, variant: string) {
    if (variant === 'filled') {
        switch (feedbackType) {
            case 'success':
                return 'check-circle-white';
            case 'error':
                return 'exclamation-circle-white';
            case 'warning':
                return 'exclamation-triangle-white';
            case 'info':
                return 'info-circle-white';
            case 'feature':
                return 'lightbulb-white';
            default:
                return 'info-circle-white';
        }
    } else {
        switch (feedbackType) {
            case 'success':
                return 'check-circle';
            case 'error':
                return 'exclamation-circle';
            case 'warning':
                return 'exclamation-triangle';
            case 'info':
                return 'info-circle';
            case 'feature':
                return 'lightbulb';
            default:
                return 'info-circle';
        }
    }
}

const SimpleFeedback: React.FC<SimpleFeedbackProps> = (props) => {
    const feedbackIcon = getIconBasedOnFeedbackType(props.feedbackType, props.variant);
    return (
        <div className={`feedback feedback--${props.size} feedback--${props.variant} feedback--${props.feedbackType}`}>
            <span className={'feedback__icon'}>i</span>
            <div className="feedback__title">{props.alertTitle}</div>
            {props.linkTitle && <Linkbutton variant={props.variant == 'filled' ? 'gray' : 'neutral' } size={'small'} styleType={'lighter'} text={props.linkTitle} href={props.linkHref} underline={true} />}
            {props.dismissable && <span className={'feedback__dismiss'}>x</span>}
        </div>
    );
}

const DetailedFeedback: React.FC<DetailedFeedbackProps> = (props) => {
    const feedbackIcon = getIconBasedOnFeedbackType(props.feedbackType, props.variant);
    return (
        <div className={`feedback feedback--${props.size} feedback--${props.variant} feedback--${props.feedbackType}`}>
            <span className={'feedback__icon'}>s</span>
            <div className='feedback-detailed__content'>
                <div className='feedback-detailed__text'>
                    <div className="feedback__title">{props.alertTitle}</div>
                    <div className="feedback__description">{props.alertDescription}</div>
                </div>
                <div className={'feedback-detailed__buttons'}>
                    <div>
                        {props.linkTitle && <Linkbutton variant={props.variant == 'filled' ? 'gray' : 'neutral' } size={'medium'} styleType={'lighter'} text={props.linkTitle} href={props.linkHref} underline={true} />}
                    </div>
                    <div>
                        {props.secondaryLinkTitle &&
                            <Linkbutton variant={props.variant == 'filled' ? 'gray' : 'neutral' } size={'medium'} styleType={'lighter'} text={props.secondaryLinkTitle} href={props.secondaryLinkHref} underline={false} />}
                    </div>
                </div>
            </div>
            {props.dismissable && <span className={'feedback__dismiss'}>x</span>}
        </div>
    );
}

const Feedback: React.FC<SimpleFeedbackProps | DetailedFeedbackProps> = (props, deprecatedLegacyContext) => {
    if (isDetailedFeedbackProps(props)) {
        return <DetailedFeedback {...props} />;
    }
    return <SimpleFeedback {...props} />;
};

export default Feedback;
