'use client';
import { usePostHog } from '@cfce/analytics';
import appConfig from '@cfce/app-config';
import { createAnonymousUser, fetchUserByWallet } from '@cfce/auth';
import { BlockchainManager } from '@cfce/blockchain-tools';
import type { Chain, Prisma, User } from '@cfce/database';
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
import { Button } from '~/ui/button';
import { Card } from '~/ui/card';
import { CheckboxWithText } from '~/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/ui/dialog';
import { Input } from '~/ui/input';
import { Label } from '~/ui/label';
import { Separator } from '~/ui/separator';
import createDonation from '../actions/createDonation';
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
  }>;
  rate: number;
}

interface DonationData {
  organizationId: string;
  initiativeId?: string;
  categoryId?: string;
  userId?: string;
  sender: string;
  chainName: string;
  network: string;
  coinValue: number;
  usdValue: number;
  currency: string;
}

type UserRecord = Prisma.UserGetPayload<{ include: { wallets: true } }>;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function DonationForm({ initiative, rate }: DonationFormProps) {
  // TODO: get contract id from contracts table not initiative record
  const posthog = usePostHog();
  const contractId = initiative.contractcredit; // needed for CC contract
  const organization = initiative.organization;
  const [loading, setLoading] = useState(false);
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  const [chainState, setChainState] = useAtom(chainAtom);
  //setChainState(draft => {
  //  console.log('INIT RATE', rate)
  //  draft.exchangeRate = rate;
  //});
  //console.log('INIT STATE', chainState)

  const { selectedToken, selectedChain, selectedWallet, exchangeRate } =
    chainState;
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
  const [errorDialogState, setErrorDialogState] = useState(false);

  const handleError = useCallback((error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    const canRetryWithGas =
      errorMessage.includes('gasless') ||
      errorMessage.includes('insufficient funds') ||
      errorMessage.includes('rejected');

    if (canRetryWithGas) {
      setErrorDialogState(true);
    }

    setButtonMessage(errorMessage);
    console.error(error);
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
    // There will be no fallback address for production, hence the error will be thrown
    const fallbackAddress = appConfig.chainDefaults?.defaultAddress;
    if (fallbackAddress) {
      return fallbackAddress;
    }

    handleError(new Error('No wallet found for chain'));
    return '';
  }, [organization, initiative, chainInterface, handleError]);

  const getRate = useCallback(async () => {
    try {
      const response = await registryApi.get<{ coin: TokenTickerSymbol; rate: number }>(
        `/rates?coin=${selectedToken}&chain=${selectedChain}`,
      );
      
      // Check if response and response.data exist before accessing rate
      if (response?.data?.rate && response.success) {
        setChainState(draft => {
          draft.exchangeRate = response.data.rate;
        });
      } else {
        console.warn('Invalid rate response:', response);
        // Optionally set a fallback rate or handle the error case
        setChainState(draft => {
          draft.exchangeRate = 0.00; // fallback rate
        });
      }
    } catch (error) {
      console.error('Error fetching rate:', error);
      // Handle error case with fallback
      setChainState(draft => {
        draft.exchangeRate = 0.00; // fallback rate
      });
    }
  }, [selectedToken, selectedChain, setChainState]);

  useEffect(() => {
    getRate();
  }, [getRate]);

  const checkBalance = useCallback(async () => {
    if (!chainInterface || !('getBalance' in chainInterface)) {
      throw new Error('No chain interface or getBalance not supported');
    }
    const balance = await chainInterface.getBalance();
    return Number(balance) >= chainInterface.toBaseUnit(amount);
  }, [chainInterface, amount]);

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

  const sendPaymentWithGas = useCallback(
    async (address: string, amount: number) => {
      if (!chainInterface?.sendPaymentWithGas) {
        throw new Error('Gas payments not supported');
      }

      const result = await chainInterface.sendPaymentWithGas(address, amount);
      console.log('GAS PAYMENT RESULT', result);
      return result;
    },
    [chainInterface],
  );

  const handleMinting = useCallback(
    async (paymentResult: {
      success: boolean;
      walletAddress?: string;
      txid?: string;
      error?: string;
    }) => {
      if (!paymentResult.success) {
        throw new Error(paymentResult.error ?? 'Payment failed');
      }

      // Save donation first
      const donationData = {
        organizationId: organization.id,
        initiativeId: initiative.id,
        categoryId: undefined,
        userId: undefined,
        sender: paymentResult.walletAddress ?? '',
        chainName: selectedChain,
        network: appConfig.chains[selectedChain]?.network ?? '',
        coinValue: amount,
        usdValue: amount * exchangeRate,
        currency: selectedToken
      };

      const donationId = await saveDonation(donationData);

      if (!donationId) {
        throw new Error('Error saving donation');
      }

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
    },
    [
      name,
      emailReceipt,
      email,
      organization.id,
      initiative.id,
      destinationWalletAddress,
      amount,
      selectedChain,
      selectedToken,
      setDonationForm,
    ],
  );

  const onSubmit = useCallback(async () => {
    try {
      validateForm({ email });

      const hasBalance = await checkBalance();
      if (!hasBalance) {
        setBalanceDialogOpen(true);
        return;
      }

      setLoading(true);
      setButtonMessage('Approving payment...');

      const paymentResult = await sendPayment(destinationWalletAddress, amount);
      if (posthog.__loaded) {
        posthog.capture('user_donated', {
          amount,
          organization: organization.slug,
          initiative: initiative.slug,
          token: selectedToken,
          chain: selectedChain,
        });
      }
      await handleMinting(paymentResult);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [
    amount,
    email,
    destinationWalletAddress,
    sendPayment,
    checkBalance,
    handleMinting,
    handleError,
  ]);

  function validateForm({ email }: { email: string }) {
    if (email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      throw new Error('Invalid email');
    }
  }

  //async function saveDonation({organizationId, initiativeId, categoryId, userId, sender, chainName, network, coinValue, usdValue, currency}:DonationData){
  const saveDonation = useCallback(
    async ({
      organizationId,
      initiativeId,
      categoryId,
      userId,
      sender,
      chainName,
      network,
      coinValue,
      usdValue,
      currency,
    }: DonationData) => {
      const donation = {
        organization: {
          connect: { id: organizationId },
        },
        initiative: {
          connect: { id: initiativeId },
        },
        category: {
          connect: { id: categoryId },
        },
        userId,
        network,
        chain: chainName as Chain,
        wallet: sender,
        amount: coinValue,
        usdvalue: usdValue,
        asset: currency,
        paytype: 'crypto',
        status: 1,
      };
      console.log('DONATION', donation);
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
      const donationResp = await createDonation(donation);
      if (!donationResp) {
        setButtonMessage('Error saving donation');
        return false;
      }
      const donationId = donationResp.id;
      return donationId;
    },
    [],
  );

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
      <Dialog open={balanceDialogOpen} onOpenChange={setBalanceDialogOpen}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Insufficient Funds
            </DialogTitle>
            <DialogDescription className="text-white-600">
              You do not have enough funds in your wallet to complete this
              transaction. Click on the button below to add funds to your
              wallet.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <DialogClose>
              <Button
                variant={'link'}
                onClick={() => {
                  window.open('https://changelly.com/buy', '_blank');
                }}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Buy {selectedToken} on Changelly
              </Button>
            </DialogClose>
            <DialogClose className="text-white-500 hover:underline">
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={errorDialogState} onOpenChange={setErrorDialogState}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Gasless Transaction Failed
            </DialogTitle>
            <DialogDescription className="text-white-600">
              Would you like to try again with a regular gas transaction?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button
              className="bg-lime-600 text-white text-lg hover:bg-green-600 hover:shadow-inner"
              onClick={() => {
                setErrorDialogState(false);
                setTimeout(() => {
                  setLoading(true);
                  setButtonMessage('Approving payment...');
                  sendPaymentWithGas(destinationWalletAddress, amount)
                    .then(gasResult => handleMinting(gasResult))
                    .catch(handleError)
                    .finally(() => setLoading(false));
                }, 0);
              }}
            >
              Try With Gas
            </Button>
            <Button variant="ghost" onClick={() => setErrorDialogState(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
