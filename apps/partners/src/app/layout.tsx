import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Partners Portal',
  description: 'CFCE Partners Portal',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className={inter.className}>
          <SessionProvider>{children}</SessionProvider>
        </div>
      </body>
    </html>
  );
}
