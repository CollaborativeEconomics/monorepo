import { PropsWithChildren } from 'react'
import styles from 'styles/dashboard.module.css'

interface PageProps {
  className?: string
}

const Dashboard = ({
  className,
  children
}: PropsWithChildren<PageProps>) => {
  return (
    <div className={styles.dashboard}>
      {children}
    </div>
  )
}

export default Dashboard
