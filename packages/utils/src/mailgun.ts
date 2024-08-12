import formData from "form-data"
// @ts-ignore tracking issue here: https://github.com/mailgun/mailgun.js/issues/415
import Mailgun from "mailgun.js"

export interface ReceiptEmailBody {
  date: string
  donorName: string
  organizationName: string
  address: string
  ein: string
  coinSymbol: string
  coinValue: string
  usdValue: string
}

const mailgun = new Mailgun(formData)
const mailgunClient = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
})

const sendEmailReceipt = async (email: string, body: ReceiptEmailBody) => {
  console.log("Emailing", { email, body })
  const emailResponse = await mailgunClient.messages.create(
    "givereceipts.cfce.io",
    {
      from: "receipts@givereceipts.cfce.io",
      to: email,
      subject: `Donation Receipt - $${body.usdValue} ${body.organizationName}`,
      template: "donation_receipt_universal",
      "h:X-Mailgun-Variables": JSON.stringify(body),
      "h:Reply-To": "info@cfce.io",
    },
  )
  console.log({ emailResponse })
  return emailResponse
}

export { sendEmailReceipt }
