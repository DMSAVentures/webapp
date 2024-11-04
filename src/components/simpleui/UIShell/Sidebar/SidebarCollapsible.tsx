import React from 'react'
import "./sidebar.scss"


export interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const SidebarCollapsible: React.FC<SidebarProps> = (props: SidebarProps) => {
    return (
        <div className={`sidebar-container ${props.isOpen ? 'expanded' : ''}`}>
            <div className={`sidebar-overlay ${props.isOpen ? 'visible' : ''}`} onClick={props.onClose}/>
            <aside className={`sidebar ${props.isOpen ? 'sidebar--collapsible open' : ''}`}>
                {props.children}
            </aside>
        </div>
    )
}
