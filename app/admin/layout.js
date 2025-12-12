import "../globals.css";

export const metadata = {
    title: 'Admin - Scorpio Textiles',
    description: 'Admin dashboard for Scorpio Textiles',
};

export default function AdminLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-gray-50">
                {children}
            </body>
        </html>
    );
}
