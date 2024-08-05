// nock is broken in bun, so we can't use it for now, ref: https://github.com/oven-sh/bun/issues/8781
// import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"

import { s3ClientMock } from "../../testSetup"
import metaUpload from "../uploadDataToIPFS"

describe("metaUpload", () => {
  test("should upload file to IPFS", async () => {
    s3ClientMock.on(PutObjectCommand).resolves({ ETag: "ETag" })
    s3ClientMock.on(HeadObjectCommand).resolves({ Metadata: { cid: "cid" } })
    // console.log(response);
    const data = "hello world"
    const fileId = "fileId"
    const bytes = Buffer.from(data)
    const mimeType = "text/plain"
    const result = await metaUpload(fileId, bytes, mimeType)
    expect(result).toEqual("cid")
  })

  test("should return error if file upload fails", async () => {
    const fileId = "fileId"
    const bytes = Buffer.from("bytes")
    const mimeType = "text/plain"
    s3ClientMock.on(PutObjectCommand).rejects("Error uploading file to IPFS")
    s3ClientMock.on(HeadObjectCommand).resolves({ Metadata: { cid: "cid" } })
    const response = metaUpload(fileId, bytes, mimeType)
    expect(response).rejects.toThrow("Error uploading file to IPFS")
  })

  test("should return error if file info retrieval fails", async () => {
    const fileId = "fileId"
    const bytes = Buffer.from("bytes")
    s3ClientMock.on(PutObjectCommand).resolves({ ETag: "ETag" })
    s3ClientMock.on(HeadObjectCommand).rejects("Error retrieving file info")
    const mimeType = "text/plain"
    const response = metaUpload(fileId, bytes, mimeType)
    expect(response).rejects.toThrow("Error retrieving file info")
  })

  test("should return error if an exception is thrown", async () => {
    const fileId = "fileId"
    const bytes = Buffer.from("bytes")
    const mimeType = "text/plain"
    s3ClientMock.on(PutObjectCommand).resolves({ ETag: "ETag" })
    s3ClientMock.on(HeadObjectCommand).callsFake(() => {
      throw new Error("Error uploading file to IPFS")
    })
    const response = metaUpload(fileId, bytes, mimeType)
    expect(response).rejects.toThrow("Error uploading file to IPFS")
  })
})
