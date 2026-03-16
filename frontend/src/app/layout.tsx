import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

// Reverting to standard font variables to avoid ESM URL scheme issues on S: drive
const syne = { variable: '' };
const jakarta = { variable: '' };
const ibmPlexMono = { variable: '' };

export const metadata: Metadata = {
  title: 'ROUTEX | Cinematic Transit Experience',
  description: 'Next-Generation Real-Time College Transit',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ROUTEX',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-routex-dark text-white antialiased">
        <div className="noise-overlay" />
        {children}
        <Toaster position="top-right" toastOptions={{
          style: {
            background: 'rgba(23, 23, 37, 0.8)',
            color: '#FFFFFF',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            fontSize: '14px',
          },
        }} />
      </body>
    </html>
  );
}
