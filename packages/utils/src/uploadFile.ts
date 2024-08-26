import { put } from "@vercel/blob"

// upload stuff
export async function uploadFile({
  file,
  name,
  folder,
}: { file: File; name: string; folder: string }) {
  try {
    const mime = file.type || ""
    const size = file.size || 0
    //const bytes = Buffer(file.stream())
    //const bytes = file
    console.log("Uploading", `${folder}/${name}`, mime, size)
    if (size < 10) {
      console.log("Error: file size too small", size)
      return { success: false, error: "File size too small" }
    }
    if (size > 10000000) {
      console.log("Error: file size too big", size)
      return { success: false, error: "File size too big" }
    }
    // Upload to Vercel
    const path = folder ? `${folder}/${name}` : name
    console.log("Uploading", path)
    const result = await put(path, file, {
      access: "public",
      contentType: mime,
    })
    return { success: true, result }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "uploadFile unknown error",
    }
  }
}
