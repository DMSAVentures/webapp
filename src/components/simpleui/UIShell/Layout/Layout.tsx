import React from 'react';
import 'remixicon/fonts/remixicon.css';

import { SidebarProvider, useSidebar } from "@/contexts/sidebar"
import styles from './layout.module.scss';
import {IconOnlyButton} from "@/components/simpleui/Button/IconOnlyButton";
import {Sidebar} from "@/components/simpleui/UIShell/Sidebar/Sidebar";
import Breadcrumb from "@/components/simpleui/breadcrumb/breadcrumb";
import BreadcrumbItem from "@/components/simpleui/breadcrumb/breadcrumbitem";
import { useRouter } from '@tanstack/react-router'
import { motion } from "motion/react"

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

const Header = () => {
    const { isOpen, toggleSidebar } = useSidebar();
    const path = useRouter().state.location.pathname
    const items = path.split('/').filter(Boolean);
    const breadcrumbitem = items.map((item, index) => {
        const href = '/' + items.slice(0, index + 1).join('/');
        const word = item.split('-').map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        return (
            <BreadcrumbItem key={item} state={'active'} path={href}>
                {word.join(" ")}
            </BreadcrumbItem>

        );
    });
    return (
        <header className={styles.header}>
            <IconOnlyButton iconClass={'menu-line'} ariaLabel={'menu'} onClick={toggleSidebar} variant={'secondary'}/>
            <Breadcrumb items={breadcrumbitem} divider={'arrow'}/>
        </header>
    );
}

const LayoutContent = ({ children, title = "Dashboard" }: LayoutProps) => {
    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <Sidebar />
            <main className={styles.content}>
                <Header/>
                <div className={styles.scrollArea}>
                    {children}
                </div>
            </main>
        </motion.div>
    );
};

// Wrapper component that provides the sidebar context
export function Layout({ children, title }: LayoutProps) {
    return (
        <SidebarProvider>
            <LayoutContent title={title}>{children}</LayoutContent>
        </SidebarProvider>
    );
}
