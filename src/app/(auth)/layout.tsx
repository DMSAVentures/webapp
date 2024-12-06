import './layout.scss'
import React from "react";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (<html lang="en">
        <body>
        {children} {/* No parent layout */}
        </body>
        </html>
    );
}
