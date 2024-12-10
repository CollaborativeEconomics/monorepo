export enum Chain {
  Arbitrum,
  Avalanche,
  Base,
  Binance,
  Celo,
  EOS,
  Ethereum,
  Filecoin,
  Flare,
  Optimism,
  Polygon,
  Stellar,
  Starknet,
  XDC,
  XRPL,
}

export interface Donation {
  id: string;
  created: Date;
  organizationId: string;
  chapterId?: string;
  initiativeId?: string;
  userId?: string;
  paytype?: string;
  network?: string;
  wallet?: string;
  amount: number;
  usdvalue: number;
  asset?: string;
  issuer?: string;
  status: number;
  categoryId?: string;
  chain?: Chain;
}

export interface EmailBody {
  address?: string;
  coinSymbol: string;
  coinValue: string;
  date: string;
  donorName?: string;
  ein?: string;
  organizationName: string;
  usdValue: string;
}
