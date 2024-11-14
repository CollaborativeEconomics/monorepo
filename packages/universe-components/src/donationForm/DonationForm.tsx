'use client';
import appConfig from '@cfce/app-config';
import { BlockchainManager } from '@cfce/blockchain-tools';
import type { Prisma } from '@cfce/database';
import { mintAndSaveReceiptNFT } from '@cfce/utils';
import {
  PAYMENT_STATUS,
  amountCoinAtom,
  amountUSDAtom,
  chainAtom,
  donationFormAtom,
  fetchApi,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "~/ui/dialog";
import { Button } from "~/ui/button";

interface DonationFormProps {
  initiative: Prisma.InitiativeGetPayload<{
    include: {
      organization: { include: { wallets: true } };
      credits: true;
      wallets: true;
    };
  }>;
}

// Add this function above the DonationForm component
const getFallbackAddress = (chainName?: string): string => {
  const fallbackAddresses: Record<string, string> = {
    'Ethereum': '0x1234567890123456789012345678901234567890',
    'Polygon': '0x1234567890123456789012345678901234567890',
    'Starknet': '0x023345e38d729e39128c0cF163e6916a343C18649f07FcC063014E63558B20f3',
  };
  
  return chainName ? fallbackAddresses[chainName] || '' : '';
};

function sleep(ms:number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function DonationForm({ initiative }: DonationFormProps) {
  const contractId = initiative.contractcredit; // needed for CC contract
  const organization = initiative.organization;
  const [loading, setLoading] = useState(false);
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  const [chainState, setChainState] = useAtom(chainAtom);
  const { selectedToken, selectedChain, selectedWallet, exchangeRate } = chainState;
  const [donationForm, setDonationForm] = useAtom(donationFormAtom);
  const { emailReceipt, name, email, amount } = donationForm;
  const usdAmount = useAtomValue(amountUSDAtom);
  const coinAmount = useAtomValue(amountCoinAtom);
  const chainInterface = useMemo(
    () => BlockchainManager[selectedChain].client,
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

  useEffect(() => {
    fetchApi(`rates?coin=${selectedToken}&chain=${selectedChain}`).then(
      ({ rate }: { rate: number }) => {
        if (rate) {
          setChainState(draft => {
            draft.exchangeRate = rate;
          });
        }
      },
    );
  }, [selectedToken, selectedChain, setChainState]);

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
      const connected = await chainInterface.connect()
      console.log('CONNECT', connected)
      const data = {
        address,
        amount: amount, // amount conversion should be done on the wallet side
        //amount: chainInterface.toBaseUnit(amount),
        memo: appConfig.chains[selectedChain]?.destinationTag || '',
      }
      const result = await chainInterface.sendPayment(data);
      console.log('PAYMENT RESULT', result)
      return result;
    },
    [chainInterface, selectedChain],
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

      if (!paymentResult.success) {
        throw new Error(`Payment error: ${paymentResult.error ?? 'unknown'}`);
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
        }
      }
      console.log('NFT', data)
      await sleep(2000) // Wait for tx to confirm
      console.log('SLEEP')
      const receiptResult = await mintAndSaveReceiptNFT(data);
      console.log('RESULT', receiptResult)

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
    checkBalance,
    initiative,
    setDonationForm,
    handleError,
  ]);

  function validateForm({ email }: { email: string }) {
    if (email && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      throw new Error('Invalid email');
    }
  }

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
              You do not have enough funds in your wallet to complete this transaction. Click on the button below to add funds to your wallet.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <DialogClose>
              <Button
                variant={"link"}
                onClick={() => {
                  window.open(
                    'https://changelly.com/buy',
                    '_blank'
                  );
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
    </div>
  );
}
