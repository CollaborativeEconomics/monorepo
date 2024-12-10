/** @jsxImportSource frog/jsx */

import type { Prisma } from '@cfce/database';
import { Button, Frog, TextInput, parseEther } from 'frog';
import { devtools } from 'frog/dev';
import { type NeynarVariables, neynar } from 'frog/middlewares';
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';
import { createSystem } from 'frog/ui';
import Image from 'next/image';
import { http, createPublicClient } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { Donation, type EmailBody } from '~/types';
import {
  ConfirmIntent,
  checkUser,
  emailReceipt,
  getInitiativeById,
  getInitiatives,
  getRates,
  mintNft,
  newDonation,
  sendReceipt,
} from '~/utils';

const client = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

const { vars } = createSystem();

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  title: 'GiveCast',
  ui: { vars },
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'
let initiatives: Prisma.InitiativeGetPayload<{
  include: { organization: true };
}>;
let rate: number;
let recipient: string;

interface ExtendedEmailBody extends EmailBody {
  email: string;
}
const DonorData: ExtendedEmailBody = {
  address: '',
  coinSymbol: '',
  coinValue: '',
  date: '',
  donorName: '',
  ein: '',
  organizationName: '',
  usdValue: '',
  email: '',
};

//  background: 'linear-gradient(to right, #432889, #17101F)'
const background = {
  alignItems: 'center',
  color: 'white',
  background: '#334155',
  backgroundSize: '100% 100%',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  fontSize: 30,
  fontStyle: 'normal',
  height: '100%',
  padding: '20px',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
};

const warning = {
  alignItems: 'center',
  color: 'white',
  background: 'linear-gradient(to right, #991b1b, #171717)',
  backgroundSize: '100% 100%',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  fontSize: 30,
  fontStyle: 'normal',
  height: '100%',
  padding: '20px',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
};

//app.use(
//neynar({
//  apiKey: 'NEYNAR_FROG_FM',
//  features: ['interactor', 'cast'],
//})
//);

app.frame('/', async c => {
  return c.res({
    action: '/featured',
    image: '/givecast.jpg',
    intents: [
      <Button
        value="30c0636f-b0f1-40d5-bb9c-a531dc4d69e2"
        key="green-blockchain"
      >
        Green Blockchain
      </Button>,
      <Button
        value="bd87aeb5-c60c-418e-9ffa-6535044d9fbb"
        key="hurricane-beryl"
      >
        Hurricane Beryl
      </Button>,
    ],
  });
});

app.frame('/featured', async c => {
  const { buttonValue, inputText, frameData } = c;
  const id = buttonValue || ''; // It should never be empty unless accessed directly
  console.log('ID', id);
  const initiative = await getInitiativeById(id);
  console.log('INIT', initiative?.slug);
  initiatives = initiative;
  console.log(initiatives.defaultAsset);

  return c.res({
    action: '/confirmation',
    image: `${initiative.defaultAsset}`,
    intents: [
      <TextInput placeholder="Enter amount to donate in USD" key="input" />,
      <Button value="5" key="5">
        $5
      </Button>,
      <Button value="10" key="10">
        $10
      </Button>,
      <Button value="20" key="20">
        $20
      </Button>,
      <Button value="Next" key="next">
        Next
      </Button>,
    ],
  });
});

app.frame('/initiative/:id?', async c => {
  const id = c.req.param('id') || '';
  console.log('ID', id);
  // TODO: If not ID redirect to main
  const initiative = await getInitiativeById(id);
  console.log('INIT', initiative?.slug);
  initiatives = initiative;
  console.log(initiatives.defaultAsset);

  return c.res({
    action: '/confirmation',
    image: `${initiative.defaultAsset}`,
    intents: [
      <TextInput placeholder="Enter amount to donate in USD" key="input" />,
      <Button value="5" key="5">
        $5
      </Button>,
      <Button value="10" key="10">
        $10
      </Button>,
      <Button value="20" key="20">
        $20
      </Button>,
      <Button value="Next" key="next">
        Next
      </Button>,
    ],
  });
});

app.frame('/confirmation', async c => {
  const { buttonValue, inputText, frameData } = c;
  let amount = 0;
  if (inputText !== undefined) {
    amount = Number.parseInt(inputText || '0') || 0;
  } else {
    amount = Number.parseInt(buttonValue || '0') || 0;
  }
  rate = await getRates('eth');
  const rates = rate.toFixed(4);
  const value = amount / rate;
  console.log('RATE', rate, rates, amount, value);

  DonorData.coinSymbol = 'ETH';
  DonorData.organizationName = initiatives?.organization.name;
  DonorData.usdValue = amount.toFixed(4);
  DonorData.coinValue = value.toFixed(18);

  const pageContent = (
    <div style={background}>
      <p style={{ margin: 0, padding: 0 }}>Donate to</p>
      <p
        style={{
          margin: 0,
          fontSize: 60,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          lineHeight: 1.4,
          whiteSpace: 'pre-wrap',
        }}
      >
        {initiatives?.title}
      </p>
      <p style={{ margin: 0, padding: 0 }}>
        a {initiatives?.organization?.name} initiative
      </p>
      <p style={{ margin: 0, padding: 0, marginTop: 40, fontSize: 40 }}>
        You will send ${amount.toFixed(2)} USD
      </p>
      <p style={{ margin: 0, padding: 0 }}>
        As {value.toFixed(4)} Arbitrum ETH
      </p>
    </div>
  );

  return c.res({
    action: '/mintquery',
    image: pageContent,
    intents: ConfirmIntent.intents,
  });
});

