import { auth } from "@cfce/auth"
import startCase from "lodash/startCase"
import React from "react"
import AuthHeader from "~/components/auth-header"
import Footer from "~/components/footer"
import LinkButton from "~/components/linkbutton"
import Main from "~/components/main"
import Title from "~/components/title"

export default async function HomePage() {
  const session = await auth()
  console.log("SESSION", session)
  const name = session?.user?.name ?? ""
  const orgId = session?.orgId ?? ""
  const isLogged = !!name
  const isAuthed = !!orgId

  let welcomeText = "Log in with your Google account"
  if (isLogged) {
    welcomeText = isAuthed
      ? `Welcome ${startCase(name)}`
      : "You are not authorized, request access to the portal"
  }

  return (
    <>
      <AuthHeader />
      <Main>
        <Title text="Partners Portal" />
        <div className="py-4">
          <li>Monitor your crypto donations</li>
          <li>Create funding initiatives</li>
          <li>Update donors by creating Story NFTs</li>
          <li>Add or change crypto-wallets</li>
        </div>
        <h3 className="pt-12 pb-4">{welcomeText}</h3>
        {isLogged && isAuthed && (
          <LinkButton
            className="mb-12"
            text="GO TO DASHBOARD"
            href="/dashboard/donations"
          />
        )}
      </Main>
      <Footer />
    </>
  )
}
