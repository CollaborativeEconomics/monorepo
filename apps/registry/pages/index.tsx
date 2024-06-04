import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import styles from 'styles/Home.module.css';
import Page from 'components/Page';
import Button from 'components/Button';
import LoginButton from 'components/LoginButton';


export default function Home() {
  const router = useRouter()

  async function login() {
    router.push('/admin')
  }

  return (
    <Page title="Registry" className="mx-auto w-[400px] rounded-2xl px-14 py-12 mb-4">
      <main className={styles.main}>
        <h1 className="text-2xl font-bold tracking-widest mx-0 px-0 mb-6 text-center">REGISTRY</h1>
        {/*<LoginButton />*/}
        {/* <Button text='Login with Metamask' onClick={()=>login()} /> */}
      </main>
      <footer className={styles.footer}>
        CFCE 2023 &copy; All rights reserved 
      </footer>
    </Page>
  );
}
