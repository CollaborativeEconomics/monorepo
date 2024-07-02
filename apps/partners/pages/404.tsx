import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <h1 className="text-8xl">404</h1>
      <h2 className="text-4xl">Not Found</h2>
      <p>We could not find the requested resource</p>
      <Link href="/" className="underline">Return Home</Link>
    </div>
  )
}