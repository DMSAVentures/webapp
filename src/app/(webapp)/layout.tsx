import type { Metadata } from "next";
import React from "react";
import "./layout.scss";
import {Providers} from "@/contexts/providers";
import {Layout} from "@/components/simpleui/UIShell/Layout/Layout";
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
      <Layout title={""}>
        {children}
      </Layout>
    </Providers>
    </body>
    </html>
  );
}
