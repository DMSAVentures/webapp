import React, { HTMLAttributes } from 'react';
import './feedback.scss';

function isDetailedFeedbackProps(props: any): props is DetailedFeedbackProps {
    return 'alertDescription' in props;
}

interface SimpleFeedbackProps extends HTMLAttributes<HTMLElement> {
    feedbackType: 'success' | 'error' | 'warning' | 'info' | 'feature';
    variant: 'filled' | 'light' | 'lighter' | 'stroke';
    dismissable?: boolean;
    alertTitle: string;
    linkTitle?: string;
    linkHref?: string;
}
interface DetailedFeedbackProps extends HTMLAttributes<HTMLElement> {
    feedbackType: 'success' | 'error' | 'warning' | 'info' | 'feature';
    variant: 'filled' | 'light' | 'lighter' | 'stroke';
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
        <div className={'feedback'}>
            <span className={'feedback__icon'}>{feedbackIcon}</span>
            <div className="feedback__title">{props.alertTitle}</div>
            {props.linkTitle && <a href={"#"} className={'feedback__link'}>{props.linkTitle}</a>}
            {props.dismissable && <span className={'feedback__dismiss'}>X</span>}
        </div>
    );
}

const DetailedFeedback: React.FC<DetailedFeedbackProps> = (props) => {
    const feedbackIcon = getIconBasedOnFeedbackType(props.feedbackType, props.variant);
    return (
        <div className={'feedback'}>
            <span className={'feedback__icon'}>{feedbackIcon}</span>
            <div className='feedback-detailed__content'>
                <div className="feedback__title">{props.alertTitle}</div>
                <div className="feedback__description">{props.alertDescription}</div>
                <div className={'feedback-detailed__buttons'}>
                    {props.linkTitle && <a href={props.linkHref} className={'feedback__link'}>{props.linkTitle}</a>}
                    {props.secondaryLinkTitle && <a href={props.secondaryLinkHref} className={'feedback__link'}>{props.secondaryLinkTitle}</a>}
                </div>
            </div>
            {props.dismissable && <span className={'feedback__dismiss'}>X</span>}
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
