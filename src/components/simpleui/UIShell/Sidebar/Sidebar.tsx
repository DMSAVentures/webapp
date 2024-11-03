import React from 'react'
import "./sidebar.scss"

export interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar(props: SidebarProps) {
    return (
        <div className={'sidebar-container'}>
            <div className={`sidebar-overlay ${props.isOpen ? 'visible' : ''}`} onClick={props.onClose}/>
            <aside className={`sidebar ${props.isOpen ? 'open' : ''}`}>
                <nav className={'sidebar-nav'}>
                </nav>
            </aside>
        </div>
    )
}
