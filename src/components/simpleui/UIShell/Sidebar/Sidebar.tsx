import React from 'react'
import "./sidebar.scss"


export interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
    return (
        <div className={`sidebar-container`}>
            <div className={`sidebar-overlay ${props.isOpen ? 'visible' : ''}`} onClick={props.onClose}/>
            <aside className={`sidebar ${props.isOpen ? 'open' : ''}`}>
                {props.children}
            </aside>
        </div>
    )
}
