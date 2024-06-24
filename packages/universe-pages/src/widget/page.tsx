import { headers } from 'next/headers'

export default async function Widget(props: any) {
  const hdrs = headers()
  const host = hdrs.get('host')
  const url  = 'https://'+host+'/api/widget/123456-789012'

  return (
    <main className="flex min-h-screen flex-col items-stretch container py-24 mt-24">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl mb-8">Carbon Credit Widget</h1>
        <iframe src="/api/widget/f4f96aee-741d-4c63-8af5-49340a10b58c" width="350px" height="350px" frameBorder="0">Browser not compatible with Widget</iframe>
        <p className="mt-8 mb-4">This is all you need to add this widget to your webpage:</p>
        <pre className="p-4 border rounded bg-gray-100">&lt;iframe src=&quot;{url}&quot; width=&quot;350px&quot; height=&quot;350px&quot; frameBorder=&quot;0&quot;&gt;&lt;/iframe&gt;</pre>
        <p className="mt-4 mb-4">Where 123456-789012 is your credit id, please contact support to get your id</p>
      </div>
    </main>
  )
}