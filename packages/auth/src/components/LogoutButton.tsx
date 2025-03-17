"use client"
import { signOut } from "next-auth/react"
import React from "react"
// import { signOutAction } from "../actions"
import { Button } from "./Button"

export const LogoutButton = ({ className }: { className?: string }) => (
  <Button
    onClick={() => {
      console.log("SIGNOUT")
      // signOutAction()
      signOut({ redirectTo: "/" })
    }}
    className={className}
  >
    Log Out
  </Button>
)
