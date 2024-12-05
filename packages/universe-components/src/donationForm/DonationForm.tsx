'use client';
import appConfig from '@cfce/app-config';
import { BlockchainManager } from '@cfce/blockchain-tools';
import type { Prisma, Chain, User } from '@cfce/database';
import createDonation from '../actions/createDonation';
import { createAnonymousUser, fetchUserByWallet } from '@cfce/auth';
import type { TokenTickerSymbol } from '@cfce/types';
import { mintAndSaveReceiptNFT } from '@cfce/utils';
import {
  PAYMENT_STATUS,
  amountCoinAtom,
  amountUSDAtom,
  chainAtom,
  donationFormAtom,
  registryApi,
} from '@cfce/utils';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card } from '~/ui/card';
import { CheckboxWithText } from '~/ui/checkbox';
import { Input } from '~/ui/input';
import { Label } from '~/ui/label';
import { Separator } from '~/ui/separator';
import { CarbonCreditDisplay } from './CarbonCreditDisplay';
import { ChainSelect } from './ChainSelect';
import { DonationAmountInput } from './DonationAmountInput';
import { MintButton } from './MintButton';
import { RateMessage } from './RateMessage';
import { WalletSelect } from './WalletSelect';

interface DonationFormProps {
  initiative: Prisma.InitiativeGetPayload<{
    include: {
      organization: { include: { wallets: true } };
      credits: true;
      wallets: true;
    };
  }>,
  rate: number
}



interface DonationData {
  organizationId: string
  initiativeId?: string
  categoryId?: string
  userId?: string
  sender: string
  chainName: string
  network: string
  coinValue: number
  usdValue: number
  currency: string
}

type UserRecord = Prisma.UserGetPayload<{ include: { wallets: true } }>;

