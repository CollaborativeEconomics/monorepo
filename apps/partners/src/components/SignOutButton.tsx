"use client"
import { signOut } from "next-auth/react"
import { revalidatePath } from "next/cache"

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  async function onSignout(){
    console.log('SIGNOUT')
    await signOut({ callbackUrl: '/' })
    revalidatePath('/')
  }

  return (
    <>
      <button type="button" onClick={onSignout} className={className}>
        Sign out
      </button>
    </>
  );
}
