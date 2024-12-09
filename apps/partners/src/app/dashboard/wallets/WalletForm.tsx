'use client';

import type { Chain } from '@cfce/database';
import type { ChainSlugs } from '@cfce/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonBlue from '~/components/buttonblue';
import Select from '~/components/form/select';
import TextInput from '~/components/form/textinput';
import styles from '~/styles/dashboard.module.css';
import { createWallet } from './actions';

type WalletFormProps = {
  orgId: string;
  chains: { id: ChainSlugs; name: Chain }[];
};

export default function WalletForm({ orgId, chains }: WalletFormProps) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('NEW WALLET');
  const [message, setMessage] = useState(
    'Select chain and enter wallet address',
  );

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      chain: 'XRPL' as Chain,
      address: '',
    },
  });

  const onSubmit = async (data: { chain: Chain; address: string }) => {
    if (!data.chain) {
      setMessage('Chain is required');
      return;
    }
    if (!data.address) {
      setMessage('Address is required');
      return;
    }
    try {
      setMessage('Saving wallet to database...');
      setButtonDisabled(true);
      setButtonText('WAIT');
      const result = await createWallet(orgId, data);
      if (result.success) {
        setMessage('Wallet saved');
        setButtonText('DONE');
        reset();
        // You might want to add some logic here to refresh the list of wallets
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.vbox}>
      <Select label="Chain" register={register('chain')} options={chains} />
      <TextInput label="Address" register={register('address')} />
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
