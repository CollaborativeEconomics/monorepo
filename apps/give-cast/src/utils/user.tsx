import { getRandomValues } from 'node:crypto';
import { getUserByWallet, newUser } from '~/utils';

function UUID() {
  const buf = getRandomValues(new Uint8Array(16));
  const hex = Array.from(buf)
    .map(x => {
      return x.toString(16).padStart(2, '0');
    })
    .join('');
  const ret = `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(
    12,
    4,
  )}-${hex.substr(16, 4)}-${hex.substr(20)}`;
  return ret;
}

function anonymousUser(address: string, chain: string) {
  const uuid = UUID();
  const user = {
    created: new Date().toJSON(),
    api_key: uuid,
    name: 'Anonymous',
    description: '',
    email: `${uuid}@example.com`,
    emailVerified: false,
    image: '',
    inactive: false,
    wallet: address || '',
    wallets: {
      create: [
        {
          chain: chain || '',
          address: address || '',
        },
      ],
    },
  };
  return user;
}

export async function checkUser(address: string) {
  const userResp = await getUserByWallet(address);
  let user = userResp?.result;
  if (!user) {
    const anon = anonymousUser(address, 'Arbitrum');
    user = await newUser(anon);
    console.log('Anon', user);
    if (!user || !user.success) {
      console.log('Error creating anonymous user');
      return null;
    }
  }
  return user.data;
}
