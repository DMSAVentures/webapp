import React from "react";
import "./sidebar.scss";

export interface SidebarProps {
    isOpen: boolean;
    children: React.ReactNode;
    onClose?: () => void;
}

export const SidebarCollapsible: React.FC<SidebarProps> = ({ isOpen, children, onClose }) => {
    return (
        <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
            {children}
        </aside>
    );
};
