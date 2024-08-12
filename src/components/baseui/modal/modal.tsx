import React from 'react';
import './modal.scss';
import 'remixicon/fonts/remixicon.css';
import Button from "@/components/baseui/button/button";
import HintText from "@/components/baseui/hinttext/hinttext";

type Props = React.HTMLProps<HTMLDialogElement> & ModalFooterProps;
interface ModalProps extends Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    icon: 'success' | 'error' | 'warning' | 'info' | 'feature';
    footerLeftChildren?: React.ReactNode;
    footerFullWithButtons?: boolean;
}

interface ModalFooterProps {
    footerLeftChildren?: React.ReactNode;
    footerFullWithButtons?: boolean;
    onCancel: () => void;
    onProceed: () => void;
    cancelText: string;
    proceedText: string;
}

function getIconBasedOnIconType(icon: string) {
    switch (icon) {
        case 'success':
            return 'ri-checkbox-circle-fill'
        case 'error':
            return 'ri-checkbox-circle-fill'
        case 'warning':
            return 'ri-alert-fill'
        case 'info':
            return 'ri-checkbox-circle-fill'
        case 'feature':
            return 'ri-magic-fill'
        default:
            return 'ri-checkbox-circle-fill'
    }
}

const ModalFooter: React.FC<ModalFooterProps> = (props) => {
    return <div className={'modal__footer'}>
        {props.footerLeftChildren &&
            <div className={'modal__footer-left'}>
                {props.footerLeftChildren}
            </div>
        }
        <div className={'modal__footer-right'}>
            <Button style={{width: "100%"}} variant={'neutral'} styleType={'stroke'} size={'small'} text={props.cancelText} onClick={props.onCancel}/>
            <Button style={{width: "100%"}} variant={'primary'} text={props.proceedText} size={'small'} onClick={props.onProceed}/>
        </div>
    </div>;
}

const ModalHeader: React.FC<ModalProps> = (props) => {
    const iconComponent = getIconBasedOnIconType(props.icon);
    return <div className={"modal__header"}>
        {props.icon &&
            <i className={`modal__icon ${props.description ? "modal__icon--medium" : ""} modal__icon--${props.icon} ${iconComponent}`}></i>}
        <div className={'modal__header__text'}>
            <div className={"modal__title"}>
                {props.title}
            </div>
            {props.description && <span className={'modal__description'}>{props.description}</span>}
        </div>

        <i className={"modal__close ri-close-fill"} onClick={props.onClose}/>
    </div>;
}

const Modal = (props: ModalProps) => {
    const dialogRef = React.useRef(null);

    React.useEffect(() => {
        if (dialogRef.current === null) {
            return;
        }
        if (props.isOpen) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current.close();
        }
    }, [props.isOpen]);


    return (
        <dialog className={'modal__container'} ref={dialogRef} onClose={props.onClose}>
            <div className={'modal__content'}>
                <ModalHeader icon={props.icon} description={props.description} title={props.title}
                             onClose={props.onClose}/>
                {props.children && <div className={'modal__body'}>
                    {props.children}
                </div>}
                <ModalFooter footerFullWithButtons={props.footerFullWithButtons} footerLeftChildren={props.footerLeftChildren} cancelText={props.cancelText} proceedText={props.proceedText} onCancel={props.onCancel} onProceed={props.onProceed}/>
            </div>
        </dialog>
    );
};

export default Modal;
