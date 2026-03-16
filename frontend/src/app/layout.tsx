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
        <link href="https://fonts.cdnfonts.com/css/clash-display" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-['Satoshi',sans-serif] bg-[var(--bg-base)] text-[var(--text-primary)] antialiased transition-colors duration-500 selection:bg-[var(--primary)] selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
          <div className="noise-overlay" />
          <div className="fixed top-6 right-6 z-[100]">
            <ThemeToggle />
          </div>
          {children}
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-glass)',
                color: 'var(--text-primary)',
                backdropFilter: 'blur(24px)',
                border: '1px solid var(--border-glass)',
                borderRadius: '16px',
                fontSize: '14px',
                fontFamily: 'Satoshi, sans-serif',
                boxShadow: 'var(--shadow-card)',
              },
            }} 
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
