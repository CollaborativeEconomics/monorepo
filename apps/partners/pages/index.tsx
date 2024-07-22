import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from 'components/header';
import Footer from 'components/footer';
import Main from 'components/main';
import Title from 'components/title';
import LinkButton from 'components/linkbutton';

export default function Page() {
  const session = useSession();
  console.log('SESSION?', session);
  const loginText = 'Log in with your Google account';
  const [welcome, setWelcome] = useState(loginText);
  const [logged, setLogged] = useState(false);
  const [authed, setAuthed] = useState(false);

  function titleCase(str = '') {
    const words = str.toLowerCase().split(' ');
    for (var i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
  }

  useEffect(() => {
    var _session: any = session; // stupid hack as some keys are not part of the object
    const name = _session?.data?.user?.name ?? '';
    const orgId = _session?.data?.orgId ?? '';
    var welcomeText = 'Welcome ' + titleCase(name);
    if (!orgId) {
      welcomeText = 'You are not authorized, request access to the portal';
    }
    setWelcome(name ? welcomeText : loginText);
    setLogged(name ? true : false);
    setAuthed(orgId ? true : false);
  }, [session]);

  return (
    <>
      <Header />
      <Main>
        <Title text="Partners Portal" />
        <div className="py-4">
          <li>Monitor your crypto donations</li>
          <li>Create funding initiatives</li>
          <li>Update donors by creating Story NFTs</li>
          <li>Add or change crypto-wallets</li>
        </div>
        <h3 className="pt-12 pb-4">{welcome}</h3>
        {logged && authed && (
          <LinkButton
            className="mb-12"
            text="GO TO DASHBOARD"
            href="/dashboard/donations"
          />
        )}
      </Main>
      <Footer />
    </>
  );
}
