import type { ReactNode } from "react"
import { AppSidebar } from "~/components/app-sidebar"
import Dashboard from "~/components/dashboard"
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import styles from "~/styles/dashboard.module.css"

export default async function Layout({
  children,
  params,
}: { children: ReactNode; params: { orgId: string } }) {
  const orgId = await params.orgId
  console.log("ORG ID", orgId)
  return (
    <Dashboard>
      <SidebarProvider>
        <AppSidebar orgId={orgId} />
        <div className={styles.content}>
          <SidebarTrigger />
          {children}
        </div>
      </SidebarProvider>
    </Dashboard>
  )
}
