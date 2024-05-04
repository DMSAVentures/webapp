import type { Metadata } from "next";
import "./globals.scss";

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
      <title>{metadata.title?.toString()}</title>
    </head>
    <body>{children}</body>
    </html>
  );
}
