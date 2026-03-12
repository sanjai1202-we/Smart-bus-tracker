import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Smart Bus Tracker | Multi-College platform',
  description: 'Real-time bus tracking application for colleges',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bus Tracker',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen bg-background text-textMain antialiased">
        {children}
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #f1f5f9',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
          },
          duration: 4000,
        }} />
      </body>
    </html>
  );
}
