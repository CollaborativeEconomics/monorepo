import { postApi } from '@/utils/api';

export default async function sendReceipt(data: any) {
  console.log('Sending receipt...', data);
  try {
    const result = await postApi('receipt', data);
    console.log('Result', result);
    return { success: true, result };
  } catch (ex: any) {
    console.warn('Error sending receipt', ex);
    return { success: false, error: ex.message };
  }
}
