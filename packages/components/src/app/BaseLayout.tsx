import { PostHogProvider } from "@cfce/analytics"
import { auth } from "@cfce/auth"
import { Footer, Header } from "@cfce/components/navigation"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import { Toaster } from "../ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export interface BaseLayoutProps {
  children: React.ReactNode
}

export async function BaseLayout({ children }: BaseLayoutProps) {
  const session = await auth()
  console.log("BL SESSION", session)
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gradient-to-b from-white min-h-screen to-gray-50 dark:from-accent dark:to-secondary h-full`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <PostHogProvider>{children}</PostHogProvider>
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
