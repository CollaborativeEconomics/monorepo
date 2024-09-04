import Button from 'components/Button';
import LoginButton from 'components/LoginButton';
import Page from 'components/Page';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from 'styles/Home.module.css';

export default function Home() {
  const router = useRouter();

  async function login() {
    router.push('/admin');
  }

  return (
    <Page
      title="Registry"
      className="mx-auto w-[400px] rounded-2xl px-14 py-12 mb-4"
    >
      <main className={styles.main}>
        <h1 className="text-2xl font-bold tracking-widest mx-0 px-0 mb-6 text-center">
          REGISTRY
        </h1>
        {/*<LoginButton />*/}
        {/* <Button text='Login with Metamask' onClick={()=>login()} /> */}
      </main>
      <footer className={styles.footer}>
        CFCE 2024 &copy; All rights reserved
      </footer>
    </Page>
  );
}
