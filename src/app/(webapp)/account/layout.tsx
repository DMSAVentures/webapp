import {Column} from "@/components/simpleui/UIShell/Column/Column";
import React from "react";

export default function Layout({ children } : { children: React.ReactNode }) {
    return (
        <>
            <Column sm={{span: 7, start: 1}} >
                <h3>Account</h3>
            </Column>
            {children}
        </>
    )
}
