import { NextApiRequest, NextApiResponse } from 'next'
import * as fs from 'fs'
import * as formidable from 'formidable'
import fileUpload from 'utils/upload-aws'
import ipfsUpload from 'utils/upload-ipfs'

// To avoid bodyParser corrupting file data
export const config = {
  api: {
    bodyParser: false
  }
}

export default async function UploadHandler(req:NextApiRequest, res:NextApiResponse){
  try {
    const form = new formidable.IncomingForm()
    const [data, files] = await form.parse(req)
    console.log('data', data)
    console.log('file', files)
    const name = data.name[0]
    const file = files.file[0]
    const path = file.filepath
    const mime = file.mimetype
    //const orig = file.originalFilename
    //const size = file.size
    console.log('Uploading', name, path, mime)
    const bytes = fs.readFileSync(path)
    fs.unlinkSync(path)

    // awsUpload
    //const resp = await fileUpload(name, bytes, mime)
    //if(resp.error){
    //  return res.status(500).json({success:false, error:resp.error})
    //}
    
    // ipfsUpload
    const ipfs = await ipfsUpload(name, bytes, mime)
    if(ipfs.error){
      console.log('IPFS Error:', ipfs.error)
      return res.status(500).json({success:false, error:ipfs.error})
    }
    console.log('IPFS OK', ipfs)
    return res.status(200).json({success:true, image:'?', type:'??', url:'???', ipfs:'ipfs:'+ipfs.cid, uri:ipfs.url})
    //return res.status(200).json({success:true, image:resp.image, type:resp.type, url:resp.url, ipfs:'ipfs:'+ipfs.cid, uri:ipfs.url})
  } catch(ex) {
    console.error('IPFS Error:', ex)
    return res.status(500).json({success:false, error:ex.message})
  }
}