import React from 'react';
import './modal.scss';
import 'remixicon/fonts/remixicon.css';
import Button from "@/components/baseui/button/button";

// Define ModalFooterProps first
interface ModalFooterProps {
    footerLeftChildren?: React.ReactNode;
    footerFullWithButtons?: boolean;
    onCancel?: () => void;
    onProceed?: () => void;
    cancelText?: string;
    proceedText?: string;
}

// Define ModalHeaderProps based on the modal's header requirements
interface ModalHeaderProps {
    title: string;
    description?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'feature';
    dismissibleByCloseIcon?: boolean;
    centeredHeader?: boolean;
    onClose: () => void;
}

// Compose ModalProps using ModalHeaderProps and ModalFooterProps
export type ModalProps = React.HTMLProps<HTMLDialogElement> &
    ModalHeaderProps &
    ModalFooterProps & {
    isOpen: boolean;
};
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
    const buttonStyle = props.footerFullWithButtons ? { width: "100%" } : {};

    return <div className={'modal__footer'}>
        {props.footerLeftChildren && <div className={'modal__footer-left'}>
            {props.footerLeftChildren}
        </div>}
        <div className={'modal__footer-right'}>
            <Button style={buttonStyle} variant={'primary'} text={props.proceedText} size={'small'}
                    onClick={props.onProceed}/>
            {props.cancelText && <Button style={buttonStyle} variant={'neutral'} styleType={'stroke'} size={'small'}
                    text={props.cancelText} onClick={props.onCancel}/>}
        </div>
    </div>;
}

const ModalHeader: React.FC<ModalHeaderProps> = (props) => {
    const iconComponent = getIconBasedOnIconType(props.icon ?? '');
    return (<div className={`modal__header ${props.centeredHeader ? 'modal__header--centered' : ''}`}>
        {props.icon &&
            <i className={`modal__icon ${props.description ? "modal__icon--medium" : ""} modal__icon--${props.icon} ${iconComponent}`}></i>}
        <div className={'modal__header__text'}>
            <div className={"modal__title"}>
                {props.title}
            </div>
            {props.description && <span className={'modal__description'}>{props.description}</span>}
        </div>

        {!props.centeredHeader && props.dismissibleByCloseIcon && <i className={"modal__close ri-close-fill"} onClick={props.onClose}/>}
    </div>);
}

const Modal: React.FC<ModalProps> = (props: ModalProps) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);

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

    const closeModal = () => {
        if (dialogRef.current !== null) {
            dialogRef.current.close();
        }
        if (props.onClose) {
            props.onClose();
        }
        if (props.onCancel) {
            props.onCancel();
        }
    };

    if (!props.isOpen) {
        return null;
    }
    return (<dialog className={'modal__container'} ref={dialogRef} onClose={props.onClose}>
            <div className={'modal__content'}>
                <ModalHeader icon={props.icon} description={props.description} title={props.title}
                             onClose={closeModal} dismissibleByCloseIcon={props.dismissibleByCloseIcon ?? true} centeredHeader={props.centeredHeader}/>
                {props.children && <div className={'modal__body'}>
                    {props.children}
                </div>}
                <ModalFooter footerFullWithButtons={props.footerFullWithButtons}
                             footerLeftChildren={props.footerLeftChildren} cancelText={props.cancelText}
                             proceedText={props.proceedText} onCancel={closeModal} onProceed={props.onProceed}/>
            </div>
        </dialog>);
};

export default Modal;
