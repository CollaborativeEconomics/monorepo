'use client';
import appConfig from '@cfce/app-config';
import {
  BlockchainManager,
  getChainConfiguration,
  getWalletConfiguration,
} from '@cfce/blockchain-tools';
import type { Prisma } from '@cfce/database';
import type { ChainSlugs, Interfaces } from '@cfce/types';
import type { ReceiptNFTParams } from '@cfce/universe-api/receipts';
import {
  PAYMENT_STATUS,
  amountCoinAtom,
  amountUSDAtom,
  chainsState as chainStateAtom,
  donationFormState,
  fetchApi,
  postApi,
} from '@cfce/utils';
//import registerUser from "@/contracts/register"
import { useAtom, useAtomValue } from 'jotai';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CarbonChart from '../CarbonChart';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CheckboxWithText } from '../ui/checkbox';
import { Input } from '../ui/input';
import { InputWithContent } from '../ui/input-with-content';
import { Label } from '../ui/label';
import Progress from '../ui/progressbar';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { DonationFormSelect } from './DonationFormSelect';

interface DonationFormProps {
  initiative: Prisma.InitiativeGetPayload<{
    include: {
      organization: { include: { wallets: true } };
      credits: true;
      wallets: true;
    };
  }>;
}

async function mintSaveAndEmailReceiptNFT(data: ReceiptNFTParams) {
  console.log('Sending receipt...', data);
  try {
    const result = await postApi('receipt', data);
    console.log('Receipt sent');
    console.log('Result', result);
    return { success: true };
  } catch (ex) {
    console.warn('Error sending receipt', ex);
    return {
      success: false,
      error: ex instanceof Error ? ex.message : 'Unknown error sending receipt',
    };
  }
}

