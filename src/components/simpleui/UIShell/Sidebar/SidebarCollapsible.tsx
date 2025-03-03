import React from "react";
import "./sidebar.scss";

export interface SidebarProps {
    isOpen: boolean;
    children: React.ReactNode;
}

export const SidebarCollapsible: React.FC<SidebarProps> = ({ isOpen, children }) => {
    return (
        <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
            {children}
        </aside>
    );
};
