import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex flex-col min-h-screen container mt-12 pt-48 items-center">
      <h1 className="text-8xl text-blue-600 mb-6 tracking-widest">404</h1>
      <h2 className="text-4xl font-bold mb-6">Page Not Found</h2>
      <h3 className="mb-6">Sorry, we couldn’t find the page you’re looking for</h3>
      <Link href="/" className="text-white bg-blue-600 px-8 py-2 rounded">Go back home</Link>
    </main>
  )
}