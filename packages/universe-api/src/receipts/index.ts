import { type ReceiptEmailBody, sendEmailReceipt } from '@cfce/utils';
import type { NextRequest } from 'next/server';

interface ReceiptData extends ReceiptEmailBody {
  email: string;
}

interface Context {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, context: Context) {
  const id = context?.params?.id || '';
  try {
    const receiptData: ReceiptData = await request.json();
    const emailResponse = await sendEmailReceipt(
      receiptData.email,
      receiptData,
    );
    const res = { success: true, id, ...emailResponse };
    console.log('UPDATED', res);
    return Response.json(res);
  } catch (ex) {
    console.error(ex);
    if (ex instanceof Error) {
      return Response.json(
        { success: false, error: ex.message },
        { status: 500 },
      );
    }
    return Response.json(
      { success: false, error: 'Unknown errror sending email receipt' },
      { status: 500 },
    );
  }
}