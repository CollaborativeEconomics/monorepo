import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import '~/styles/globals.css';
import ClientProviders from '../components/ClientProviders';

export const metadata: Metadata = {
  title: 'Partners Portal',
  description: 'CFCE Partners Portal',
};

export const viewport: Viewport = { initialScale: 1.0, width: 'device-width' };

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <ClientProviders>
            <main className="flex-1">{children}</main>
          </ClientProviders>
        </div>
      </body>
    </html>
  );
}
