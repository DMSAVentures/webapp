import React from "react";
import styles from "./sidebar.module.scss";

export interface SidebarProps {
    isOpen: boolean;
    children: React.ReactNode;
    onClose?: () => void;
}

export const SidebarCollapsible: React.FC<SidebarProps> = ({ isOpen, children }) => {
    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles['sidebar--open'] : ""}`}>
            {children}
        </aside>
    );
};
