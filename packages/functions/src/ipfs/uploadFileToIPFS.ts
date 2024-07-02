import path from 'path'
import fs from 'fs'
import { put } from "@vercel/blob";
import uploadDataToIPFS from './uploadDataToIPFS'
import { File } from 'formidable';

export default async function uploadFileToIPFS(file: File): Promise<string> {
  // Get useful file info
  const name = path.basename(file.originalFilename ?? '')
  const mimeType = file.mimetype
  if (!mimeType) {
    throw new Error('No MIME type found for file')
  }
  // const size = file.size

  // Convert to bytes
  const fileBuffer = fs.readFileSync(file.filepath);
  const bytes = new Uint8Array(fileBuffer);

  // uploadDataToIPFS
  const ipfsCID = await uploadDataToIPFS(name, bytes, mimeType)

  // Also upload to Vercel Blob
  await put(ipfsCID, fileBuffer, { access: 'public', contentType: mimeType });

  return ipfsCID
}