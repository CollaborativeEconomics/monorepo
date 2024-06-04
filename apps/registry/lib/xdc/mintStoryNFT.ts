import { XinFinServer } from '@cfce/blockchain-tools';

const XinFinSDK = new XinFinServer({ walletSeed: process.env.XINFIN_MINTER_SECRET, network: process.env.XINFIN_NETWORK });

const uuidToUint256 = (uuid: string) => {
  const hex = uuid.replace(/-/g, '');
  const bigIntUUID = BigInt('0x' + hex);
  // Since UUID is 128-bit, we shift it left by 128 places to fit into a 256-bit space
  const uint256 = bigIntUUID << BigInt(128);
  return uint256;
};

/**
 * Given a story ID, mint an NFT for the story
 * @param storyId Story ID from registry db
 * @param tokenCID CID from IPFS
 */
export default async function mintStoryNFT(storyId: string, tokenCID: string) {
  // const story = await getStoryById(storyId);
  const contract = process.env.XINFIN_NFT1155_CONTRACT;
  const wallet = process.env.XINFIN_MINTER_WALLET;
  const uint256 = uuidToUint256(storyId);
  console.log({ uint256, tokenCID, contract, wallet })

  // {success, error, txid, tokenCID}
  const response = await XinFinSDK.mintNFT1155(wallet, `${uint256}`, tokenCID, contract);
  if ('error' in response) {
    throw new Error(response.error);
    // return { success: false, error: response.error };
  }
  console.log('Minted NFT', response.txid, response.tokenId);
  return response;
}