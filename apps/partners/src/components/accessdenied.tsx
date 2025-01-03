import { signIn } from "@cfce/auth"
import Link from "next/link"
import Main from "~/components/main"
import Title from "~/components/title"

export default function AccessDenied() {
  return (
    <Main>
      <Title text="Partner Portal" />
      <h1>ACCESS DENIED</h1>
      <p className="pb-24">
        <Link
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault()
            signIn()
          }}
        >
          You must be signed in to view this page
        </Link>
      </p>
    </Main>
  )
}
