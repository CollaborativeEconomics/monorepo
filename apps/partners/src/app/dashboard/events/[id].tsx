import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Dashboard from 'components/dashboard';
import Sidebar from 'components/sidebar';
import Title from 'components/title';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import { DateDisplay } from 'components/ui/date-posted';
import Gallery from 'components/ui/gallery';
import ShareModal from 'components/ShareModal';
import NotFound from 'components/NotFound';
import OrganizationAvatar from 'components/organizationavatar';
import { getEventById } from 'utils/registry';
import styles from 'styles/dashboard.module.css';
import ButtonBlue from 'components/buttonblue';
import LinkButton from 'components/linkbutton';
import { useConnect, useAccount, useWriteContract } from 'wagmi';
import { readContract, switchChain, waitForTransaction } from '@wagmi/core';
//import { arbitrumSepolia } from 'wagmi/chains';
import { config } from 'chains/config';
import { FactoryAbi } from 'chains/contracts/volunteers/abis';
import { parseEther } from 'viem';
//import { newContract } from 'utils/registry'
import { metaMask } from 'wagmi/connectors';
import { net } from 'web3';
import { apiFetch, apiPost } from 'utils/api';
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
  const resV2E = await getContract(id, 'arbitrum', 'testnet', 'V2E');
  console.log('RES', resV2E);
  console.log('RES', resNFT);
  const contractNFT =
    !resNFT.error && resNFT.result.length > 0 ? resNFT.result[0] : null;
  const contractV2E =
    !resV2E.error && resV2E.result.length > 0 ? resV2E.result[0] : null;
  console.log('NFT', contractNFT);
  console.log('V2E', contractV2E);
  //const media = []
  const media = event.media?.map((it: any) => it.media) || []; // flatten list
  media.unshift(event.image); // main image to the top
  return {
    props: { id, event, media, contractNFT, contractV2E },
  };
}

// Server calls
// TODO: may move to utils

async function newContract(data) {
  // TODO: we may validate if needed
  const info = await apiPost('contracts', data);
  return info;
}

async function getContract(entity_id, chain, network, contract_type) {
  const query = `contracts?entity_id=${entity_id}&chain=${chain}&network=${network}&contract_type=${contract_type}`;
  console.log('QUERY', query);
  const info = await apiFetch(query);
  return info;
}

