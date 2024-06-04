import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from './header';
import Footer from './footer';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Giving Universe',
  description: 'Watch your donations make an impact',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={
          inter.className + ' bg-gradient-to-b from-white min-h-screen to-gray-50 dark:from-accent dark:to-secondary'
        }
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
