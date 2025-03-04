'use client';

import appConfig from '@cfce/app-config';
import type { Chain } from '@cfce/database';
import type { ChainSlugs } from '@cfce/types';
//import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonBlue from '~/components/buttonblue';
import Select from '~/components/form/select';
import TextInput from '~/components/form/textinput';
import styles from '~/styles/dashboard.module.css';
import { createWallet } from './actions';

type WalletFormProps = {
  orgId: string;
  chains: { id: string; name: string }[];
  initiatives: { id: string; name: string }[];
};

type DataForm = {
  chain: string;
  network: string;
  address: string;
  initiativeId: string;
};

export default function WalletForm({ orgId, chains, initiatives }: WalletFormProps) {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('NEW WALLET');
  const [message, setMessage] = useState('Select chain and enter wallet address');

  const formMethods = useForm({
    defaultValues: {
      chain: 'Arbitrum',
      network: 'testnet',
      address: '',
      initiativeId: '',
    },
  });
  const { register, handleSubmit, reset } = formMethods;
  const [selectedChain, setSelectedChain] = useState('Arbitrum');
  const [selectedInitiative, setSelectedInitiative] = useState('');

  const onSubmit = async (form: DataForm) => {
    console.log('DATA', form);
    if (!selectedChain) {
      setMessage('Chain is required');
      return;
    }
    if (!form.address) {
      setMessage('Address is required');
      return;
    }
    try {
      const data = {
        chain: selectedChain as Chain,
        network: appConfig.chainDefaults.network || 'testnet',
        address: form.address,
        initiativeId: selectedInitiative,
      };
      console.log('DATA', data)
      setMessage('Saving wallet to database...');
      setButtonDisabled(true);
      setButtonText('WAIT');
      const result = await createWallet(orgId, data);
      if (result.success) {
        setMessage('Wallet saved');
        setButtonText('DONE');
        //setButtonDisabled(false);
        //reset();
        // You might want to add some logic here to refresh the list of wallets
        // Pass new wallet back to server page component
        // Or refresh server page component
        //revalidatePath('.');
        window.location.reload()
        //router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (ex) {
      console.error(ex);
      setMessage(`Error saving wallet: ${(ex as Error).message}`);
      setButtonText('NEW WALLET');
      setButtonDisabled(false);
    }
  };

  function handleChain(val: string) {
    console.log('CHAIN', val);
    setSelectedChain(val);
  }

  function handleInitiative(val: string) {
    console.log('INIT', val);
    setSelectedInitiative(val);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.vbox}>
      <Select
        label="Chain"
        {...register('chain')}
        options={chains}
        handler={handleChain}
      />
      <TextInput label="Address" {...register('address')} />
      <Select
        label="Initiative"
        {...register('initiativeId')}
        options={initiatives}
        handler={handleInitiative}
      />
      <p className="text-center text-gray-400">If you want this wallet attached to an initiative please select it from the dropdown</p>
      <ButtonBlue
        id="buttonSubmit"
        text={buttonText}
        disabled={buttonDisabled}
      />
      <p id="message" className="text-center">
        {message}
      </p>
    </form>
  );
}
