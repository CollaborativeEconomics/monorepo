'use client';

import { signOutAction } from '../actions';
import { Button } from './Button';
import { redirect } from 'next/navigation'
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

export function LogoutButton() {
  // function goHome(){
  //   console.log('SIGNOUT')
  //   signOutAction()
  //   window.location.href = '/';
  //   //redirect('/')
  // }

  // Using manual cookie clearing approach since NextAuth's signOut() wasn't reliably clearing session cookies.
  // This ensures a clean logout by directly removing all next-auth.* cookies before redirecting.
  function handleSignOut() {  
    const cookies = document.cookie.split(';');
    
    // clear cookies
    for (const cookie of cookies) {
      const cookieName = cookie.split('=')[0].trim();
      // Clear next-auth session cookies
      if (cookieName.startsWith('next-auth')) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
      console.log(cookieName)
    }
  
    // Finally redirect to home page
    window.location.href = '/';
  }

  return <Button onClick={handleSignOut}>Log Out</Button>
}
