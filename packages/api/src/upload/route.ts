import { put } from "@vercel/blob"

export async function POST(req: Request) {
  try {
    const data = await req.formData()
    //console.log('data', data)
    const name = data.get("name") as string
    const folder = data.get("folder") as string
    const fileBuffer = data.get("file") as File
    const mime = fileBuffer?.type ?? ""
    const size = fileBuffer?.size ?? 0
    //const bytes = Buffer(fileBuffer.stream())
    //const bytes = fileBuffer
    console.log("Uploading", `${folder}/${name}`, mime, size)
    if (size < 10) {
      console.log("Error: file size too small", size)
      return Response.json(
        { success: false, error: "File size too small" },
        { status: 500 },
      )
    }
    if (size > 10000000) {
      console.log("Error: file size too big", size)
      return Response.json(
        { success: false, error: "File size too big" },
        { status: 500 },
      )
    }
    // Upload to Vercel
    const path = folder ? `${folder}/${name}` : (name ?? "unnamed_file")
    const result = await put(path, fileBuffer, {
      access: "public",
      contentType: mime,
    })
    console.log("UPLOADED", result)
    return Response.json({ success: true, url: result?.url || "" })
  } catch (ex) {
    console.error("Error:", ex)
    return Response.json(
      {
        success: false,
        error: ex instanceof Error ? ex.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
