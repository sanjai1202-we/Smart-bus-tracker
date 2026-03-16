import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-mono',
});

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
      <body className={`${syne.variable} ${jakarta.variable} ${ibmPlexMono.variable} font-body bg-routex-dark text-white antialiased`}>
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
