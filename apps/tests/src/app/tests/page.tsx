// import { createAnonymousUser } from '@cfce/auth';
// import type { Chain } from '@cfce/database';

export default async function Home() {
  /*
  async function createUser(){
    console.log('Creating user...')
    const user = await createAnonymousUser('0x1234567891', 'Tron' as Chain, 'testnet', true) // No TBA for now
    console.log('User', user)
    return JSON.stringify(user,null,4)
  }
  const result = await createUser()
*/
  const result = "OK"

  return (
    <>
      <div className="w-full top-0">
        <div className="container mt-48 mb-16 ml-6 md:ml-auto">
          <h1 className="mt-24 mb-8 text-4xl">CREATE USER</h1>
          <pre>{result}</pre>
        </div>
      </div>
    </>
  )
}
