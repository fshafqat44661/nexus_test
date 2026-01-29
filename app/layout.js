import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-outfit',
});

export const metadata = {
    title: 'Nexus Dashboard',
    description: 'Premium Analytics Dashboard',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={outfit.className}>
                <AuthProvider>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            style: {
                                background: '#1e293b',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.1)',
                            },
                        }}
                    />
                </AuthProvider>
            </body>
        </html>
    );
}
