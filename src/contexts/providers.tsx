'use client'
import React from "react";
import {SidebarProvider} from "@/contexts/sidebar.tsx";

export function Providers({children} : { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            {children}
        </SidebarProvider>
    );
}
