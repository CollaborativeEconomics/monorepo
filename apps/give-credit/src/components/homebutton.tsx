import { useRouter } from 'next/router'
import React from 'react'
import Button from './button'

const HomeButton = () => {
  const router = useRouter()
  return (
    <Button
      text="Home"
      className="mt-4 ml-6 py-1 px-3 bg-slate-600 text-white mb-4"
      icon="home"
      onClick={() => router.push('/')}
    />
  )
}

export default HomeButton
