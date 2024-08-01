import React, { ButtonHTMLAttributes } from 'react';
import './accordian.scss';

interface AccordianProps extends ButtonHTMLAttributes<HTMLElement> {
    flipIcon?: boolean;
    leftIcon?: React.ReactNode;
    changeIcon?: React.ReactNode;
    title: string;
    description: string;
}

const Accordian: React.FC<AccordianProps> = ({
                                                    flipIcon = false,
                                                    leftIcon,
                                                    changeIcon,
                                                    title,
                                                    description,
                                                    children,
                                                    ...props
                                                }) => {
    const [showContent, setShowContent] = React.useState(false);
        return (
            <div className={showContent ? 'accordian  accordian--show' : 'accordian' } {...props}>
                    {leftIcon && <span className="accordian__icon">{leftIcon}</span>}
                    <div className="accordian__title">
                        {title}
                        {showContent && <div className="accordian__content">
                            {description}
                        </div>}
                    </div>
                    {changeIcon && <span className={`accordian__icon ${flipIcon ? 'accordian__icon--flip' : ''}`} onClick={() => setShowContent((prevShowContent) => !prevShowContent)}>{changeIcon}</span>}
            </div>
        );
};

export default Accordian;
