import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { appConfig } from "@cfce/utils"

// Uploads buffer data to AWS IPFS pinning service
// Can be a file or text as metadata
// Data must be passed as buffer of bytes:
//   Text can be read as Buffer.from(text)
//   File can be read as fs.readFileSync(path)
// Mime type is required text/plain image/jpeg image/png
export default async function upload(
  fileId: string,
  bytes: Buffer,
  mimeType: string,
) {
  try {
    const params = {
      Bucket: appConfig.apis.ipfs.buckets.nfts,
      Key: fileId,
      ContentType: mimeType,
      Body: bytes,
    }
    const config = {
      endpoint: process.env.IPFS_API_ENDPOINT || "",
      region: process.env.AWS_DEFAULT_REGION || "",
    }
    const client = new S3Client({
      endpoint: appConfig.apis.ipfs.endpoint,
      region: appConfig.apis.ipfs.region,
      accessKeyId: process.env.IPFS_API_KEY,
      secretAccessKey: process.env.IPFS_API_SECRET,
    })
    const action = new PutObjectCommand(params)
    const result = await client.send(action)
    //console.log('PUT', result)
    if (!result?.ETag) {
      return { error: "Error uploading file, no eTag" }
    }
    const head = new HeadObjectCommand({
      Bucket: process.env.AWS_NFT_BUCKET || "",
      Key: fileId,
    })
    const data = await client.send(head)
    //console.log('GET', data)
    //data.$metadata.httpStatusCode === 200
    if (!data?.Metadata?.cid) {
      return { error: "Error retrieving file info" }
    }
    return data?.Metadata?.cid
  } catch (ex: any) {
    console.error(ex)
    if (ex instanceof Error) {
      return { error: `Error uploading file: ${ex.message}` }
    }
    return { error: "Error uploading file" }
  }
}
