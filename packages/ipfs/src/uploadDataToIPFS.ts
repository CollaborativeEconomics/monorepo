import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import appConfig from "@cfce/app-config"
// import { HttpResponse } from "@aws-sdk/protocol-http";
import type { HttpResponse } from "@smithy/protocol-http"

// Uploads buffer data to AWS IPFS pinning service
// Can be a file or text as metadata
// Data must be passed as buffer of bytes:
//   Text can be read as Buffer.from(text)
//   File can be read as fs.readFileSync(path)
// Mime type is required text/plain image/jpeg image/png
export default async function uploadDataToIPFS(fileId: string, bytes: Uint8Array, mimeType: string): Promise<string> {
  // Filebase IPFS Config
  const region = appConfig.apis.ipfs.region
  const bucket = appConfig.apis.ipfs.buckets.nfts
  const point = appConfig.apis.ipfs.endpoint
  const apikey = process.env.IPFS_API_KEY
  const secret = process.env.IPFS_API_SECRET
  // const gateway = appConfig.apis.ipfs.gateway
  if (!apikey || !secret) {
    throw ('IPFS API Key or Secret not found')
  }

  const uploadInput = {
    Bucket: bucket,
    Key: fileId,
    ContentType: mimeType,
    Body: bytes
  }
  const s3Config = {
    endpoint: point,
    region: region,
    credentials: {
      accessKeyId: apikey,
      secretAccessKey: secret
    }
  }

  // console.log({ region, bucket, point, apikey, secret, gateway})

  // Upload bytes to IPFS
  const client = new S3Client(s3Config)
  const action = new PutObjectCommand(uploadInput)

let cid: string | undefined = "";

action.middlewareStack.add(
    (next) => async (args) => {
      // Check if request is incoming as middleware works both ways
      const response = await next(args);
      //console.log("Response", response)
      if (!isHttpResponse(response.response)) return response;

      cid = response.response.headers["x-amz-meta-cid"];
      return response;
    },
    {
      step: "build",
      name: "addCidToOutput",
    },
  );

  const result = await client.send(action)
  console.log("Result", result)
  console.log("Cid", cid)
  return cid
  //   console.log("Result", result)

//   // failed to succesfully upload file
//   if (!result?.ETag) {
//     throw new Error('Error uploading file to IPFS')
//   }

//   // Get the file data from IPFS
//   const head = new HeadObjectCommand({ Bucket: bucket, Key: fileId })
//   const data = await client.send(head)
//   console.log("Data", data)
//   // couldn't get it for some reason
//   if (!data?.Metadata?.cid) {
//     throw new Error('Error retrieving file info')
//   }

//   // return the IPFS CID
//   const cid = data?.Metadata?.cid
//   return cid
// }
}

function isHttpResponse(obj: unknown): obj is HttpResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "statusCode" in obj &&
    "headers" in obj
  )
}