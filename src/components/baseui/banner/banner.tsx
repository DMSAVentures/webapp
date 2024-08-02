import React, {HTMLAttributes, useState} from 'react';
import './banner.scss';
import 'remixicon/fonts/remixicon.css';
import Linkbutton from "@/components/baseui/linkbutton/linkbutton";

interface BannerProps extends HTMLAttributes<HTMLElement> {
    feedbackType: 'success' | 'error' | 'warning' | 'info' | 'feature';
    variant: 'filled' | 'light' | 'lighter' | 'stroke';
    alertTitle: string;
    alertDescription: string;
    linkTitle?: string;
    linkHref?: string;
}

function getIconBasedOnFeedbackType(bannerType: string) {
        switch (bannerType) {
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

const Banner: React.FC<BannerProps> = (props) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;
    const feedbackIcon = getIconBasedOnFeedbackType(props.feedbackType);
    return (
        <div className={`feedback feedback--${props.variant} feedback--${props.feedbackType}`}>
            {feedbackIcon}
            <div className='feedback-detailed__content'>
                <div className='feedback-detailed__text'>
                    <div className="feedback__title">{props.alertTitle}</div>
                    <div className="feedback__description">{props.alertDescription}</div>
                </div>
                {props.linkTitle && <Linkbutton variant={props.variant == 'filled' ? 'gray' : 'neutral' } size={'medium'} styleType={'lighter'} text={props.linkTitle} href={props.linkHref} underline={true} />}
            </div>
            <i className={'feedback__dismiss ri-close-fill'} onClick={() => setVisible(false)} />
        </div>
    );
}

export default Banner;
