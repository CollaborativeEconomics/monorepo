import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@cfce/universe-components/header';
import Footer from '@cfce/universe-components/footer';
import Providers from '@cfce/universe-components/providers';
import { ConfigProvider } from '@cfce/universe-components/config'
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Give Credit',
  description: 'Watch your donations make an impact',
};

export default function RootLayout({children}: {children: React.ReactNode}){
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ inter.className + ' bg-gradient-to-b from-white min-h-screen to-gray-50 dark:from-accent dark:to-secondary' }>
        <ConfigProvider>
          <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            {children}
            <Footer />
          </Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}
