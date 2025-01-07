'use client';

import type { Contract, Event } from '@cfce/database';
import { readContract, switchChain, waitForTransaction } from '@wagmi/core';
import { BrowserQRCodeReader } from '@zxing/library';
import clipboard from 'clipboardy';
import { LucideClipboardPaste, LucideQrCode } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '~/styles/dashboard.module.css';
import { useAccount, useWriteContract } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import ButtonBlue from '~/components/buttonblue';
import TextInput from '~/components/form/textinput';
import Title from '~/components/title';
import { abiVolunteersNFT as NFTAbi } from '@cfce/blockchain-tools';
import { cleanAddress } from '~/utils/address';
import { config } from '~/utils/wagmiConfig';

const arbitrumSepolia = wagmiChains.arbitrumSepolia;

interface RegisterClientProps {
  id: string;
  event: Event;
  contractNFT: Contract;
}

export default function RegisterClient({
  id,
  event,
  contractNFT,
}: RegisterClientProps) {
  const qrReader = useRef<BrowserQRCodeReader | null>(null);
  const [device, setDevice] = useState<string | null>(null);
  const [message, setMessage] = useState(
    'Scan the QR-CODE to register for the event',
  );
  const [scanStatus, setScanStatus] = useState<'ready' | 'scanning'>('ready');

  const account = useAccount();
  const { writeContractAsync } = useWriteContract({ config });

  const { register, watch, setValue } = useForm({
    defaultValues: { address: '' },
  });
  const [address] = watch(['address']);

  // Initialize QR reader
  useEffect(() => {
    if (qrReader.current) {
      return;
    }
    const reader = new BrowserQRCodeReader();
    qrReader.current = reader;

    reader
      .getVideoInputDevices()
      .then(videoInputDevices => {
        if (videoInputDevices[0]?.deviceId) {
          setDevice(videoInputDevices[0].deviceId);
        }
      })
      .catch(err => {
        console.error(err);
        setMessage('Error accessing camera');
      });
  }, []);

  const beginDecode = useCallback(() => {
    if (!qrReader.current || !device) return;

    qrReader.current.decodeFromInputVideoDeviceContinuously(
      device,
      'qrcode',
      (result, error) => {
        if (error) {
          setMessage(error instanceof Error ? error.message : 'Unknown error');
          return;
        }
        if (!result) return;

        const address = result.getText();
        setMessage('Wallet Scanned!');
        setValue('address', address);
        setScanStatus('ready');
        qrReader.current?.stopContinuousDecode();
      },
    );
  }, [device, setValue]);

  async function onScan() {
    setScanStatus('scanning');
    setMessage('Scanning qrcode...');
    beginDecode();
  }

  async function onStop() {
    setScanStatus('ready');
    setMessage('Ready to scan');
    try {
      qrReader.current?.reset();
    } catch (ex) {
      console.error(ex);
    }
  }

  async function onMint() {
    const nft = contractNFT.contract_address as `0x${string}`;

    if (!account?.address || !nft) {
      setMessage('Please Connect Wallet in Metamask');
      return;
    }

    setMessage('Minting NFT, please wait...');

    if (account.chainId !== arbitrumSepolia.id) {
      await switchChain(config, { chainId: arbitrumSepolia.id });
    }

    const cleanedAddress = cleanAddress(address);

    try {
      const balance = await readContract(config, {
        address: nft,
        abi: NFTAbi,
        functionName: 'balanceOf',
        args: [cleanedAddress as `0x${string}`, BigInt(1)],
      });

      if (balance > BigInt(0)) {
        setMessage('User already registered for this event');
        return;
      }

      const hash = await writeContractAsync({
        address: nft,
        abi: NFTAbi,
        functionName: 'mint',
        args: [cleanedAddress as `0x${string}`, BigInt(1), BigInt(1)],
        chain: arbitrumSepolia,
        account: account.address,
      });

      const nftReceipt = await waitForTransaction(config, {
        hash,
        confirmations: 2,
      });

      setMessage('NFT minted successfully');
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(
        `Registration error - ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  return (
    <div className="mt-8">
      <div className={styles.mainBox}>
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
            label=""
            id="address"
            className="text-center"
            register={register('address')}
            renderRight={
              <LucideClipboardPaste
                onClick={async () => {
                  const pasteContent = await clipboard.read();
                  setValue('address', pasteContent);
                }}
              />
            }
            value={address}
          />
        </div>
        <div className="w-full mb-2 flex flex-row justify-between">
          <ButtonBlue
            id="buttonSubmit"
            text="MINT ATTENDANCE NFT"
            onClick={onMint}
          />
        </div>
        <p id="message" className="mb-6 center text-center truncate w-full">
          {message}
        </p>
      </div>
    </div>
  );
}
