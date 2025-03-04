import Dashboard from '~/components/dashboard';
import styles from '~/styles/dashboard.module.css';
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Dashboard>
      <SidebarProvider>
        <AppSidebar />
        <div className={styles.content}>
          <SidebarTrigger />
          {children}
        </div>
      </SidebarProvider>
    </Dashboard>
  )
}