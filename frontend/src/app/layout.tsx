import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from '@/components/ROUTEX/ThemeProvider';
import { ThemeToggle } from '@/components/ROUTEX/ThemeToggle';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-background text-foreground antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="noise-overlay" />
          <div className="fixed top-6 right-6 z-[100]">
            <ThemeToggle />
          </div>
          {children}
          <Toaster position="top-right" toastOptions={{
            style: {
              background: 'var(--glass-bg)',
              color: 'var(--foreground)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              fontSize: '14px',
            },
          }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
