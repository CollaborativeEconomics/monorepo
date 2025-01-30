import Link from 'next/link'
 
export default function NotFound() {
  return (
    <main className="container h-full flex flex-col grow items-center justify-center mt-24">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-4xl">Not Found</h2>
        <p>The requested resource is unavailable</p>
        <Link href="/" className="underline text-blue-600">Return Home</Link>
      </div>
    </main>
  )
}