// Add this function above the DonationForm component
// @deprecated TODO: remove this
const getFallbackAddress = (chainName?: string): string => {
  const fallbackAddresses: Record<string, string> = {
    Ethereum: '0x1234567890123456789012345678901234567890',
    Polygon: '0x1234567890123456789012345678901234567890',
    Starknet:
      '0x05a12d15f93dcbddec0653fc77dd96713fb154667f2384a51d4c10405b251ccf',
  };

  return chainName ? fallbackAddresses[chainName] || '' : '';
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function DonationForm({ initiative, rate }: DonationFormProps) {
  // TODO: get contract id from contracts table not initiative record
  const contractId = initiative.contractcredit; // needed for CC contract
  const organization = initiative.organization;
  const [loading, setLoading] = useState(false);
  const [chainState, setChainState] = useAtom(chainAtom);
  //setChainState(draft => {
  //  console.log('INIT RATE', rate)
  //  draft.exchangeRate = rate;
  //});
  //console.log('INIT STATE', chainState)

  const { selectedToken, selectedChain, selectedWallet, exchangeRate } = chainState;
  const [donationForm, setDonationForm] = useAtom(donationFormAtom);
  const { emailReceipt, name, email, amount } = donationForm;
  const usdAmount = useAtomValue(amountUSDAtom);
  const coinAmount = useAtomValue(amountCoinAtom);
  //console.log('STATE', chainState, exchangeRate)

  const chainInterface = useMemo(
    () => BlockchainManager[selectedChain]?.client,
    [selectedChain],
  );

  const [buttonMessage, setButtonMessage] = useState(
    'One wallet confirmation required',
  );

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setButtonMessage(error.message);
      console.error(error);
      return;
    }
    console.error(error);
    setButtonMessage('Unknown error');
  }, []);

  const destinationWalletAddress = useMemo(() => {
    const chainName = chainInterface?.chain.name;

    const initiativeWallet = initiative?.wallets?.find(
      w => w.chain === chainName,
    );
    if (initiativeWallet) {
      return initiativeWallet.address;
    }

    const organizationWallet = organization?.wallets.find(
      w => w.chain === chainName,
    )?.address;

    if (organizationWallet) {
      return organizationWallet;
    }

    // Use fallback address if both initiative and organization wallets are not found
    const fallbackAddress = getFallbackAddress(chainName);
    if (fallbackAddress) {
      return fallbackAddress;
    }

    handleError(new Error('No wallet found for chain'));
    return '';
  }, [organization, initiative, chainInterface, handleError]);

  function getRate(){
    registryApi.get<{ coin: TokenTickerSymbol; rate: number }>(
      `/rates?coin=${selectedToken}&chain=${selectedChain}`,
    ).then(response => {
      if (response.success) {
        const { rate } = response.data;
        console.log('RATE', rate)
        if (rate>0) {
          setChainState(draft => {
            //console.log('DRAFT', draft)
            draft.exchangeRate = rate;
          });
          //requestAnimationFrame(() => {
            //setChainState(draft => {
              //console.log('DRAFT', draft)
              //draft.exchangeRate = rate;
            //});
            //console.log('CHAIN1', chainState)
          //});
        }
        //console.log('CHAIN2', chainState)
      }
    });
  }

  useEffect(() => {
    getRate()
  }, [selectedToken, selectedChain, setChainState]);

  //useEffect(() => {
  //  getRate()
  //}, []);

  const sendPayment = useCallback(
    async (address: string, amount: number) => {
      if (!chainInterface?.sendPayment) {
        throw new Error('No chain interface');
      }
      const connected = await chainInterface.connect();
      console.log('CONNECT', connected);
      const data = {
        address,
        amount,
        //amount: chainInterface.toBaseUnit(amount),
        memo: appConfig.chains[selectedChain]?.destinationTag || '',
      };
      const result = await chainInterface.sendPayment(data);
      console.log('PAYMENT RESULT', result);
      return result;
    },
    [chainInterface, selectedChain],
  );

  const onSubmit = useCallback(async () => {
    try {
      validateForm({ email });

      setLoading(true);
      setButtonMessage('Approving payment...');

      console.log('FORM', donationForm)
      console.log('CHAIN', chainState)
      const amountToSend = coinAmount
      //const amountToSend = 0.0001
      //const amountToSend:number = donationForm.showUsd ? (usdAmount / chainState.exchangeRate) : coinAmount;
      //console.log('AMTS', donationForm.showUsd, amount, usdAmount, coinAmount, chainState.exchangeRate)
      console.log('SEND', amountToSend)
      const paymentResult = await sendPayment(destinationWalletAddress, amountToSend);

      if (!paymentResult.success) {
        throw new Error(`Payment error: ${paymentResult.error ?? 'unknown'}`);
      }

      const network = appConfig.chainDefaults.network || 'testnet'
      const chainName = chainInterface?.chain.name || ''
      const currency = chainInterface?.chain.symbol || ''
      const sender = paymentResult.walletAddress || ''
      
      // Save user if not exists
      //const user = (await getUserByWallet(sender)) || ({} as UserRecord);
      const user = await fetchUserByWallet(sender)
      console.log('USER', user)
      let userId = user?.id || ''
      let userKey = user?.api_key || ''
      if(!userId){
        const anon = await createAnonymousUser({walletAddress:sender, chain:chainName, network, tba:true})
        console.log('ANON', anon)
        if(!anon){
          console.log('Error creating anonymous user')
          setButtonMessage('Error saving user data, contact support')
          return false
        }
        userId = anon.id
        userKey = anon.api_key || ''
      }

      // Save donation to DB
      const donationData = {
        organizationId: organization.id, 
        initiativeId: initiative.id, 
        categoryId: initiative?.categoryId || organization?.categoryId || '',
        userId,
        sender,
        chainName,
        network, 
        currency,
        coinValue: coinAmount, 
        usdValue: usdAmount, 
      }

      const donationId = await saveDonation(donationData)
      console.log('DONATION ID', donationId)

      // TODO: Send receipt
      //if(receipt){
      //  console.log('RECEIPT')
      //  setButtonMessage('Sending receipt, wait a moment...')
      //  const data = {
      //    name:     name,
      //    email:    email,
      //    org:      organization?.name,
      //    address:  organization?.mailingAddress,
      //    ein:      organization?.EIN,
      //    currency: currency,
      //    amount:   coinValue.toFixed(4),
      //    usd:      usdValue.toFixed(2)
      //  }
      //  const receiptResp = await sendReceipt(data)
      //  console.log('Receipt sent', receiptResp)
      //}


      setButtonMessage('Minting NFT receipt, please wait...');
      const data = {
        donorName: name || 'Anonymous',
        email: emailReceipt ? email : undefined,
        organizationId: organization.id,
        initiativeId: initiative.id,
        transaction: {
          date: new Date().toISOString(),
          donorWalletAddress: paymentResult.walletAddress ?? '',
          destinationWalletAddress,
          amount,
          txId: paymentResult.txid ?? '',
          chain: selectedChain,
          token: selectedToken,
        },
      };
      console.log('NFT', data);
      // TODO: increase sleep time? some chains take longer <<<<
      await sleep(2000); // Wait for tx to confirm
      console.log('SLEEP');
      const receiptResult = await mintAndSaveReceiptNFT(data);
      console.log('RESULT', receiptResult);

      if ('error' in receiptResult) {
        throw new Error(receiptResult.error ?? 'Failed to process receipt');
      }

      setButtonMessage('Thank you for your donation!');
      setDonationForm(draft => {
        draft.paymentStatus = PAYMENT_STATUS.minted;
        draft.date = new Date();
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [
    amount,
    email,
    name,
    emailReceipt,
    destinationWalletAddress,
    organization,
    selectedChain,
    selectedToken,
    sendPayment,
    initiative,
    setDonationForm,
    handleError,
  ]);

  function validateForm({ email }: { email: string }) {
    if (email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      throw new Error('Invalid email');
    }
  }


  //async function saveDonation({organizationId, initiativeId, categoryId, userId, sender, chainName, network, coinValue, usdValue, currency}:DonationData){
  const saveDonation = useCallback(async ({organizationId, initiativeId, categoryId, userId, sender, chainName, network, coinValue, usdValue, currency}:DonationData) => {

    const donation = {
      organization: {
        connect: { id: organizationId}
      }, 
      initiative: {
        connect: { id: initiativeId },
      }, 
      category: {
        connect: { id: categoryId }
      },
      userId,
      network, 
      chain:    chainName as Chain,
      wallet:   sender,
      amount:   coinValue,
      usdvalue: usdValue,
      asset:    currency,
      paytype:  'crypto',
      status:   1
    }

    console.log('DONATION', donation)
    //const ApiKey = process.env.CFCE_REGISTRY_API_KEY || ''
    //const donationResp = await fetch('/api/donations', {method:'post', headers: {'x-api-key': ApiKey }, body:JSON.stringify(donation)})
    //const donationJson = await donationResp.json()
    //console.log('SAVED DONATION', donationJson)
    //if(!donationJson.success){
    //  //setButtonText('ERROR')
    //  //setDisabled(true)
    //  setButtonMessage('Error saving donation')
    //  return false
    //}
    const donationResp = await createDonation(donation)
    if(!donationResp){
      setButtonMessage('Error saving donation')
      return false
    }
    const donationId = donationResp.id
    return donationId
  },[])

  return (
    <div className="flex min-h-full w-full">
      <Card className="py-6 w-full">
        <div className="px-6">
          <Label htmlFor="currency-select" className="mb-2">
            Currency
          </Label>
          <ChainSelect />
          <Label htmlFor="wallet-select" className="mb-2">
            Wallet
          </Label>
          <WalletSelect />
        </div>
        <Separator />
        <div className="px-6">
          {appConfig.siteInfo.options.showCarbonCreditDisplay && (
            <CarbonCreditDisplay initiative={initiative} />
          )}
          <div className="w-full mt-6 mb-2">
            <DonationAmountInput label="Amount" />
            <RateMessage />
          </div>
          <Label htmlFor="name-input" className="mb-2">
            Name (optional)
          </Label>
          <Input
            type="text"
            className="pl-4 mb-6"
            id="name-input"
            onChange={({ target: { value: name } }) => {
              setDonationForm(draft => {
                draft.name = name;
                draft.date = new Date();
              });
            }}
          />
          <Label htmlFor="email-input" className="mb-2">
            Email address (optional)
          </Label>
          <Input type="text" className="pl-4 mb-6" id="email-input" />
          <CheckboxWithText
            id="receipt-check"
            text="I'd like to receive an emailed receipt"
            className="mb-2"
          />
        </div>
        <Separator />
        <div className="flex flex-col items-center justify-center">
          <MintButton onClick={onSubmit} />
          <p className="mt-2 text-sm">{buttonMessage}</p>
        </div>
      </Card>
    </div>
  );
}
