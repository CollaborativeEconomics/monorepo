import appConfig from "@cfce/app-config"

export default function imageUrl(img: string | null) {
  if (!img) {
    return "/noimage.png"
  }
  if (img?.startsWith("ipfs:")) {
    return appConfig.apis.ipfs.gateway + img.substr(5)
  }
  return img
}
