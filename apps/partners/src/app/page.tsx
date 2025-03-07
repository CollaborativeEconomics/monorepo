import { redirect } from 'next/navigation';
import { auth } from '@cfce/auth';

export default async function HomePage() {
  const session = await auth();
  //console.log('SESSION', session)
  const orgId = session?.orgId ?? '';
  const isAuthed = !!orgId;

  if(isAuthed){
    redirect('/dashboard')
  } else {
    redirect('/api/auth/signin')
  }

  return (
    <>
      <p>Wait...</p>
    </>
  )
}