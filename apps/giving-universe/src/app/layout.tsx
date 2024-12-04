import '~/styles/globals.css';

import { PostHogProvider } from '@cfce/analytics';
import appConfig from '@cfce/app-config';
import { Footer, Header } from '@cfce/universe-components/navigation';
import type { Metadata, Viewport } from 'next';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: appConfig.siteInfo.title,
  description: 'Watch your donations make an impact',
};

export const viewport: Viewport = { initialScale: 1.0, width: 'device-width' };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gradient-to-b from-white min-h-screen to-gray-50 dark:from-accent dark:to-secondary h-full`}
      >
        {/* <AppConfigLoader /> */}
        <Script
          src="../appConfig/setAppScript.js"
          strategy="beforeInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <PostHogProvider>
              <Header />
              {children}
              <Footer />
            </PostHogProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
