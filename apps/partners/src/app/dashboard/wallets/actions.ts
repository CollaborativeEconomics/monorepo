'use server'

import { Chain, newWallet } from '@cfce/database';

export async function createWallet(orgId: string, data: { chain: Chain; address: string }) {
  try {
    const wallet = await newWallet({ ...data, organizations: { connect: { id: orgId } } });
    return { success: true, wallet };
  } catch (error) {
    console.error('Error creating wallet:', error);
    return { success: false, error: (error as Error).message };
  }
}