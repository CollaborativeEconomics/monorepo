import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import ClientProviders from "../components/ClientProviders"

export const metadata: Metadata = {
  title: "Partners Portal",
  description: "CFCE Partners Portal",
}

export const viewport: Viewport = { initialScale: 1.0, width: "device-width" }

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
