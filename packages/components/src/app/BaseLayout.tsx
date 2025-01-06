import { PostHogProvider } from '@cfce/analytics';
import { Footer, Header } from '@cfce/components/navigation';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { ToastProvider } from '../ui/toast';
import { Toaster } from '../ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export interface BaseLayoutProps {
  children: React.ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gradient-to-b from-white min-h-screen to-gray-50 dark:from-accent dark:to-secondary h-full`}
      >
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
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
