'use client';
import {
  BlockchainManager,
  type ChainSlugs,
  getChainConfiguration,
} from '@cfce/blockchain-tools';
import type { Prisma } from '@cfce/database';
import {
  PAYMENT_STATUS,
  ReceiptEmailBody,
  appConfig,
  chainsState as chainStateAtom,
  donationFormState,
  fetchApi,
  pendingDonationState,
  postApi,
} from '@cfce/utils';
//import registerUser from "@/contracts/register"
import { signTransaction } from '@stellar/freighter-api';
import {
  Account,
  Address,
  Asset,
  BASE_FEE,
  Contract,
  Horizon,
  Keypair,
  Networks,
  Operation,
  SorobanDataBuilder,
  SorobanRpc,
  Transaction,
  TransactionBuilder,
  nativeToScVal,
  scValToNative,
} from '@stellar/stellar-sdk';
import { useAtom } from 'jotai';
import map from 'lodash/map';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
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
    include: { organization: true; credits: true };
  }>;
}

export default function DonationForm({ initiative }: DonationFormProps) {
  const contractId = initiative.contractcredit;
  const organization = initiative.organization;
  const [donation, setDonation] = useAtom(pendingDonationState);
  const { amount } = donation;
  const [chainState, setChainState] = useAtom(chainStateAtom);
  const { selectedToken, selectedChain, exchangeRate } = chainState;
  const [donationForm, setDonationForm] = useAtom(donationFormState);
  const { showUsd, paymentStatus, emailReceipt, name, email } = donationForm;
  useEffect(() => {
    fetchApi(`rates?coin=${selectedToken}&chain=${selectedChain}`).then(
      (rate: number) => {
        if (rate) {
          setChainState(draft => {
            draft.exchangeRate = rate;
          });
        }
      },
    );
  }, [selectedToken, selectedChain, setChainState]);
  // TODO: should this also update when the amount changes? Periodically?
  const chainInterface = useMemo(
    () => BlockchainManager.getInstance()[selectedChain]?.client,
    [selectedChain],
  );

  // #region carbon credit stuff
  const credit =
    (initiative?.credits?.length ?? 0) > 0 ? initiative?.credits[0] : null;
  console.log('CREDIT', credit);
  const creditGoal = credit?.goal || 1;
  const creditCurrent = credit?.current || 0;
  const creditValue = credit?.value || 0;
  const creditPercent = ((creditValue * 100) / creditGoal).toFixed(0);
  const creditDate = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  console.log('CHART', creditGoal, creditCurrent, creditValue, creditPercent);
  const maxGoal = 100;
  const maxValue = (creditCurrent * 100) / creditGoal;
  console.log('MAXGOAL', maxGoal, maxValue);
  const tons = 173.243; // TODO: get from db?
  const tonx = (credit?.current ?? 0) / (credit?.value ?? 0);
  const perc = (tonx * 100) / tons;
  console.log('TONS', tons, tonx, perc, '%');
  // #endregion

  const chains = getChainConfiguration(
    appConfig.chains.map(chain => chain.slug),
  );
  const wallets =
    appConfig.chains.find(c => c.slug === selectedChain)?.wallets ?? [];

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
  const [buttonMessage, setButtonMessage] = useState(
    'One wallet confirmation required',
  );
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
  // const [percent, setPercent] = useState('0');
  const usdAmount = useMemo(() => {
    if (typeof amount === 'undefined') {
      return 0;
    }
    if (showUsd) {
      return +amount;
    }
    return +amount * exchangeRate;
  }, [amount, exchangeRate, showUsd]);
  const coinAmount = useMemo(() => {
    if (typeof amount === 'undefined') {
      return 0;
    }
    if (showUsd) {
      return +amount / exchangeRate;
    }
    return +amount;
  }, [amount, exchangeRate, showUsd]);
  const percent = useMemo(() => {
    const creditsToRetire = usdAmount / creditValue;
    const remainingCredits = tonx - creditsToRetire;
    const percentDiff = (100 * remainingCredits) / creditsToRetire;
    return percentDiff;
  }, [creditValue, usdAmount, tonx]);
  // const [offset, setOffset] = useState('0.00');
  const offset = (usdAmount / creditValue).toFixed(2);

  // function $(id: string) {
  //   return document.getElementById(id) as HTMLInputElement;
  // }

  function validEmail(text: string) {
    return text.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  }

  async function sendReceipt(data: any) {
    console.log('Sending receipt...', data);
    try {
      const result = await postApi('receipt', data);
      console.log('Receipt sent');
      console.log('Result', result);
      return { success: true };
    } catch (ex: any) {
      console.warn('Error sending receipt', ex);
      return { success: false, error: ex.message };
    }
  }

  //type Tx = Transaction<Memo<MemoType>, Operation[]>

  async function donate(
    contractId: string,
    from: string,
    amount: number,
    firstTime: boolean,
  ) {
    try {
      console.log('-- Donating', contractId, from, amount);
      const adr = new Address(from).toScVal();
      //const wei = BigInt(amount*10000000) // 7 decs
      const wei = nativeToScVal(amount * 10000000, { type: 'i128' });
      //const args = {from:adr, amount:wei}
      const args = [adr, wei];
      console.log('ARGS', args);
      const ctr = new Contract(contractId);
      console.log('CTR', ctr);
      const op = ctr.call('donate', ...args);
      //const op = ctr.call('donate', args)
      console.log('OP', op);
      //const account = await horizon.loadAccount(from)
      const account = await soroban.getAccount(from);
      console.log('ACT', account);
      //const base = await horizon.fetchBaseFee()
      //const fee = base.toString()
      const fee = BASE_FEE;
      const trx = new TransactionBuilder(account, {
        fee,
        networkPassphrase: network.passphrase,
      })
        .addOperation(op)
        .setTimeout(30)
        .build();
      console.log('TRX', trx);
      //window.trx = trx
      const sim = await soroban.simulateTransaction(trx);
      console.log('SIM', sim);
      //window.sim = sim
      if (SorobanRpc.Api.isSimulationSuccess(sim) && sim.result !== undefined) {
        console.log('RES', sim.result);
        // Now prepare it???
        let xdr = '';
        if (firstTime) {
          // Increment tx resources to avoid first time bug
          console.log('FIRST');
          //const sorobanData = new SorobanDataBuilder()
          const sorobanData = sim.transactionData;
          console.log('SDATA1', sorobanData);
          //window.sdata1 = sorobanData
          //sorobanData.readBytes += '60'
          const rBytes = sorobanData['_data'].resources().readBytes() + 60;
          const rFee = (
            parseInt(sorobanData['_data'].resourceFee()) + 100
          ).toString();
          sorobanData['_data'].resources().readBytes(rBytes);
          sorobanData.setResourceFee(rFee);
          const sdata = sorobanData.build();
          //window.sdata2 = sorobanData
          console.log('SDATA2', sorobanData);
          const fee2 = (parseInt(sim.minResourceFee) + 100).toString();
          //const fee2 = (parseInt(BASE_FEE) + 100).toString()
          console.log('FEE2', fee2);
          //const trz = trx.setSorobanData(sdata).setTransactionFee(fee2).build()
          const account2 = await soroban.getAccount(from);
          const trz = new TransactionBuilder(account2, {
            fee: fee2,
            networkPassphrase: network.passphrase,
          })
            .setSorobanData(sdata)
            .addOperation(op)
            .setTimeout(30)
            .build();
          console.log('TRZ', trz);
          //window.trz = trz
          const txz = await soroban.prepareTransaction(trz);
          console.log('TXZ', txz);
          xdr = txz.toXDR();
        } else {
          const txp = await soroban.prepareTransaction(trx);
          console.log('TXP', txp);
          xdr = txp.toXDR();
        }
        console.log('XDR', xdr);
        // Now sign it???
        const opx = { networkPassphrase: network.passphrase };
        //const opx = {network:network.name, networkPassphrase: network.passphrase, accountToSign: from}
        console.log('OPX', opx);
        //const res = await wallet.signAndSend(xdr, opx)
        const sgn = await signTransaction(xdr, opx);
        console.log('SGN', sgn);
        // Now send it?
        const txs = TransactionBuilder.fromXDR(sgn, network.passphrase); // as Tx
        console.log('TXS', txs);
        //const six = await soroban.simulateTransaction(txs)
        //console.log('SIX', six)
        //const prep = await soroban.prepareTransaction(six)
        //console.log('PREP', prep)
        ////const res = await soroban.sendTransaction(sgn)
        //const res = await soroban.sendTransaction(txs)
        const res = await soroban.sendTransaction(txs);
        console.log('RES', res);
        console.log('JSN', JSON.stringify(res, null, 2));

        const txid = res?.hash || '';
        console.log('TXID', txid);
        if (res?.status.toString() == 'ERROR') {
          console.log('TX ERROR');
          return { success: false, txid, error: 'Error sending payment (950)' }; // get error
        }
        if (res?.status.toString() == 'SUCCESS') {
          console.log('TX SUCCESS');
          return { success: true, txid, error: null };
        } else {
          // Wait for confirmation
          const secs = 1000;
          const wait = [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6]; // 60 secs / 15 loops
          let count = 0;
          let info = null;
          while (count < wait.length) {
            console.log('Retry', count);
            await new Promise(res => setTimeout(res, wait[count] * secs));
            count++;
            info = await soroban.getTransaction(txid);
            console.log('INFO', info);
            if (info.status == 'ERROR') {
              console.log('TX FAILED');
              return {
                success: false,
                txid,
                error: 'Error sending payment (951)',
                extra: info,
              }; // get error
            }
            if (info.status == 'NOT_FOUND' || info.status == 'PENDING') {
              continue; // Not ready in blockchain?
            }
            if (info.status == 'SUCCESS') {
              console.log('TX SUCCESS2');
              return { success: true, txid, error: null };
            } else {
              console.log('TX FAILED2');
              return {
                success: false,
                txid,
                error: 'Error sending payment (952)',
                extra: info,
              }; // get error
            }
          }
          return {
            success: false,
            txid,
            error: 'Error sending payment - timeout (953)',
          }; // get error
        }
      } else {
        console.log('BAD', sim);
        return {
          success: false,
          txid: '',
          error: 'Error sending payment - bad simulation (954)',
        }; // get error
      }
    } catch (ex) {
      console.log('ERROR', ex);
      return { error: ex.message };
    }
  }

  async function onSubmit() {
    // const amount = $('amount')?.value || '0';
    // const name = $('name-input')?.value || '';
    // const email = $('email-input')?.value || '';
    // const receipt = $('receipt-check')?.dataset.state == 'checked';
    // console.log('FORM --------');
    // console.log('Currency:', currency);
    // console.log('Wallet:', wallet);
    // console.log('Amount:', amount);
    // console.log('Name:', name);
    // console.log('Email:', email);
    // console.log('Receipt:', receipt);
    // console.log('ContractID:', contractId);

    // Validate required data
    if (typeof amount === 'undefined') {
      setButtonMessage('Enter a valid amount');
      return;
    }
    if (emailReceipt && !validEmail(email)) {
      setButtonMessage('Enter a valid email');
      return;
    }

    // Donate and mint
    setDonationForm(draft => {
      draft.paymentStatus = PAYMENT_STATUS.minting;
    });
    setButtonMessage('Approve payment in your Freighter wallet');

    const orgwallet = getWalletByChain(organization?.wallets, chainName);
    console.log('Org wallet', orgwallet);
    if (!orgwallet || !orgwallet?.address) {
      console.log(
        'Error sending payment, no wallet found for chain',
        chainName,
      );
      setButtonMessage(
        'Error: no wallet in this organization for ' + chainName,
      );
      return;
    }
    const receiver = orgwallet.address;
    console.log('Sending payment to', receiver, 'in contract', contractId);

    // const destinationTag = initiative.tag;
    // if amount in USD convert by coin rate
    const amountNum = Number.parseFloat(amount || '0');
    const coinAmount = showUsd ? amountNum / exchangeRate : amountNum;
    const usdAmount = showUsd ? amountNum : amountNum * exchangeRate;

    console.log('AMT', { showUsd, coinAmount, usdAmount });
    const weiValue = Math.trunc(coinAmount * 10000000).toString();
    console.log('WEI', weiValue);
    const amountStr = coinAmount.toFixed(7);

    await wallet.init();
    const info = await wallet.connect();
    console.log('WALLET', info);
    // Check network
    const stellarNet = process.env.NEXT_PUBLIC_STELLAR_NETWORK || '';
    const useNetwork = stellarNet == 'mainnet' ? 'public' : stellarNet;
    //if(info.network!==useNetwork){
    //  if(stellarNet=='mainnet'){
    //    console.log('Error: Wrong network', info.network)
    //    console.log('Expected network:', useNetwork)
    //    setButtonText('DONATE')
    //    setDisabled(false)
    //    setButtonMessage('Select '+stellarNet+' network in Freighter Wallet')
    //    return
    //  }
    //}

    const donor = info?.account;
    console.log('DONOR', donor);
    if (!donor) {
      setButtonMessage('Error: Signature rejected by user');
      console.log('Error: Signature rejected by user');
      return;
    }

    // Check user exists or create a new one
    let firstTime = true;
    const userRes = await fetchApi('users?wallet=' + donor);
    let userInfo = userRes?.result || null;
    console.log('USER', userInfo);
    const userId = userInfo?.id || '';
    if (userId) {
      // Check donations
      const userDon = await fetchApi('donations?userId=' + userId);
      console.log('DONS', userDon);
      if (userDon?.result?.length > 0) {
        firstTime = false;
      }
    } else {
      //const email = donor.substr(0,10).toLowerCase() + '@example.com'
      const user = await postApi('users', {
        name: 'Anonymous',
        wallet: donor,
        wallets: {
          create: {
            address: donor,
            chain: chainName,
          },
        },
      });
      userInfo = user.data;
      console.log('NEWUSER', userInfo);
      if (!userInfo) {
        console.log('ERROR', 'Error creating user');
        setButtonMessage('Error: User could not be created');
        return;
      }
      //const ok1 = await registerUser(contractId, donor) // FIX: Bug in Soroban, register user in contract on first use
      //console.log('REG', ok1)
      /*
        per discord: sorobanData.readBytes += 60; sorobanData.resourceFee +=  100; tx.fee += 100
      */
    }

    //const memo = destinTag ? 'tag:'+destinTag : ''
    const result = await donate(contractId, donor, amountNum, firstTime);
    console.log('UI RESULT', result);
    if (!result?.success) {
      setButtonMessage('Error sending payment');
      return;
    }
    setButtonMessage('Payment sent successfully');

    // Save donation to DB
    const catId = initiative.categoryId || organization.categoryId;
    const donation = {
      organizationId: organization.id,
      initiativeId: initiative.id,
      categoryId: catId,
      userId: userInfo?.id,
      paytype: 'crypto',
      chain: chainName,
      network: netname,
      wallet: donor,
      amount: coinAmount,
      usdvalue: usdAmount,
      asset: currency,
      status: 1,
    };
    console.log('DONATION', donation);
    const res = await postApi('donations', donation);
    console.log('RES', res);
    if (!res.success) {
      setButtonText('ERROR');
      setDisabled(true);
      setButtonMessage('Error saving donation in database');
      return;
    }
    //const donationId = res.data?.id

    // Save donation in usd to credit totals
    console.log('CCC', credit.current, usdAmount);
    const current = parseFloat(credit.current) + usdAmount;
    const res2 = await postApi('credits', { id: credit.id, data: { current } });
    console.log('RES2', res2);

    // Send receipt
    if (receipt) {
      //sendReceipt(name, email, organization, amount, currency, rate, issuer)
      console.log('YES receipt...');
      setButtonMessage('Sending receipt, wait a moment...');
      const data: ReceiptEmailBody & { email: string } = {
        date: new Date().toISOString(),
        donorName: name,
        email: email,
        organizationName: organization.name,
        address: organization.mailingAddress ?? '',
        ein: organization.EIN ?? '',
        coinSymbol: selectedToken,
        coinValue: `${coinAmount}`,
        usdValue: usdAmount.toFixed(2),
      };
      const rec = await sendReceipt(data);
      console.log('Receipt sent', rec);
    }

    const NFTData = {
      status: 'Claim',
      organization: {
        name: organization.name,
        address: organization.mailingAddress,
        ein: organization.EIN,
      },
      initiativeId: initiative.id,
      tag: initiative.tag,
      image: initiative.defaultAsset,
      date: new Date(),
      amount: coinAmount,
      ticker: currency,
      amountFiat: usdAmount,
      fiatCurrencyCode: 'USD',
      donor: {
        address: donor,
        name: name || userInfo?.name || 'Anonymous',
      },
      receiver,
      contractId,
      chainName,
      rate: exchangeRate,
      txid: result.txid,
    };
    setDonation(NFTData);
    setButtonText('DONE');
    setDisabled(true);
    setButtonMessage('Thank you for your donation!');
  }

  useEffect(() => {
    console.log('SWITCH');
    recalc();
  }, [showXLM]);

  function recalc() {
    console.log('--RECALC');
    //const amountInp = evt.target.value || '0'
    const amountInp = $('amount')?.value || '0';
    const amountNum = parseFloat(amountInp);
    const coinAmount = showXLM ? amountNum : amountNum / exchangeRate;
    const usdAmount = showXLM ? amountNum * exchangeRate : amountNum;
    const retire = (usdAmount / creditValue).toFixed(2);
    const pct = (
      usdAmount > creditValue ? 100 : (usdAmount / creditValue) * 100
    ).toFixed(2);
    console.log('Changed', amountInp);
    console.log('Retire', usdAmount, retire, pct);
    setOffset(retire);
    setPercent(pct);
    const data = {
      ...donation,
      amount: coinAmount,
      amountFiat: usdAmount,
      ticker: 'XLM',
    };
    setDonation(data);
    console.log('DATA', data);
  }

  function refresh() {
    const name = $('name-input').value || 'Anonymous';
    console.log('NAME', name);
    const data = {
      ...donation,
      donor: { address: donation.donor.address, name },
    };
    setDonation(data);
    console.log('DATA', data);
  }

  return (
    <div className="flex min-h-full w-full">
      <Card className="py-6 w-full">
        <div className="px-6">
          <Label htmlFor="currency-select" className="mb-2">
            Currency
          </Label>
          <DonationFormSelect
            id="currency-select"
            className="mb-6"
            options={chains}
            currentOption={currentChain ?? ''}
            handleChange={(chain: ChainSlugs) => {
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
            currentOption={currentWallet?.value ?? ''}
            handleChange={(wallet: { value: string; image: string }) =>
              setCurrentWallet(wallet)
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
              {parseInt(offset) == 1 ? '' : 's'} of carbon
            </p>
            <Progress value={percent} />
            <p className="mt-2 mb-4">1 ton of carbon = USD {creditValue}</p>
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
                    setChainState(draft => {
                      draft.showUsd = !draft.showUsd;
                    });
                  }}
                />
                <Label>{chain.selectedToken}</Label>
              </div>
            </div>
            <div className="my-auto">
              <InputWithContent
                className="pl-4"
                type="text"
                id="amount"
                text={showUsd ? '| USD' : `| ${chain.selectedToken}`}
                onChange={recalc}
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
            onChange={refresh}
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
