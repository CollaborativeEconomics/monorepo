import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import '~/styles/globals.css';
import Sidebar from '~/components/sidebar';

export const metadata: Metadata = {
  title: 'Partners Portal',
  description: 'CFCE Partners Portal',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
