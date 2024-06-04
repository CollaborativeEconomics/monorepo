import { HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3ClientMock } from '../../../testSetup';
import uploadFileToIPFS from '../uploadFileToIPFS'

describe('uploadFileToIPFS', () => {
  const file = new File(['hello world'], 'hello.txt', { type: 'text/plain' });
  test('should upload file to IPFS', async () => {
    const cid = 'cid';
    s3ClientMock.on(PutObjectCommand).resolves({ ETag: 'ETag' });
    s3ClientMock.on(HeadObjectCommand).resolves({ Metadata: { cid } });
    const id = uploadFileToIPFS(file);
    expect(id).resolves.toEqual(cid);
  })
})