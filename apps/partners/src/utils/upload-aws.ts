import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3'

// Uploads buffer data to AWS bucket
// Can be a file or text as metadata
// Data must be passed as buffer of bytes:
//   Text can be read as Buffer.from(text)
//   File can be read as fs.readFileSync(path)
// Mime type is required text/plain image/jpeg image/png
//export default async function fileUpload(fileId:string, bytes:Buffer, mimeType:string) {
export default async function fileUpload(fileId, bytes, mimeType) {
  console.log('AWS UPLOAD')
  try {
    let region = process.env.AWS_DEFAULT_REGION
    let bucket = process.env.AWS_MEDIA_BUCKET
    let params = {
      Bucket: bucket,
      Key: fileId,
      ContentType: mimeType,
      Body: bytes
    }
    let config = {
      region: region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    }
    console.log('REGION', region)
    console.log('BUCKET', bucket)
    let client = new S3Client(config)
    let action = new PutObjectCommand(params)
    let result = await client.send(action)
    console.log('PUT', result)
    if(!result?.ETag){
      return {success:false, error:'Error uploading file, no ETag'}
    }
    return {success:true, image:fileId, type:mimeType, url:`https://${bucket}.s3.${region}.amazonaws.com/${fileId}`}
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.message}
  }
}
