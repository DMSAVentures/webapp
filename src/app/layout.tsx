import type { Metadata } from "next";
import React from "react";
import {Providers} from "@/contexts/providers";

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
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      {/*<link*/}
      {/*    href="https://fonts.googleapis.com/css2?family=Radio+Canada+Big:ital,wght@0,400..700;1,400..700&display=swap"*/}
      {/*    rel="stylesheet"/>*/}
      <title>{metadata.title?.toString()}</title>
    </head>
    <body>
    <Providers>
          {children}
    </Providers>
    </body>
    </html>
  );
}
