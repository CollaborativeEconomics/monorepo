import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Script from 'next/script';
import Title from 'components/title';
import ButtonBlue from 'components/buttonblue';
import { getEventById } from 'utils/registry';
import { cleanAddress } from 'utils/address';
import styles from 'styles/dashboard.module.css';
import { BrowserQRCodeReader } from '@zxing/library';
import TextInput from 'components/form/textinput';
import { useAccount, useWriteContract } from 'wagmi';
import { readContract, switchChain, waitForTransaction } from '@wagmi/core';
//import { arbitrumSepolia } from 'wagmi/chains';
import { config } from 'chains/config';
import { NFTAbi } from 'chains/contracts/volunteers/abis';
import { getContract } from 'utils/registry';
import {
  LucideClipboardPaste,
  LucideQrCode,
  LucideThumbsUp,
  LucideX,
} from 'lucide-react';
import clipboard from 'clipboardy';
import * as wagmiChains from 'wagmi/chains'

const arbitrumSepolia = wagmiChains['arbitrumSepolia']

export async function getServerSideProps(context) {
  const id = context.query.id;
  const event = await getEventById(id);
  console.log('EVENT', event);
  const redirect = {
    redirect: { destination: '/dashboard/events', permanent: false },
  };
  if (!event) {
    return redirect;
  }
  const resNFT = await getContract(id, 'arbitrum', 'testnet', '1155');
  const contractNFT = !resNFT.error && resNFT.length > 0 ? resNFT[0] : null;
  console.log('NFT', contractNFT);
  if (!contractNFT) {
    return redirect;
  }
  return { props: { id, event, contractNFT } };
}

export default function Page({ id, event, contractNFT }) {
  console.log('EVENT ID', id);
  const qrReader = useRef<BrowserQRCodeReader>(null);
  const [device, setDevice] = useState(null);
  const [message, setMessage] = useState(
    'Scan the QR-CODE to register for the event',
  );
  const [scanStatus, setScanStatus] = useState<'ready' | 'scanning'>('ready');
  const account = useAccount();
  const { writeContractAsync } = useWriteContract({ config });
  // TODO: move to config file
  const currentChain = arbitrumSepolia;

  const { register, watch, setValue } = useForm({
    defaultValues: { address: '' },
  });
  const [address] = watch(['address']);

  // initialize QR reader
  useEffect(() => {
    if (qrReader.current) {
      return;
    }
    qrReader.current = new BrowserQRCodeReader();
    qrReader.current
      .getVideoInputDevices()
      .then(videoInputDevices => {
        // setDevice(videoInputDevices.findLast(v => v.deviceId);
        setDevice(videoInputDevices[0].deviceId);
      })
      .catch(err => {
        console.error(err);
      });
    console.log('QRCode reader initialized');
  }, []);

  function beginDecode() {
    qrReader.current.decodeFromInputVideoDeviceContinuously(
      device,
      'qrcode',
      (result, error) => {
        if (error) {
          setMessage(error instanceof Error ? error.message : 'Unknown error');
          return;
        }
        console.log('Result', result);
        const address = result.getText();
        setMessage('Wallet Scanned!');
        setValue('address', address);
        setScanStatus('ready');
        // qrReader.current.reset();
        qrReader.current.stopContinuousDecode();
        // We got the wallet address
        // We may save the eventid, address and chain in volunteers table
      },
    );
    // .catch(err => {
    //   console.error(err);
    // });
  }

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
      qrReader.current.reset();
    } catch (ex) {
      console.error(ex);
    }
  }

  async function onMint() {
    //const nft: `0x${string}` = "0x950728DE32cC1bF223D3Fe51B0a44A4A1C868A72"
    const nft: `0x${string}` = contractNFT.contract_address;
    console.log('account', account.address);

    if (!account?.address || !nft) {
      console.error('User not connected or NFT contract not deployed');
      setMessage('Please Connect Wallet in Metamask');
      return;
    }

    setMessage('Minting NFT, please wait...');

    console.log('account', account);

    if (account.chainId !== currentChain.id) {
      await switchChain(config, { chainId: currentChain.id });
    }

    console.log('address', address);
    const cleanedAddress = cleanAddress(address);

    try {
      // Check if user already has NFT with token ID 1
      const balance = await readContract(config, {
        address: nft,
        abi: NFTAbi,
        functionName: 'balanceOf',
        args: [cleanedAddress as `0x${string}`, BigInt(1)],
      });
      console.log('BALANCE', balance);

      if (balance > BigInt(0)) {
        // throw new Error('User already registeredfor this event');
        setMessage('User already registered for this event');
        return;
      }

      // Mint new NFT for the user
      const hash = await writeContractAsync({
        address: nft,
        abi: NFTAbi,
        functionName: 'mint',
        args: [cleanedAddress as `0x${string}`, BigInt(1), BigInt(1)],
        chain: currentChain,
        account: account.address,
      });

      console.log('HASH', hash);

      console.log('CONFIG', config);
      console.log('HASH', hash);
      const nftReceipt = await waitForTransaction(config, {
        hash,
        confirmations: 2,
      });
      console.log('RECEIPT', nftReceipt);

      console.log('NFT minted successfully');
      setMessage('NFT minted successfully');
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(
        'Registration error - ' +
          (error instanceof Error ? error.message : 'Unknown error'),
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
          <video id="qrcode" className="w-full h-full object-cover" />
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
