import formData from 'form-data'
import Mailgun from 'mailgun.js'

interface EmailBody {
  address?: string
  coinSymbol: string
  coinValue: string
  date: string
  donorName: string
  ein?: string
  organizationName: string
  usdValue: string
}

const mailgun = new Mailgun(formData)
const mailgunClient = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || ''
})

const emailReceipt = async (email: string, body: EmailBody) => {
  console.log('Emailing', email)
  const emailResponse = await mailgunClient.messages
    .create('givereceipts.cfce.io', {
      from: 'receipts@give.cfce.io',
      to: email,
      subject: `Donation Receipt - $${body.usdValue} ${body.organizationName}`,
      template: 'donation_receipt_universal',
      'h:X-Mailgun-Variables': JSON.stringify(body),
      'h:Reply-To': 'evan@cfce.io'
    })
    .catch(console.error)
  console.log('Mailing response', emailResponse)
  return emailResponse
}

export default emailReceipt
