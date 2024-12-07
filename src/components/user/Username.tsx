'use client'
import {useContext} from "react";
import {AuthContext} from "@/contexts/auth";
import {SidebarUsername} from "@/components/simpleui/UIShell/Sidebar/sidebarUsername";

export default function UserName() {
    const auth = useContext(AuthContext)
    if (!auth.user) {
        return null;
    }

    return (
        <SidebarUsername first_name={auth.user.first_name} last_name={auth.user.last_name} />
    );
}
