export default function getIPFSUrl(cid: string) {
  return `${process.env.IPFS_GATEWAY_URL}${cid}`
}