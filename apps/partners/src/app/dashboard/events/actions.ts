"use server"

import appConfig from "@cfce/app-config"
import { type EventType, newEvent } from "@cfce/database"
import { uploadDataToIPFS } from "@cfce/ipfs"

export const uploadToIPFS = async (fileName: string, file: File) => {
  // convert file to Uint8Array
  const bytes = new Uint8Array(await file.arrayBuffer())
  const cid = await uploadDataToIPFS(fileName, bytes, "image/jpeg")
  return `${appConfig.apis.ipfs.gateway}${cid}`
}

export const saveEvent = async (event: EventType) => {
  const res = await newEvent(event)
  const data = JSON.parse(JSON.stringify(res))
  return data
}
