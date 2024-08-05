import { HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import type { File } from "formidable"
import { s3ClientMock } from "../../testSetup"
import uploadFileToIPFS from "../uploadFileToIPFS"

describe("uploadFileToIPFS", () => {
  test("should upload file to IPFS", async () => {
    const cid = "cid"
    s3ClientMock.on(PutObjectCommand).resolves({ ETag: "ETag" })
    s3ClientMock.on(HeadObjectCommand).resolves({ Metadata: { cid } })
    const id = uploadFileToIPFS(file)
    expect(id).resolves.toEqual(cid)
  })
})

const file: File = {
  size: 11, // Size of the file in bytes
  filepath: "/path/to/temporary/file", // Temporary file path
  originalFilename: "originalName.jpg", // Original name of the file
  newFilename: "newFileName.jpg", // New file name, typically after being processed by Formidable
  mimetype: "image/jpeg", // MIME type of the file
  mtime: new Date(), // Modification time, you can set it to the current time for the mock
  hash: null, // Depending on your Formidable configuration, this might be the hash of the file's content. Can be null for the mock.
  hashAlgorithm: "md5", // Assuming 'md5' is used, adjust according to your actual configuration
  toJSON: function () {
    return {
      size: this.size,
      filepath: this.filepath,
      originalFilename: this.originalFilename,
      newFilename: this.newFilename,
      mimetype: this.mimetype,
      mtime: this.mtime || null, // Ensure mtime is Date | null, providing null as a fallback
      hash: this.hash,
      hashAlgorithm: this.hashAlgorithm,
      length: 11,
    }
  },
}
