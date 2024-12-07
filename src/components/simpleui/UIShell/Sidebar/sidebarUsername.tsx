import React from "react";

export interface SidebarUsernameProps {
    first_name: string;
    last_name: string;
}
export const SidebarUsername: React.FC<SidebarUsernameProps> = (props: SidebarUsernameProps)=> {
    return (
            <p className="sidebar-username__text">{props.first_name + " "  + props.last_name}</p>
    );
}
