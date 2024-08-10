import React from 'react';
import './contentdivider.scss';
interface LineContentDividerProps {
    size: 'thin' | 'thick'
    text?: string;
}

interface BannerContentDividerProps {
    text: string;
    styleType: 'light' | 'grey';
}

interface ButtonGroupContentDividerProps {
    buttonGroup: React.ReactNode;
}

export type ContentDividerProps = LineContentDividerProps | BannerContentDividerProps | ButtonGroupContentDividerProps;

function isLineContentDividerProps(props: ContentDividerProps): props is LineContentDividerProps {
    return 'size' in props;
}

function isBannerContentDividerProps(props: ContentDividerProps): props is BannerContentDividerProps {
    return 'styleType' in props;
}

const LineContentDivider: React.FC<LineContentDividerProps> = (props) => {
    return (
       <hr className={`content-divider-line ${props.text ? 'content-divider-line--text': ''}`} data-content={props.text}/>
    );
}

const BannerContentDivider: React.FC<BannerContentDividerProps> = (props) => {
    return (
        <div className={`content-divider-banner content-divider-banner--${props.styleType}`}>
            {props.text}
        </div>
    );
}

const ButtonGroupContentDivider: React.FC<ButtonGroupContentDividerProps> = (props) => {
    return (
        <div className="content-divider-buttongroup">
            {props.buttonGroup}
        </div>
    );
}
const ContentDivider: React.FC<ContentDividerProps> = (props) => {
    if (isLineContentDividerProps(props)) {
        return <LineContentDivider {...props} />;
    }
    if (isBannerContentDividerProps(props)) {
        return <BannerContentDivider {...props} />;
    }
    return <ButtonGroupContentDivider {...props} />;
}

export default ContentDivider;
