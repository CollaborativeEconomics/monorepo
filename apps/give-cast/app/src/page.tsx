import { getFrameMetadata } from 'frog/web';
import type { Metadata } from 'next';
import Image from 'next/image';

import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL} || http://localhost:3000/api`
  );
  return {
    other: frameTags,
  };
}

export default function Home() {
  return (
    <main style={{ margin: 0, padding: 0 }}>
      <div>
        <Image
          src="/givecast.jpg"
          alt="Main Frame"
          width={1792}
          height={1024}
          priority
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </main>
  );
}
