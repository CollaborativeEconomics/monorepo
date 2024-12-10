import formData from "form-data"
import Mailgun from "mailgun.js"
import type { EmailBody } from "~/types"

const mailgun = new Mailgun(formData)
const mailgunClient = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
})

export const emailReceipt = async (email: string, body: EmailBody) => {
  console.log("Emailing", email)
  const emailResponse = await mailgunClient.messages
    .create("givereceipts.cfce.io", {
      from: "receipts@givecast.cfce.io",
      to: email,
      subject: `Donation Receipt - $${body.usdValue} ${body.organizationName}`,
      template: "donation_receipt_universal",
      "h:X-Mailgun-Variables": JSON.stringify(body),
      "h:Reply-To": "evan@cfce.io",
    })
    .catch(console.error)
  console.log("Mailing response", emailResponse)
  return emailResponse
}
