import { PropsWithChildren } from 'react'
import styles from 'styles/dashboard.module.css'

interface ItemProps {
  className?: string
}

const Content = ({
  className,
  children
}: PropsWithChildren<ItemProps>) => {
  return (
    <div className={styles.content}>
      {children}
    </div>
  )
}

export default Content
