import { S3Client } from "@aws-sdk/client-s3"
import { mockClient } from "aws-sdk-client-mock"
import "@smithy/types"

const s3ClientMock = mockClient(S3Client)

jest.mock("@vercel/blob", () => ({
  put: jest.fn().mockResolvedValue("abcd1234"),
}))

export { s3ClientMock }
