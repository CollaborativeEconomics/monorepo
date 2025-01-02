"use client"

import { signOutAction } from "../actions"
import { Button } from "./Button"
import { redirect } from "next/navigation"
import type { FC } from "react"
// note sure why all this csrf stuff was needed? \/\/\/
// Note: Logout works with a direct link to NextAuth's unbranded /api/auth/signout
// however signOut does not appear to work consistently (e.g. doesn't clear session) and may cause redirect loops

// async function fetchCsrfToken() {
//   const response = await fetch('/api/auth/csrf');
//   const data = await response.json();
//   return data.csrfToken;
// }

// async function manualSignOut() {
//   const csrfToken = await fetchCsrfToken();

//   const formData = new URLSearchParams();
//   formData.append('csrfToken', csrfToken);
//   formData.append('json', 'true');

//   const response = await fetch('/api/auth/signout', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: formData.toString(),
//   });

//   if (response.ok) {
//     console.log('Signed out successfully');

//     // Additional post processing after signout and the session is cleared...

//     window.location.href = '/';
//   } else {
//     console.error('Failed to sign out');
//   }
// }

export const LogoutButton: FC = () => {
  async function goHome() {
    console.log("SIGNOUT")
    await signOutAction()
    window.location.href = "/"
    console.log("REDIRECTING TO HOME")
    // redirect('/');
  }

  return <Button onClick={goHome}>Log Out</Button>
}
