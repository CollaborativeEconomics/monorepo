import Link from "next/link"
import styles from "~/styles/footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <a href="/terms">Terms and Conditions</a>
        </li>
        <span className={styles.spacer}>•</span>
        <li className={styles.navItem}>
          <Link href="/policy">Privacy Policy</Link>
        </li>
      </ul>
    </footer>
  )
}
