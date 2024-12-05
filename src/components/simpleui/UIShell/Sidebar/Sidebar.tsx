import React from 'react'
import "./sidebar.scss"


export interface SidebarProps {
    children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
    return (
            <aside className={`sidebar`}>
                {props.children}
            </aside>
    )
}
