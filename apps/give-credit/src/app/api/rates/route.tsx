import {
  type ChainSlugs,
  type TokenTickerSymbol,
  getCoinRate,
} from '@cfce/blockchain-tools';

export async function GET(request: Request) {
  const requrl = new URL(request.url);
  const symbol = (
    requrl.searchParams.get('coin') || ''
  ).toUpperCase() as TokenTickerSymbol;
  const chain = (
    requrl.searchParams.get('chain') || ''
  ).toUpperCase() as ChainSlugs;
  console.warn('Getting CMC ticker for symbol', symbol);
  let rate;
  try {
    return getCoinRate({ symbol, chain });
  } catch (ex) {
    console.error('Error in CMC ticker:', ex);
  }
  return Response.json(rate);
}
