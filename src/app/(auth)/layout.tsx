import './layout.scss'
export default function RootLayout({ children }) {
    return (<html lang="en">
        <body>
        {children} {/* No parent layout */}
        </body>
        </html>
    );
}
