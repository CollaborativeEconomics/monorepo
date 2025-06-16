"use server"

import appConfig from "@cfce/app-config"
import { type EventType, newEvent } from "@cfce/database"
import { uploadDataToIPFS } from "@cfce/ipfs"
import { Decimal } from "decimal.js"

export const uploadToIPFS = async (fileName: string, file: File) => {
  // convert file to Uint8Array
  const bytes = new Uint8Array(await file.arrayBuffer())
  const cid = await uploadDataToIPFS(fileName, bytes, "image/jpeg")
  return `${appConfig.apis.ipfs.gateway}${cid}`
}

export const saveEvent = async (event: EventType) => {
  // Convert payrate to Decimal if it's a number
  const eventWithDecimal = {
    ...event,
    payrate: new Decimal(event.payrate || 0),
  }
  const res = await newEvent(eventWithDecimal)
  const data = JSON.parse(JSON.stringify(res))
  return data
}
