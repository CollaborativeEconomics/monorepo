import "server-only"
import fs from "node:fs"
import path from "node:path"
import { put } from "@vercel/blob"
import uploadDataToIPFS from "./uploadDataToIPFS"

export default async function uploadFileToIPFS(file: File): Promise<string> {
  // Get useful file info
  const name = path.basename(file.name ?? "")
  //const name = path.basename(file.originalFilename ?? "")
  //const mimeType = file.mimetype
  const mimeType = file.type
  if (!mimeType) {
    throw new Error("No MIME type found for file")
  }
  const size = file.size
  if (size > 10000000) {
    throw new Error("File size too big")
  }

  // Convert to bytes
  //const fileBuffer = fs.readFileSync(file.filepath)
  const buffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(buffer);
  const bytes = new Uint8Array(fileBuffer)

  // uploadDataToIPFS
  const ipfsCID = await uploadDataToIPFS(name, bytes, mimeType)

  // Also upload to Vercel Blob
  await put(ipfsCID, fileBuffer, { access: "public", contentType: mimeType })

  return ipfsCID
}
