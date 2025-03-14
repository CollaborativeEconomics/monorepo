import React from 'react';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <main className="flex-1">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
