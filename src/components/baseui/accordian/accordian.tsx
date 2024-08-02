import React, { HTMLAttributes } from 'react';
import './accordian.scss';
import 'remixicon/fonts/remixicon.css';

interface AccordianProps extends HTMLAttributes<HTMLElement> {
    flipIcon?: boolean;
    leftIcon?: string;
    title: string;
    description: string;
}

const Accordian: React.FC<AccordianProps> = ({
                                                    flipIcon = false,
                                                    leftIcon,
                                                    title,
                                                    description,
                                                    children,
                                                    ...props
                                                }) => {
    const [showContent, setShowContent] = React.useState(false);
        return (
            <div className={showContent ? 'accordian  accordian--show' : 'accordian' } {...props}>
                    {flipIcon ?
                        <i className={`accordian__icon ${showContent ? 'ri-subtract-line' : 'ri-add-line'}`} onClick={() => setShowContent((prevShowContent) => !prevShowContent)}/>
                        :
                        leftIcon && <i className={`accordian__icon ${leftIcon}`}/>}

                    <div className="accordian__title">
                        {title}
                        {showContent && <div className="accordian__content">
                            {description}
                        </div>}
                    </div>
                    {!flipIcon && <i className={`accordian__icon ${showContent ? 'ri-subtract-line' : 'ri-add-line'}`} onClick={() => setShowContent((prevShowContent) => !prevShowContent)}/>}
            </div>
        );
};

export default Accordian;
