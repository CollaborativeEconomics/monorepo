import { PersistentFile } from 'formidable'
import path from 'path'
import fs from 'fs'
import { put } from "@vercel/blob";
import uploadDataToIPFS from './uploadDataToIPFS'

export default async function uploadFileToIPFS(file: PersistentFile): Promise<string> {
  // Get useful file info
  const name = path.basename(file.originalFilename)
  const mimeType = file.type
  // const size = file.size

  // Convert to bytes
  const fileBuffer = fs.readFileSync(file.filepath);
  const bytes = new Uint8Array(fileBuffer);

  // uploadDataToIPFS
  const ipfsCID = await uploadDataToIPFS(name, bytes, mimeType)

  // Also upload to Vercel Blob
  await put(ipfsCID, fileBuffer, { access: 'public', contentType: mimeType});

  return ipfsCID
}