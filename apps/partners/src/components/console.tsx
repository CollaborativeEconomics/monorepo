import { Inter } from "next/font/google"
import styles from "styles/dashboard.module.css"
import Dashboard from "~/components/dashboard"
import Sidebar from "~/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Give Partners",
  description: "Partners Portal for Give App",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>{children}</div>
    </Dashboard>
  )
}
