import React from 'react';
import styles from './modal.module.scss';
import 'remixicon/fonts/remixicon.css';
import {Button} from "@/components/simpleui/Button/button";
import {IconOnlyButton} from "@/components/simpleui/Button/IconOnlyButton";

// Define ModalFooterProps first
interface ModalFooterProps {
    footerLeftChildren?: React.ReactNode;
    footerFullWithButtons?: boolean;
    onCancel?: () => void;
    onProceed?: () => void;
    cancelText?: string;
    proceedText: string;
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

    return <div className={styles['modal__footer']}>
        {props.footerLeftChildren && <div className={styles['modal__footer-left']}>
            {props.footerLeftChildren}
        </div>}
        <div className={styles['modal__footer-right']}>
            <Button style={buttonStyle} variant={'primary'}
                    onClick={props.onProceed}>{props.proceedText!}</Button>
            {props.cancelText && <Button style={buttonStyle} variant={'secondary'}
                                         onClick={props.onCancel}>{props.cancelText}</Button>}
        </div>
    </div>;
}

const ModalHeader: React.FC<ModalHeaderProps> = (props) => {
    const iconComponent = getIconBasedOnIconType(props.icon ?? '');
    return (<div className={`${styles['modal__header']} ${props.centeredHeader ? styles['modal__header--centered'] : ''}`}>
        {props.icon &&
            <i className={`${styles['modal__icon']} ${props.description ? styles['modal__icon--medium'] : ""} ${styles[`modal__icon--${props.icon}`]} ${iconComponent}`}></i>}
        <div className={styles['modal__header__text']}>
            <span className={styles['modal__title']}>
                {props.title}
            </span>
            {props.description && <p className={styles['modal__description']}>{props.description}</p>}
        </div>

        {!props.centeredHeader && props.dismissibleByCloseIcon && <IconOnlyButton ariaLabel={"modal-icon"} variant={'secondary'} iconClass={'close-fill'} onClick={props.onClose}>Close</IconOnlyButton>}
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
    return (
        <dialog className={styles['modal__container']} ref={dialogRef} onClose={props.onClose}>
            <div className={styles['modal__content']}>
                <ModalHeader icon={props.icon} description={props.description} title={props.title}
                             onClose={closeModal} dismissibleByCloseIcon={props.dismissibleByCloseIcon ?? true} centeredHeader={props.centeredHeader}/>
                {props.children && <div className={styles['modal__body']}>
                    {props.children}
                </div>}
                <ModalFooter footerFullWithButtons={props.footerFullWithButtons}
                             footerLeftChildren={props.footerLeftChildren} cancelText={props.cancelText}
                             proceedText={props.proceedText} onCancel={closeModal} onProceed={props.onProceed}/>
            </div>
        </dialog>);
};

export default Modal;
