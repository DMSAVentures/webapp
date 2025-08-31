import React from "react";
import styles from './radiocard.module.scss';
import RadioWithLabel, {RadioWithLabelProps} from "@/components/simpleui/radiobutton/radioWithLabel";

type RadioCardProps = Omit<RadioWithLabelProps, | 'linkTitle' | 'linkHref'>;

const RadioCard: React.FC<RadioCardProps> = (props) => {
return (
    <div className={styles['radio-card__container']}>
        <RadioWithLabel
            {...props} flipRadioToRight={true}/>
    </div>
);
}

export default RadioCard;
