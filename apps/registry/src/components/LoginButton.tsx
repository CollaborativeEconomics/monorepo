import { auth, githubLogin, signIn, signOutAction } from "@cfce/auth"
import React from "react"

export default async function LoginButton() {
  const session = await auth()
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <form action={signOutAction}>
          <button type="submit">Sign out</button>
        </form>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <form action={githubLogin}>
        <button type="submit">Sign in</button>
      </form>
    </>
  )
}