app.frame('/mintquery', async c => {
  const { transactionId } = c;
  console.log('TX', transactionId);

  const confirmed = {
    action: '/mint-nft',
    image: (
      <div style={background}>
        <p style={{ fontSize: 60 }}>Thank you for your donation</p>
        <p style={{ fontSize: 40 }}>
          Mint an NFT receipt representing your donation?
        </p>
      </div>
    ),
    intents: [
      <Button value="yes" key="yes">
        Mint NFT
      </Button>,
      <Button.Reset key="done">Done</Button.Reset>,
    ],
  };

  const rejected = {
    action: `/initiative/${initiatives?.id}`,
    image: (
      <div style={warning}>
        <p style={{ fontSize: 60 }}>Transaction not successful</p>
      </div>
    ),
    intents: [
      <Button value="Retry" key="retry">
        Retry
      </Button>,
      <Button.Reset key="home">Home Page</Button.Reset>,
    ],
  };

  if (transactionId) {
    // Wait for confirmation
    const secs = 1000;
    const wait = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6]; // 60 secs / 15 loops
    let count = 0;
    let info = null;
    while (count < wait.length) {
      console.log('Retry', count);
      await new Promise(res => setTimeout(res, wait[count] * secs));
      count++;
      try {
        info = await client.getTransactionReceipt({ hash: transactionId });
      } catch (ex) {
        console.error(ex);
        continue;
      }
      console.log('INFO', info);
      if (info?.status === 'success') {
        console.log('TX SUCCESS');
        // TODO: create user profile from address
        const user = await checkUser(DonorData?.address || '');
        console.log('USER', user.id);
        if (user?.id) {
          const DonationData = {
            created: new Date(),
            userId: user.id,
            organizationId: initiatives.organization.id,
            initiativeId: initiatives.id,
            usdvalue: DonorData.usdValue,
            amount: DonorData.coinValue,
            asset: DonorData.coinSymbol,
            wallet: DonorData.address,
            chain: process.env.NEXT_PUBLIC_BLOCKCHAIN,
            network: 'testnet',
            paytype: 'crypto',
          };
          const DonationResponse = await newDonation(DonationData);
          console.log('Donation saved', DonationResponse);
        }
        if (DonorData.email !== '') {
          console.log(DonorData.email);
          const receiptResp = await emailReceipt(DonorData.email, DonorData);
          console.log('Receipt sent', receiptResp);
        }
        return c.res(confirmed);
      }
      console.log('TX FAILED');
      return c.res(rejected);
    }
    console.log('TX TIMED OUT');
    return c.res(rejected);
  }
  return c.res(rejected);
});

app.frame('/mint-nft', async c => {
  const { buttonValue } = c;
  console.log(recipient);
  let mintingReceipt: Record<string, unknown> = {};

  if (buttonValue === 'yes') {
    if (recipient !== undefined) {
      mintingReceipt = await mintNft(recipient);
      console.log('NFT', mintingReceipt);
    }

    return c.res({
      action: '/',
      image: (
        <div style={background}>
          <p style={{ fontSize: 60 }}>NFT Minted</p>
          <p style={{ fontSize: 30 }}>
            Copy the contract Id and token Id below to import your NFT into your
            wallet
          </p>
          <p style={{ fontSize: 20 }}>
            Contract: {process.env.MINTER_CONTRACT}
          </p>
          <p style={{ fontSize: 30 }}>
            Token ID: {mintingReceipt?.nftId || '0'}
          </p>
        </div>
      ),
      intents: [
        <Button.Link
          href={`/addnft?tokenId=${mintingReceipt?.nftId}`}
          key="addnft"
        >
          Add NFT to MetaMask
        </Button.Link>,
        <Button value="Featured" key="featured">
          More initiatives
        </Button>,
      ],
    });
  }

  return c.res({
    action: '/',
    image: (
      <div style={warning}>
        <p style={{ fontSize: 60 }}>Minting not successful</p>
      </div>
    ),
    intents: [
      <Button.Link href="https://cfce.io" key="contact">
        Contact Support
      </Button.Link>,
      <Button.Reset key="home">Home Page</Button.Reset>,
    ],
  });
});

app.transaction('/send-ether', c => {
  const { inputText = '', frameData } = c;
  console.log('AMT', DonorData.coinValue);
  DonorData.email = inputText;
  recipient = frameData?.address || '';
  DonorData.address = recipient;
  return c.send({
    chainId: 'eip155:421614',
    to: '0x78C267869e588823F6D1660EBE6e286deE297f0a',
    value: parseEther(DonorData.coinValue),
  });
});

/*
const frameError = {
  image: (
    <div style={warning}>
      <p style={{fontSize: 60}}>Error in Transaction</p>
    </div>
  ),
  intents: [
    <Button.Reset>Home Page</Button.Reset>
  ]
}

const frameSuccess = {
  image: (
    <div style={background}>
      <p style={{fontSize: 60}}>Transaction successful</p>
    </div>
  ),
  intents: [
    <Button.Reset>Home Page</Button.Reset>
  ]
}

app.frame('/watchresult', async (c) => {
  console.log('WATCH RES', c)
  const { transactionId } = c;
  console.log('TX', transactionId)
  if(!transactionId){
    return c.res(frameError)
  }
  return c.res(frameSuccess)
});


app.transaction('/addnft', (c) => {
  console.log('WATCH...')
  const address = '0xeea9557589cfff5dd3d849da94201fa8cb782c12'
  const image = 'https://give-cast.vercel.app/givecast.jpg'
  const symbol = 'GIVE'
  const decimals = 0
  const tokenId = 1
  return c.res({
    chainId: 'eip155:421614',
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC721',
      options: {
        address,
        image,
        symbol,
        decimals,
        tokenId
      }
    }
  })
})
*/

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
