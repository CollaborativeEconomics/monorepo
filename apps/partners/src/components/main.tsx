import Image from 'next/image';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';
import styles from '~/styles/main.module.css';

interface PageProps {
  className?: string;
}

const Main = ({ className, children }: PropsWithChildren<PageProps>) => {
  const mainClass = `${styles.mainArea} container ${className}`;
  return (
    <div className={styles.mainBox}>
      <main className={mainClass}>
        <Link href="/">
          <Image
            src="/give-logo.svg"
            alt="Give Logo"
            className={styles.mainImage}
            width={250}
            height={80}
          />
        </Link>
        {children}
      </main>
    </div>
  );
};

export default Main;
