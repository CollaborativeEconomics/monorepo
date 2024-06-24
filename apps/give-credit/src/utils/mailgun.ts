import formData from 'form-data';
import Mailgun from 'mailgun.js';

interface EmailBody {
  date: string;
  donorName: string;
  organizationName: string;
  address: string;
  ein: string;
  coinSymbol: string;
  coinValue: string;
  usdValue: string;
  xrp: string;
  usd: string;
}

const mailgun = new Mailgun(formData);
const mailgunClient = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY||''
});

const sendReceipt = async (email: string, body: EmailBody) => {
  console.log('Emailing', { email, body });
  const emailResponse = await mailgunClient.messages
    .create('givereceipts.cfce.io', {
      from: 'receipts@givexrp.cfce.io',
      to: email,
      subject: `Donation Receipt - $${body.usdValue} ${body.organizationName}`,
      template: 'donation_receipt_xlm',
      'h:X-Mailgun-Variables': JSON.stringify(body),
      'h:Reply-To': 'info@cfce.io'
    })
    .catch(console.error);
  console.log({ emailResponse });
  return emailResponse;
};

export { sendReceipt };
