'use server'

import { type Chain, newWallet } from '@cfce/database';

type WalletData = {
  chain: Chain;
  network: string;
  address: string;
  initiativeId: string;
};

export async function createWallet(orgId: string, data: WalletData) {
  try {
    const { chain, network, address, initiativeId } = data
    const record = { 
      chain, 
      network,
      address,
      organizations: { connect: { id: orgId } } ,
      initiatives: initiativeId ? { connect: { id: initiativeId } } : undefined
    }
    const wallet = await newWallet(record);
    return { success: true, wallet };
  } catch (error) {
    console.error('Error creating wallet:', error);
    return { success: false, error: (error as Error).message };
  }
}