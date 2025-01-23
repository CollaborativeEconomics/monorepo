import appConfig from "@cfce/app-config"

export default function ipfsCIDToUrl(img: string | null) {
  if (!img) {
    return "/noimage.png"
  }
  if (img?.startsWith("ipfs:")) {
    return appConfig.apis.ipfs.gateway + img.slice(5)
  }
  return img
}
