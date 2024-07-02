import {S3Client, PutObjectCommand, HeadObjectCommand} from '@aws-sdk/client-s3'

// Uploads buffer data to AWS IPFS pinning service
// Can be a file or text as metadata
// Data must be passed as buffer of bytes:
//   Text can be read as Buffer.from(text)
//   File can be read as fs.readFileSync(path)
// Mime type is required text/plain image/jpeg image/png
//export default async function ipfsUpload(fileId:string, bytes:Buffer, mimeType:string) {
export default async function ipfsUpload(fileId, bytes, mimeType) {
  console.log('IPFS UPLOAD')
  try {
    const region = process.env.IPFS_DEFAULT_REGION
    const bucket = process.env.IPFS_DEFAULT_BUCKET
    const point  = process.env.IPFS_API_ENDPOINT
    const apikey = process.env.IPFS_API_KEY
    const secret = process.env.IPFS_API_SECRET
    const gateway= process.env.IPFS_GATEWAY_URL
    const params = {
      Bucket: bucket,
      Key: fileId,
      ContentType: mimeType,
      Body: bytes
    }
    const config = {
      endpoint: point, 
      region: region,
      credentials: {
        accessKeyId: apikey,
        secretAccessKey: secret
      }
    }
    const client = new S3Client(config)
    const action = new PutObjectCommand(params)
    const result = await client.send(action)
    //console.log('PUT', result)
    if(!result?.ETag){
      return {success:false, error:'Error uploading file to IPFS'}
    }
    const head = new HeadObjectCommand({Bucket: bucket, Key: fileId})
    const data = await client.send(head)
    //console.log('GET', data)
    //data.$metadata.httpStatusCode === 200
    if(!data?.Metadata?.cid){
      return {success:false, error:'Error retrieving file info'}
    }
    const cid = data?.Metadata?.cid
    return {success:true, cid:cid, url:gateway+cid}
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.message}
  }
}
