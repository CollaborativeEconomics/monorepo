import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className={`w-full mt-10 py-20 bg-white dark:bg-accent`}>
      <div className="flex flex-col lg:flex-row justify-between container">
        <div className="text-center lg:text-left">
          <Link href="/" className='block text-center'>
            <Logo />
          </Link>
          <p className="ml-0 lg:ml-16">by Center For Collaborative Economics</p>
        </div>
        <div className="mt-8 text-center lg:mt-0 lg:text-left">
          <h1 className='font-bold'>Know Us:</h1>
          <Link href="/" className='block'>Our Mission</Link>
          <Link href="/" className='block'>Our Partners</Link>
          <Link href="/" className='block'>Privacy Policy</Link>
          <Link href="/" className='block'>Terms and Conditions</Link>
        </div>
        <div className="mt-8 text-center lg:mt-0 lg:text-left">
          <h1 className='font-bold'>Follow Us:</h1>
          <Link href="/" className='block'>• Discord</Link>
          <Link href="/" className='block'>• Twitter</Link>
          <Link href="/" className='block'>• Facebook</Link>
          <Link href="/" className='block'>• Instagram</Link>
        </div>
      </div>
    </footer>
  )
}
