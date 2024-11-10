import React from "react";
import './toggle-card.scss';
import {ToggleWithLabel, ToggleWithLabelProps} from "@/components/simpleui/Toggle/ToggleWithLabel/toggleWithLabel";

type ToggleCardProps = Omit<ToggleWithLabelProps, | 'linkTitle' | 'linkHref'>;

export const ToggleCard: React.FC<ToggleCardProps> = (props) => {
    return (
        <div className={`toggle-card__container`}>
            <ToggleWithLabel
                disabled={props.disabled}
                text={props.text}
                badgeString={props.badgeString}
                subText={props.subText}
                description={props.description}
                flipCheckboxToRight={props.flipCheckboxToRight}
                imageSrc={props.imageSrc}
                centeredImage={props.centeredImage}
            />
        </div>
    );
}

export default ToggleCard;