export default function DonationForm({ initiative }: DonationFormProps) {
  //#region hook and var definitions
  const contractId = initiative.contractcredit; // needed for CC contract
  const organization = initiative.organization;
  const [loading, setLoading] = useState(false); // TODO: add UI state
  const [chainState, setChainState] = useAtom(chainStateAtom);
  const { selectedToken, selectedChain, selectedWallet, exchangeRate } =
    chainState;
  console.log({ chainState });

  const [donationForm, setDonationForm] = useAtom(donationFormState);
  const { showUsd, paymentStatus, emailReceipt, name, email, amount } =
    donationForm;
  const usdAmount = useAtomValue(amountUSDAtom);
  const coinAmount = useAtomValue(amountCoinAtom);
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
    handleError(new Error('No wallet found for chain'));
    return '';
  }, [organization, initiative, chainInterface, handleError]);
  //#endregion hook and var definitions

  useEffect(() => {
    // Maybe Someday: update periodically or when the amount changes
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

  // #region carbon credit stuff
  const initiativeCredit =
    (initiative?.credits?.length ?? 0) > 0 ? initiative?.credits[0] : null;
  console.log('CREDIT', initiativeCredit);
  const creditGoal = Number(initiativeCredit?.goal) || 1;
  const currentCreditAmount = Number(initiativeCredit?.current) || 0;
  const creditUnitValue = Number(initiativeCredit?.value) || 0;
  const creditCompletionPercentage = (
    (creditUnitValue * 100) /
    creditGoal
  ).toFixed(0);
  console.log(
    'CHART',
    creditGoal,
    currentCreditAmount,
    creditUnitValue,
    creditCompletionPercentage,
  );
  const maxGoal = 100;
  const maxValue = (currentCreditAmount * 100) / creditGoal;
  console.log('MAXGOAL', maxGoal, maxValue);
  const tons = 173.243; // TODO: get from db?
  const tonx =
    (Number(initiativeCredit?.current) ?? 0) /
    (Number(initiativeCredit?.value) ?? 0);
  const perc = (tonx * 100) / tons;
  console.log('TONS', tons, tonx, perc, '%');
  // #endregion

  // Get active chains, then get their configuration
  console.log({
    appConfig,
    // chains: JSON.stringify(appConfig.chains),
    // env: process.env.NEXT_RUNTIME,
  });
  const chains = getChainConfiguration(
    appConfig.chains.map(chain => chain.slug),
  ).map(chain => ({
    value: chain.slug,
    label: chain.name,
    image: '', //chain.icon,
  }));

  // Get active wallets, then get their configuration
  const wallets = getWalletConfiguration(
    appConfig.chains.find(c => c.slug === selectedChain)?.wallets ?? [],
  ).map(walletConfig => ({
    value: walletConfig.slug,
    label: walletConfig.name,
    image: '', // walletConfig.icon,
  }));

  const buttonProps = useMemo(() => {
    if (paymentStatus === PAYMENT_STATUS.sending) {
      return { disabled: true, text: 'Sending' };
    }
    if (paymentStatus === PAYMENT_STATUS.minting) {
      return { disabled: true, text: 'Minting' };
    }
    if (paymentStatus === PAYMENT_STATUS.minted) {
      return { disabled: true, text: 'Minted' };
    }
    if (paymentStatus === PAYMENT_STATUS.failed) {
      return { disabled: true, text: 'Failed' };
    }
    // status === ready
    return { disabled: false, text: 'Donate' };
  }, [paymentStatus]);
  const rateMessage = useMemo(() => {
    if (typeof amount === 'undefined') {
      return `0 USD at ${exchangeRate.toFixed(2)} ${selectedToken}/USD`;
    }
    // show token amount under field
    if (showUsd) {
      return `${(+amount / exchangeRate).toFixed(2)} ${selectedToken} at ${exchangeRate.toFixed(2)} ${selectedToken}/USD`;
    }
    // show USD amount under field
    return `${(+amount * exchangeRate).toFixed(2)} USD at ${exchangeRate.toFixed(2)} ${selectedToken}/USD`;
  }, [exchangeRate, amount, showUsd, selectedToken]);
  const chartTitle = useMemo(
    () =>
      `${perc.toFixed(2)}% of total estimated carbon emissions retired ${tonx.toFixed(2)} out of ${tons} tons`,
    [perc, tonx],
  );

  const percent = useMemo(() => {
    const creditsToRetire = usdAmount / creditUnitValue;
    const remainingCredits = tonx - creditsToRetire;
    const percentDiff = (100 * remainingCredits) / creditsToRetire;
    return percentDiff;
  }, [creditUnitValue, usdAmount, tonx]);
  // const [offset, setOffset] = useState('0.00');
  const offset = (usdAmount / creditUnitValue).toFixed(2);

  const sendPayment = useCallback(
    async (address: string, amount: number) => {
      if (!chainInterface?.sendPayment) {
        throw new Error('No chain interface');
      }
      const result = await chainInterface.sendPayment({
        address,
        amount: chainInterface.toBaseUnit(amount),
        memo:
          appConfig.chains.find(c => c.slug === selectedChain)
            ?.destinationTag || '',
      });
      return result;
    },
    [chainInterface, selectedChain],
  );

  const onSubmit = useCallback(async () => {
    try {
      validateForm({ email });

      // Update UI state for loading
      setLoading(true);
      setButtonMessage('Approving payment...');

      // Handle payment processing
      const paymentResult = await sendPayment(destinationWalletAddress, amount);

      if (!paymentResult.success) {
        throw new Error('Payment failed');
      }

      // Save donation to blockchain and DB
      // Send email, if provided
      await mintSaveAndEmailReceiptNFT({
        date: new Date().toISOString(),
        donorName: name,
        ...(emailReceipt ? { email } : {}),
        organizationId: organization.id,
        initiativeId: initiative.id,
        transaction: {
          donorWalletAddress: paymentResult.walletAddress ?? '',
          destinationWalletAddress,
          txId: paymentResult.txid ?? '',
          chain: selectedChain,
          token: selectedToken,
          coinValue: coinAmount,
          usdValue: usdAmount,
          rate: exchangeRate,
        },
      });

      // Final UI updates
      setButtonMessage('Thank you for your donation!');
      setDonationForm(draft => {
        draft.paymentStatus = PAYMENT_STATUS.ready;
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
    coinAmount,
    initiative,
    setDonationForm,
    exchangeRate,
    usdAmount,
    handleError,
  ]);

  // Helper functions
  function validateForm({ email }: { email: string }) {
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
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
          <DonationFormSelect<ChainSlugs>
            id="currency-select"
            className="mb-6"
            options={chains}
            currentOption={selectedChain}
            handleChange={chain => {
              setChainState(draft => {
                draft.selectedChain = chain;
              });
            }}
            placeHolderText="...select a cryptocurrency"
          />
          <Label htmlFor="wallet-select" className="mb-2">
            Wallet
          </Label>
          <DonationFormSelect
            id="wallet-select"
            className="mb-6"
            options={wallets}
            currentOption={selectedWallet}
            handleChange={wallet =>
              setChainState(draft => {
                draft.selectedWallet = wallet as Interfaces;
              })
            }
            placeHolderText="...select a cryptowallet"
          />
        </div>
        <Separator />
        <div className="px-6">
          <div className="my-10 text-center">
            <CarbonChart title={chartTitle} goal={maxGoal} value={maxValue} />
            <p className="mt-4 mb-4">
              Your donation will offset {offset} ton
              {Number.parseInt(offset) === 1 ? '' : 's'} of carbon
            </p>
            <Progress value={percent} />
            <p className="mt-2 mb-4">1 ton of carbon = USD {creditUnitValue}</p>
          </div>
          <div className="w-full my-6">
            <div className="flex flex-row justify-between items-center mb-2">
              <Label>Amount</Label>{' '}
              <div className="flex flex-wrap">
                <Label htmlFor="show-usd-toggle">USD</Label>
                <Switch
                  id="show-usd-toggle"
                  valueBasis={!showUsd}
                  handleToggle={() => {
                    setDonationForm(draft => {
                      draft.showUsd = !draft.showUsd;
                      draft.date = new Date();
                    });
                  }}
                />
                <Label>{selectedToken}</Label>
              </div>
            </div>
            <div className="my-auto">
              <InputWithContent
                className="pl-4"
                type="text"
                id="amount"
                text={showUsd ? '| USD' : `| ${selectedToken}`}
                onChange={({ target: { value: amount } }) => {
                  setDonationForm(draft => {
                    draft.amount = Number.parseFloat(amount);
                    draft.date = new Date();
                  });
                }}
              />
            </div>
            <Label className="block mt-2 text-right">{rateMessage}</Label>
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
          <Button
            disabled={buttonProps.disabled}
            className="mt-6 mx-6 w-[250px] h-[50px] bg-lime-600 text-white text-lg hover:bg-green-600 hover:shadow-inner"
            onClick={onSubmit}
          >
            {buttonProps.text}
          </Button>
          <p className="mt-2 text-sm">{buttonMessage}</p>
        </div>
      </Card>
    </div>
  );
}
