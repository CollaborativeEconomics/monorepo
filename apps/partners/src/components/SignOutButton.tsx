"use client"
import React from "react"
import { signOutAction } from "@cfce/auth"
import { redirect } from "next/navigation"

interface SignOutButtonProps {
  className?: string
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  async function onSignout() {
    console.log("SIGNOUT")
    await signOutAction()
    window.location.href = "/"
    redirect("/")
  }

  return (
    <>
      <button type="button" onClick={onSignout} className={className}>
        Sign out
      </button>
    </>
  )
}
