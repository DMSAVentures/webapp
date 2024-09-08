import React from "react";
import './radiocard.scss';
import RadioWithLabel, {RadioWithLabelProps} from "@/components/baseui/radiobutton/radioWithLabel";

type RadioCardProps = Omit<RadioWithLabelProps, | 'linkTitle' | 'linkHref'>;

const RadioCard: React.FC<RadioCardProps> = (props) => {
return (
    <div className={`radio-card__container`}>
        <RadioWithLabel
            {...props} flipRadioToRight={true}/>
    </div>
);
}

export default RadioCard;
