import fs from 'fs'
import formidable, { PersistentFile } from 'formidable'
import Upload from 'utils/upload-vercel'

// Configure API route to allow multipart form data
export const config = { api: { bodyParser: false } }

// Must pass file, name, folder in form fields
// Folder may be empty to store in the root (not recommended)
export default async function handler(req, res) {
  const { method, headers, body } = req
  // TODO: Check if authorized

  if(method=='POST'){
    try {
      const form = formidable({})
      const [fields, files] = await form.parse(req)
      const file = files?.file?.[0] as PersistentFile
      console.log('FILE', file.originalFilename, file.newFilename, file.size, file.mimetype)
      const mime   = file.mimetype
      const name   = fields?.name || file.originalFilename
      const folder = fields?.folder || ''
      const bytes  = fs.readFileSync(file.filepath)
      const result = await Upload(bytes, name, mime, folder)
      if(result?.success){
        return res.json(result)
      } else {
        return res.status(400).json(result)
      }
    } catch(ex) {
      console.log({ ex })
      res.status(400).json({ success: false, error: ex?.message || 'Unknownn error uploading file' })
    }
  } else {
    res.status(500).json({ success: false, error:'Method not allowed' })
  }
}
