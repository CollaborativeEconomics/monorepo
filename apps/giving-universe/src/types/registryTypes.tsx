export interface Category {
  id: string;
  title: string;
  description: string;
  slug: string;
  color: string;
  organizations?: string[];
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  image: string;
  phone: string;
  mailingAddress: string;
  country: string;
  EIN: string;
  initiative: any[];
  wallets?: any[];
  walletIds: string[];
  inactive: boolean;
}
