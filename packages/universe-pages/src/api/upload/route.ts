import * as fs from 'fs'
import upload from '@/utils/upload-vercel'

export async function POST(req: Request) {
  try {
    const data  = await req.formData()
    //console.log('data', data)
    const name = data.get('name')
    const fold = data.get('folder')
    const file = data.get('file')
    const mime = file['type'] || ''
    const size = file['size'] || 0
    //const bytes = Buffer(file.stream())
    //const bytes = file
    console.log('Uploading', fold+'/'+name, mime, size)
    if(size<10){
      console.log('Error: file size too small', size)
      return Response.json({success:false, error:'File size too small'}, {status:500})
    }
    if(size>10000000){
      console.log('Error: file size too big', size)
      return Response.json({success:false, error:'File size too big'}, {status:500})
    }
    // Upload to Vercel
    const ok = await upload(file, name, mime, fold)
    if(ok?.error){
      console.log('Error:', ok.error)
      return Response.json({success:false, error:ok.error}, {status:500})
    }
    console.log('UPLOADED', ok)
    return Response.json({success:true, url:ok.result?.url||''})
  } catch(ex) {
    console.error('Error:', ex)
    return Response.json({success:false, error:ex.message}, {status:500})
  }
}