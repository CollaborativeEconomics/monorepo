'use client';

import { abiVolunteersNFT as NFTAbi } from '@cfce/blockchain-tools';
import type { Contract, Event } from '@cfce/database';
import { readContract, switchChain, waitForTransaction } from '@wagmi/core';
import { BrowserQRCodeReader } from '@zxing/library';
import clipboard from 'clipboardy';
import { LucideClipboardPaste, LucideQrCode } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useAccount, useWriteContract } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import ButtonBlue from '~/components/buttonblue';
import TextInput from '~/components/form/textinput';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';
import { cleanAddress } from '~/utils/address';
import { wagmiConfig, wagmiConnect, wagmiReconnect } from '~/utils/wagmiConfig';

// We may change chains in the future
const defaultChain = arbitrumSepolia;

interface ReportClientProps {
  id: string;
  event: Event;
  contractNFT: Contract;
}

interface DataForm {
  address: string;
  units: string;
}

export default function ReportClient({
  id,
  event,
  contractNFT,
}: ReportClientProps) {
  const qrReader = useRef<BrowserQRCodeReader | null>(null);
  const [device, setDevice] = useState<string | null>(null);
  const [message, setMessage] = useState(
    'Scan the QR-CODE to report work delivered',
  );
  const [scanStatus, setScanStatus] = useState<'ready' | 'scanning'>('ready');

  const { register, handleSubmit, watch, setValue } = useForm<DataForm>({
    defaultValues: { address: '', units: '' },
  });

  const [address, units] = watch(['address', 'units']);
  const payrate = Number(event?.payrate) || 1;
  const unitlabel = event?.unitlabel || '';
  const [amount, setAmount] = useState(payrate);

  const { writeContractAsync } = useWriteContract({ config: wagmiConfig });
  const account = useAccount();

  // Initialize QR reader
  useEffect(() => {
    if (!qrReader.current) {
      qrReader.current = new BrowserQRCodeReader();
    }
    qrReader.current
      .getVideoInputDevices()
      .then((videoInputDevices: MediaDeviceInfo[]) => {
        setDevice(videoInputDevices[0].deviceId);
      })
      .catch((err: Error) => {
        console.error(err);
      });
    console.log('QRCode reader initialized');
  }, []);

  const beginDecode = useCallback(() => {
    if (!qrReader.current) return;

    qrReader.current.decodeFromInputVideoDeviceContinuously(
      device,
      'qrcode',
      (result, error) => {
        if (error) {
          setMessage(error.message || 'Unknown error');
          return;
        }
        if (!result) return;

        const address = result.getText();
        setMessage(`Wallet ${address}`);
        setValue('address', address);
        setScanStatus('ready');
        qrReader.current?.stopContinuousDecode();
      },
    );
  }, [device, setValue]);

  async function onScan() {
    console.log('Scanning device', device);
    setScanStatus('scanning');
    setMessage('Scanning qrcode...');
    beginDecode();
  }

  async function onStop() {
    console.log('Stopped');
    setScanStatus('ready');
    setMessage('Ready to scan');
    try {
      qrReader.current?.reset();
    } catch (ex) {
      console.error(ex);
    }
  }

  async function onSubmit(data: DataForm) {
    console.log('DATA:', data);
    const address = data.address;
    const units = Number.parseInt(data.units);
    const nft = contractNFT.contract_address as `0x${string}`;
    const cleanedAddress = cleanAddress(address) as `0x${string}`;
    const tokenId1 = BigInt(1);
    const tokenId2 = BigInt(2);
    console.log('address', address);
    console.log('units', units || 0);

    if (!units || units < 1) {
      setMessage('Units must be greater than zero');
      return;
    }

    const connected = await wagmiConnect();
    console.log('CONNECTED', connected);

    if (!account.isConnected) {
      console.error('User not connected');
      setMessage('Please connect Metamask wallet');
      return;
    }

    if (account.chainId !== defaultChain.id) {
      console.log('Switching chains...');
      await switchChain(wagmiConfig, { chainId: defaultChain.id });
    }

    setMessage('Minting reward NFT, please wait...');

    try {
      const balance = await readContract(wagmiConfig, {
        address: nft,
        abi: NFTAbi,
        functionName: 'balanceOf',
        args: [cleanedAddress, tokenId1],
      });
      console.log('Balance', balance);

      if (balance === BigInt(0)) {
        console.log('No Balance');
        setMessage('Error: Volunteer not yet registered');
        return;
      }

      console.log('Mint');
      const hash = await writeContractAsync({
        address: nft,
        abi: NFTAbi,
        functionName: 'mint',
        args: [cleanedAddress, tokenId2, BigInt(units)],
        chain: defaultChain,
        account: account.address,
      });

      const nftReceipt = await waitForTransaction(wagmiConfig, {
        hash,
        confirmations: 2,
      });
      console.log('RECEIPT', nftReceipt);

      console.log('Reward NFT (token ID 2) minted successfully');
      setMessage('Reward NFT minted successfully');
    } catch (error) {
      console.error('Reward error:', error);
      setMessage(
        `Reward error - ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  function recalc(evt: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(evt.target.value) || 1;
    console.log('CALC', value);
    const total = value * payrate;
    setAmount(total);
  }

  return (
    <div className="mt-8">
      <form className={styles.mainBox} onSubmit={handleSubmit(onSubmit)}>
        <Title text="VOLUNTEER TO EARN" />
        <h1>{event.name}</h1>
        <div className="mt-8 border border-dashed rounded-lg aspect-square overflow-hidden w-[70%] relative">
          {scanStatus === 'ready' && (
            <div className="absolute top-0 left-0 w-full h-full bg-blue-700/50 flex items-center justify-center">
              <LucideQrCode className="text-white" size={60} />
            </div>
          )}
          <video
            id="qrcode"
            className="w-full h-full object-cover"
            aria-label="QR code scanner"
            muted // ignores biome need for captions
          />
        </div>
        <div className="w-full mb-2 flex flex-row justify-between">
          <ButtonBlue
            id="buttonSubmit"
            text={scanStatus === 'ready' ? 'SCAN' : 'CANCEL'}
            onClick={scanStatus === 'ready' ? onScan : onStop}
          />
        </div>
        <div className="w-[90%] text-center">
          <TextInput
            label="Wallet address"
            id="address"
            className="text-center"
            {...register('address')}
            renderRight={
              <LucideClipboardPaste
                onClick={async () => {
                  const pasteContent = await clipboard.read();
                  setValue('address', pasteContent);
                }}
              />
            }
          />
          <TextInput
            label="Units delivered"
            {...register('units')}
            type="number"
            pattern="\d*"
            onChange={recalc}
          />
          <div className="text-center">
            <p>Estimated reward based on units delivered</p>
            <p>
              {payrate} USD per unit ({unitlabel})
            </p>
            <p>
              <big>
                <b>Total of {amount} USD</b>
              </big>
            </p>
          </div>
        </div>
        <div className="w-full mb-2 flex flex-row justify-between">
          <ButtonBlue id="buttonSubmit" type="submit" text="MINT REPORT NFT" />
        </div>
        <p id="message" className="mb-6 center text-center truncate w-full">
          {message}
        </p>
      </form>
    </div>
  );
}
