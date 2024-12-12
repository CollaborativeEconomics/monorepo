import type { ReceiptEmailBody } from "@cfce/utils/mailgun"
import { postApi } from "~/utils/api"

export default async function sendReceipt(data: ReceiptEmailBody) {
  console.log("Sending receipt...", data)
  try {
    const result = await postApi("receipt", data)
    console.log("Result", result)
    return { success: true, result }
  } catch (ex) {
    console.warn("Error sending receipt", ex)
    return {
      success: false,
      error: ex instanceof Error ? ex.message : "Unknown error",
    }
  }
}
