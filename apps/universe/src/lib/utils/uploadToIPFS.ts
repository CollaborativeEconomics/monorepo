import {S3Client, PutObjectCommand, HeadObjectCommand} from '@aws-sdk/client-s3'

// Uploads buffer data to AWS buckets
// Can be a file or text as metadata
// Data must be passed as buffer of bytes:
//   Text can be read as Buffer.from(text)
//   File can be read as fs.readFileSync(path)
// Mime type is required text/plain image/jpeg image/png
export default async function uploadToIPFS(fileId:string, bytes:Buffer, mimeType:string) {
  try {
    let endpoint = process.env.IPFS_API_ENDPOINT
    let accessKeyId = process.env.IPFS_API_KEY
    let secretAccessKey = process.env.IPFS_API_SECRET
    let region = process.env.IPFS_DEFAULT_REGION
    let bucket = process.env.IPFS_DEFAULT_BUCKET
    //console.log('BUCKET:', bucket)
    //console.log('ENDPOINT:', endpoint)
    //console.log('ACCESS:', accessKeyId)
    //console.log('SECRET:', secretAccessKey)
    //let config = {region, accessKeyId, secretAccessKey}
    //let config = { accessKeyId, secretAccessKey, endpoint, region }
    let config = { endpoint, region }
    let params = {
      Bucket: bucket,
      Key: fileId,
      ContentType: mimeType,
      Body: bytes
    }
    let client = new S3Client(config)
    let action = new PutObjectCommand(params)
    let result = await client.send(action)
    //console.log('PUT', result)
    if(!result?.ETag){
      return {error:'Error uploading file, no eTag'}
    }
    let head = new HeadObjectCommand({Bucket: bucket, Key: fileId})
    let data = await client.send(head)
    //console.log('GET', data)
    data.$metadata.httpStatusCode === 200
    if(!data?.Metadata?.cid){
      return {error:'Error retrieving file info'}
    }
    //return data?.Metadata?.cid
    return {success:true, result:data?.Metadata?.cid}
  } catch(ex:any) {
    console.error(ex)
    return {error:'Error uploading file: '+ex.message}
  }
}
