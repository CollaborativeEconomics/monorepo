import { useRouter } from 'next/router'
import React from 'react'
import Button from './button'

const BackButton = ({ className }: { className?: string }) => {
  const router = useRouter()
  return (
    <Button
      text="Back"
      className={`py-1 px-3 bg-green-700 text-white mb-4 ${className ?? ''}`}
      onClick={router.back}
    />
  )
}

export default BackButton