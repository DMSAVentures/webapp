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
    return (<motion.div
        // initial={{opacity: 0, height: 'auto'}}
        animate={{opacity: 1, height: 'auto'}}
        transition={{duration: 0.2, ease: 'easeInOut'}}
        exit={{opacity: 1, height: 'auto'}}
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
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
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
