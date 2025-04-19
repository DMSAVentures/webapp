import React, {HTMLAttributes} from 'react';
import './accordian.scss';
import 'remixicon/fonts/remixicon.css';
import {motion, AnimatePresence} from 'motion/react';

interface AccordianProps extends HTMLAttributes<HTMLDivElement> {
    flipIcon?: boolean;
    leftIcon?: string;
    title: string;
    description: string;
}

const Accordian: React.FC<AccordianProps> = ({
                                                 flipIcon = false, leftIcon, title, description, children,
                                             }) => {
    const [showContent, setShowContent] = React.useState(false);
    return (
        <motion.div
        onClick={() => setShowContent((prevShowContent) => !prevShowContent)}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={showContent ? 'accordian  accordian--show' : 'accordian'} >
            {flipIcon ? <i className={`accordian__icon ${showContent ? 'ri-subtract-line' : 'ri-add-line'}`}
                           onClick={() => setShowContent((prevShowContent) => !prevShowContent)}/> : leftIcon &&
                <i className={`accordian__icon ri-${leftIcon}`}/>}

            <div className="accordian__title">
                {title}
                <AnimatePresence initial={false}>
                  {showContent && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeIn' }}
                      style={{ overflow: 'hidden' }}
                      className="accordian__content"
                    >
                      {children}
                      <p>{description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
            {!flipIcon && <i className={`accordian__icon ${showContent ? 'ri-subtract-line' : 'ri-add-line'}`}
                             onClick={() => setShowContent((prevShowContent) => !prevShowContent)}/>}
        </motion.div>);
};

export default Accordian;
