import React, {HTMLAttributes, useState} from 'react';
import 'remixicon/fonts/remixicon.css';
import Linkbutton from "@/components/baseui/linkbutton/linkbutton";

interface BannerProps extends HTMLAttributes<HTMLElement> {
    bannerType: 'success' | 'error' | 'warning' | 'info' | 'feature';
    variant: 'filled' | 'light' | 'lighter' | 'stroke';
    alertTitle: string;
    alertDescription: string;
    linkTitle?: string;
    linkHref?: string;
}

function getIconBasedOnbannerType(bannerType: string) {
        switch (bannerType) {
            case 'success':
                return <i className="banner__icon ri-checkbox-circle-fill"></i>;
            case 'error':
                return <i className="banner__icon ri-alert-fill"></i>;
            case 'warning':
                return <i className="banner__icon ri-alert-fill"></i>;
            case 'info':
                return <i className="banner__icon ri-checkbox-circle-fill"></i>;
            case 'feature':
                return <i className="banner__icon ri-magic-fill"></i>;
            default:
                return <i className="banner__icon ri-checkbox-circle-fill"></i>;
        }
}

const Banner: React.FC<BannerProps> = (props) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;
    const bannerIcon = getIconBasedOnbannerType(props.bannerType);
    return (
        <div className={`banner banner--${props.variant} banner--${props.bannerType}`}>
                    <div className={'banner__content'}>
                        {bannerIcon}
                        <div className="banner__title">{props.alertTitle}</div>
                        <i className={"banner__separator ri-circle-fill"}></i>
                        <div className="banner__description">{props.alertDescription}</div>
                        {props.linkTitle && <Linkbutton variant={props.variant == 'filled' ? 'gray' : 'neutral' } size={'medium'} styleType={'lighter'} text={props.linkTitle} href={props.linkHref} underline={true} />}
                    </div>
                    <i className={'banner__dismiss ri-close-fill'} onClick={() => setVisible(false)} />
        </div>
    );
}

export default Banner;
