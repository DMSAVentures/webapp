import type { Metadata } from "next";
import React from "react";
import "./layout.scss";
import {UIShellWithCollapsibleNavigation} from "@/components/simpleui/UIShell/Shell/UIShellWithCollapsibleNavigation";
import {SidebarContent} from "@/components/simpleui/UIShell/Sidebar/sidebarContent";
import {SidebarGroup} from "@/components/simpleui/UIShell/Sidebar/sidebarGroup";
import {SidebarItem} from "@/components/simpleui/UIShell/Sidebar/sidebarItem";
import {SidebarFooter} from "@/components/simpleui/UIShell/Sidebar/SidebarFooter";
import {Providers} from "@/contexts/providers";
import UserName from "@/components/user/Username";
import HeaderLogo from "@/components/simpleui/UIShell/Header/HeaderLogo";
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: "Prototype App",
  description: "Welcome to the prototype app!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={'anonymous'}/>
      {/*<link*/}
      {/*    rel="preload"*/}
      {/*    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"*/}
      {/*    as="style"*/}
      {/*/>*/}
      {/*<link*/}
      {/*    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"*/}
      {/*    rel="stylesheet"*/}
      {/*/>*/}
      <title>{metadata.title?.toString()}</title>
    </head>
    <body>
    <Providers>
      <UIShellWithCollapsibleNavigation>
        <SidebarContent>
          <HeaderLogo logo={"DMSA"} />
          <SidebarGroup label="Main">
            <SidebarItem label="Dashboard" href="#dashboard" iconClass="dashboard-line"/>
            <SidebarItem label="Reports" href="#reports" iconClass="file-chart-line"/>
          </SidebarGroup>
          <SidebarFooter>
            <UserName/>
            <SidebarGroup label="Settings">
              <SidebarItem label="Account" href="/account" iconClass="user-line"/>
            </SidebarGroup>
          </SidebarFooter>
        </SidebarContent>
        {children}
      </UIShellWithCollapsibleNavigation>
    </Providers>
    </body>
    </html>
  );
}