export default function Event({ id, event, media, contractNFT, contractV2E }) {
  console.log('EVENTID', id);
  var total = 0;
  const {
    connectors,
    connect,
    data: connection,
    isSuccess,
  } = useConnect({ config });
  const { chainId, address } = useAccount();
  const { writeContractAsync } = useWriteContract({ config });

  // State Variables
  const started = contractNFT && contractV2E;
  const [eventStarted, setEventStarted] = useState(started);
  const [ready, setReady] = useState(false);
  const [distributor, setDistributor] = useState(null);
  const [NFT, setNFT] = useState(null);
  const [message, setMessage] = useState(
    'You will sign two transactions with your wallet',
  );

  function shortDate(d) {
    const opt: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: 'numeric',
      day: '2-digit',
    };
    const date = new Date(d).toLocaleDateString('en-CA');
    //const date = new Date(d).toLocaleDateString('en', opt)
    //const date = Intl.DateTimeFormat('jp-JP').format(new Date(d))
    return date;
  }

  // TODO: move to config file
  const FactoryAddress = '0xD4E47912a12f506843F522Ea58eA31Fd313eB2Ee';
  // const usdcAddressTestnet = '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d'; public circle one
  const usdcAddressTestnet = '0x80C2f901ABA1F95e5ddb2A5024E7Df6a366a3AB0'; // CFCE-controlled contract
  let NFTBlockNumber: number;
  let distributorBlockNumber: number;

  async function deployNFT() {
    try {
      console.log('Initiating NFT deployment...');
      setMessage('Initiating NFT deployment, please wait...');
      const uri =
        'https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1.json';
      const hash = await writeContractAsync({
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: 'deployVolunteerNFT',
        args: [uri, address],
        chain: arbitrumSepolia,
        account: address,
      });

      console.log('NFT deployment initiated. Waiting for confirmation...');
      // new Promise(resolve => setTimeout(resolve, 30000));
      const nftReceipt = await waitForTransaction(config, {
        hash,
        confirmations: 2,
      });
      console.log('NFT deployment confirmed. Receipt:', nftReceipt);
      setMessage('NFT deployment confirmed');
      NFTBlockNumber = nftReceipt.blockNumber.toString();

      const NFTAddress = await readContract(config, {
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: 'getDeployedVolunteerNFT',
        args: [address],
      });
      console.log('NFTAddress:', NFTAddress);
      setNFT(NFTAddress);

      return NFTAddress;
    } catch (error) {
      console.error('NFT deployment error:', error);
      throw error;
    }
  }

  async function deployTokenDistributor(NFTAddress) {
    try {
      console.log('Initiating TokenDistributor deployment...');
      setMessage('Initiating Distributor deployment, please wait...');
      const hash = await writeContractAsync({
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: 'deployTokenDistributor',
        args: [
          usdcAddressTestnet,
          NFTAddress as `0x${string}`,
          parseEther(event.unitvalue.toString()),
        ],
        chain: arbitrumSepolia,
        account: address,
      });

      console.log(
        'TokenDistributor deployment initiated. Waiting for confirmation...',
      );
      const distributorReceipt = await waitForTransaction(config, {
        hash,
        confirmations: 2,
      });
      console.log(
        'TokenDistributor deployment confirmed. Receipt:',
        distributorReceipt,
      );
      setMessage('Distributor deployment confirmed');
      distributorBlockNumber = distributorReceipt.blockNumber.toString();

      const distributorAddress = await readContract(config, {
        address: FactoryAddress,
        abi: FactoryAbi,
        functionName: 'getDeployedTokenDistributor',
        args: [address],
      });
      console.log('distributorAddress:', distributorAddress);

      return distributorAddress;
    } catch (error) {
      console.error('TokenDistributor deployment error:', error);
      throw error;
    }
  }

  async function deploy() {
    try {
      if (chainId !== arbitrumSepolia.id) {
        await switchChain(config, { chainId: arbitrumSepolia.id });
      }
    } catch (error) {
      console.error('Error switching chain:', error);
      throw error;
    }

    try {
      const NFTAddress = await deployNFT();
      const distributorAddress = await deployTokenDistributor(NFTAddress);

      console.log('Both deployments successful:', {
        NFTAddress,
        distributorAddress,
      });

      const erc1155 = {
        chain: 'arbitrum',
        contract_address: NFTAddress,
        entity_id: id as string,
        admin_wallet_address: address as string,
        contract_type: '1155',
        network: 'testnet',
        start_block: NFTBlockNumber,
      };

      const info = await newContract(erc1155);
      console.log('INFO', info);

      const v2e = {
        chain: 'arbitrum',
        contract_address: distributorAddress as string,
        entity_id: id as string,
        admin_wallet_address: address as string,
        contract_type: 'V2E',
        network: 'testnet',
        start_block: distributorBlockNumber,
      };
      const info2 = await newContract(v2e);
      console.log('INFO2', info2);

      setReady(true);
      setEventStarted(true);
    } catch (error) {
      console.error('Deployment process failed:', error);
      throw error;
    }
  }

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="Volunteer To Earn Event" />
        <div className={styles.viewBox}>
          <DateDisplay timestamp={event.created} className="p-4" />
          <div className="p-4 mt-2">
            <Gallery images={media} />
          </div>
          <div className="flex flex-col pb-8 pt-3 gap-3 px-4">
            <h1 className="mt-4 text-4xl">{event.name}</h1>
            <p className="">{event.description}</p>
          </div>
          {/*
          <div className="w-full p-4 mt-2">
            <h1 className="my-2">Volunteers</h1>
            <table className="w-full">
              <thead>
                <tr className="text-slate-400"><th align="left">Address</th><th align="right">Payment</th></tr>
              </thead>
              <tbody className="border-t-2">
              {volunteers?.map((item)=>{
                //console.log('ITEM')
                total += parseInt(item.amount)
                return (
                  <tr key={item.id}>
                    <td>{item.address.toLowerCase()}</td>
                    <td align="right">${item.amount}</td>
                  </tr>
                )
              })}
              </tbody>
              <tfoot className="border-t-2">
                <tr>
                  <td colSpan={2} align="right">Total ${total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          */}
          {!eventStarted && (
            <div className="w-full flex flex-col justify-center align-center items-center mb-8">
              <ButtonBlue text="START EVENT" onClick={deploy} />
              <p>{message}</p>
            </div>
          )}
          {eventStarted && (
            <div className="w-full flex flex-row justify-between mb-8">
              <LinkButton
                href={`/dashboard/events/register/${id}`}
                text="REGISTER"
              />
              <LinkButton
                href={`/dashboard/events/report/${id}`}
                text="REPORT"
              />
              <LinkButton
                href={`/dashboard/events/reward/${id}`}
                text="REWARD"
              />
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
}
