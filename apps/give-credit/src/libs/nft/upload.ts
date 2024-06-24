import {S3Client, PutObjectCommand, HeadObjectCommand} from '@aws-sdk/client-s3'


// Uploads buffer data to AWS IPFS pinning service
// Can be a file or text as metadata
// Data must be passed as buffer of bytes:
//   Text can be read as Buffer.from(text)
//   File can be read as fs.readFileSync(path)
// Mime type is required text/plain image/jpeg image/png
export default async function upload(fileId:string, bytes:Buffer, mimeType:string) {
  try {
    let params = {
      Bucket: process.env.AWS_NFT_BUCKET||'',
      Key: fileId,
      ContentType: mimeType,
      Body: bytes
    }
    let config = {endpoint: process.env.IPFS_API_ENDPOINT||'', region: process.env.AWS_DEFAULT_REGION||''}
    let client = new S3Client(config)
    let action = new PutObjectCommand(params)
    let result = await client.send(action)
    //console.log('PUT', result)
    if(!result?.ETag){
      return {error:'Error uploading file, no eTag'}
    }
    let head = new HeadObjectCommand({Bucket: process.env.AWS_NFT_BUCKET||'', Key: fileId})
    let data = await client.send(head)
    //console.log('GET', data)
    //data.$metadata.httpStatusCode === 200
    if(!data?.Metadata?.cid){
      return {error:'Error retrieving file info'}
    }
    return data?.Metadata?.cid
  } catch(ex:any) {
    console.error(ex)
    return {error:'Error uploading file: '+ex.message}
  }
}
