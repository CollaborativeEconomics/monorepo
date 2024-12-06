import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Dashboard from 'components/dashboard';
import Sidebar from 'components/sidebar';
import Title from 'components/title';
import ButtonBlue from 'components/buttonblue';
import TextInput from 'components/form/textinput';
import { getEventById } from 'utils/registry';
import styles from 'styles/dashboard.module.css';
import { useConnect, useAccount, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
//import { arbitrumSepolia } from 'wagmi/chains';
import { config } from 'chains/config';
import { DistributorAbi } from 'chains/contracts/volunteers/abis';
import { getRegisteredAddresses, getReportedAddresses } from 'chains/logs';
import { getContract } from 'utils/registry';
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
  const resV2E = await getContract(id, 'arbitrum', 'testnet', 'V2E');
  const contractV2E = !resV2E.error && resV2E.length > 0 ? resV2E[0] : null;
  console.log('V2E', contractV2E);
  if (!contractV2E) {
    return redirect;
  }
  const { data: volunteers } = await getReportedAddresses(
    contractNFT.contract_address,
    contractNFT.start_block,
  );
  console.log('VOLUNTEERS', volunteers);
  return { props: { id, event, volunteers, contractNFT, contractV2E } };
}

export default function Page({
  id,
  event,
  volunteers,
  contractNFT,
  contractV2E,
}) {
  console.log('EVENT ID', id);
  const [device, setDevice] = useState(null);
  const [message, setMessage] = useState('Start the disbursement process');
  const { data: hash, writeContractAsync } = useWriteContract({ config });
  const { connectors, connect } = useConnect();
  const payrate = event?.payrate || 1;
  const unitlabel = event?.unitlabel || '';
  var total = 0;
  // TODO: move to config file
  const currentChain = arbitrumSepolia;
  const account = useAccount();

  const { register, watch, setValue } = useForm({
    defaultValues: { amount: '' },
  });
  const [amount] = watch(['amount']);

  async function onFund() {
    console.error('Funding contract...');
    setMessage('Funding contract...');
    // TODO: Fund wallet
    // in server side props
    //   get org wallet with USDC
    //   get V2E contract address
    // const ok = sendToken(amount, tokenAddress, contractV2E.contract_address)
  }

  async function onMint() {
    const nft: `0x${string}` = contractNFT.contract_address;
    const distributor: `0x${string}` = contractV2E.contract_address;

    if (!account.isConnected) {
      console.error('User not connected');
      setMessage('User not connected');
      return;
    }

    try {
      // Call distributeTokensByUnit function
      const registered = volunteers.map(it => it.address);
      console.log(
        'REGISTERED',
        registered,
        distributor,
        currentChain,
        account.address,
      );
      const hash = await writeContractAsync({
        address: distributor,
        abi: DistributorAbi,
        functionName: 'distributeTokensByUnit',
        args: [registered],
        chain: currentChain,
        account: account.address,
      });

      const distributionReceipt = await waitForTransactionReceipt(config, {
        hash,
        confirmations: 2,
      });

      console.log('Tokens distributed successfully');
      setMessage('Tokens distributed successfully');
    } catch (error) {
      console.error('Reward distribution error:', error);
    }
  }

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.mainBox}>
          <Title text="VOLUNTEER TO EARN" />
          <h1>{event.name}</h1>
          <div className="w-full p-4 mt-2">
            <h1 className="my-2">Volunteers</h1>
            <table className="w-full">
              <thead>
                <tr className="text-slate-400">
                  <th align="left">Address</th>
                  <th align="right">Payment</th>
                </tr>
              </thead>
              <tbody className="border-t-2">
                {volunteers?.length &&
                  volunteers?.map(v => {
                    //console.log('ITEM')
                    total += parseInt(v.value) * payrate;
                    return (
                      <tr key={`volunteer-${v.address}`}>
                        <td>{v.address}</td>
                        <td align="right">${v.value * payrate}</td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot className="border-t-2">
                <tr>
                  <td colSpan={2} align="right">
                    Total ${total}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div>
            <p>Contract: {contractV2E.contract_address}</p>
            <p className="text-slate-500">
              Be sure to fund the contract with USDC before rewarding volunteers
            </p>
            {/*
            <TextInput
              label={"Contract: "+contractV2E.contract_address}
              register={register('amount')}
              type="number"
              pattern="\d*"
            />
            <ButtonBlue
              id="buttonFund"
              text="ADD FUNDS TO CONTRACT"
              onClick={onFund}
            />
            */}
          </div>
          <div className="w-full mb-2 flex flex-row justify-between">
            <ButtonBlue
              id="buttonSubmit"
              text="REWARD VOLUNTEERS"
              onClick={onMint}
            />
          </div>
          <p id="message" className="mb-6 center">
            {message}
          </p>
        </div>
      </div>
    </Dashboard>
  );
}
