import { getOrganizationById, getWallets, newWallet } from '@cfce/database';
import { type JWT, getToken } from 'next-auth/jwt';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonBlue from '~/components/buttonblue';
import Dashboard from '~/components/dashboard';
import Select from '~/components/form/select';
import TextInput from '~/components/form/textinput';
import Sidebar from '~/components/sidebar';
import Title from '~/components/title';
import Wallet from '~/components/wallet';
import styles from '~/styles/dashboard.module.css';

export async function getServerSideProps({ req, res }) {
  const token: JWT = await getToken({ req });
  const orgId = (token?.orgId as string) || '';
  const organization = await getOrganizationById(orgId);
  return { props: { organization } };
}

export default function Page({ organization }) {
  const orgId = organization?.id || '';
  const wallets = organization?.wallets || [];

  function listChains() {
    return [
      { id: 'Avalanche', name: 'Avalanche - AVAX' },
      { id: 'Binance', name: 'Binance - BNB' },
      { id: 'Celo', name: 'Celo - CELO' },
      { id: 'EOS', name: 'EOS - EOS' },
      { id: 'Ethereum', name: 'Ethereum - ETH' },
      { id: 'Filecoin', name: 'Filecoin - FIL' },
      { id: 'Flare', name: 'Flare - FLR' },
      { id: 'Optimism', name: 'Optimism - OP' },
      { id: 'Polygon', name: 'Polygon - MATIC' },
      { id: 'PublicGoods', name: 'PublicGoods - PGN' },
      { id: 'XRPL', name: 'Ripple - XRP' },
      { id: 'Stellar', name: 'Stellar - XLM' },
      { id: 'XinFin', name: 'XinFin - XDC' },
    ];
  }

  async function onSubmit(data) {
    console.log('SUBMIT', data);
    if (!data.chain) {
      showMessage('Chain is required');
      return;
    }
    if (!data.address) {
      showMessage('Address is required');
      return;
    }
    try {
      showMessage('Saving wallet to database...');
      setButtonState(ButtonState.WAIT);
      const wallet = await newWallet({ organizationId: orgId, ...data });
      if (Array.isArray(wallet) && wallet.length) {
        wallets.push(...wallet);
        setChange(change + 1);
        showMessage('Wallet saved');
        setButtonState(ButtonState.DONE);
      }
    } catch (ex) {
      console.error(ex);
      showMessage(`Error saving wallet: ${ex.message}`);
      setButtonState(ButtonState.READY);
    }
  }

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 };

  function setButtonState(state) {
    switch (state) {
      case ButtonState.READY:
        setButtonText('SUBMIT');
        setButtonDisabled(false);
        break;
      case ButtonState.WAIT:
        setButtonText('WAIT');
        setButtonDisabled(true);
        break;
      case ButtonState.DONE:
        setButtonText('DONE');
        setButtonDisabled(true);
        break;
    }
  }

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('NEW WALLET');
  const [message, showMessage] = useState(
    'Select chain and enter wallet address',
  );
  const [change, setChange] = useState(0);
  const { register, watch } = useForm({
    defaultValues: {
      chain: 'XRPL',
      address: '',
    },
  });
  const [chain, address] = watch(['chain', 'address']);

  // Used to refresh list of wallets after new record added
  useEffect(() => {
    console.log('Wallets changed!', change);
  }, [change]);

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="Wallets" />
        <p className={styles.intro}>
          Enter crypto wallets you’d like to accept donations through. Wallets
          connected to your account will be verified for approval
        </p>
        <div className={styles.mainBox}>
          <form className={styles.vbox}>
            <Select
              label="Chain"
              register={register('chain')}
              options={listChains()}
            />
            <TextInput label="Address" register={register('address')} />
          </form>
          <ButtonBlue
            id="buttonSubmit"
            text={buttonText}
            disabled={buttonDisabled}
            onClick={() =>
              onSubmit({
                chain,
                address,
              })
            }
          />
          <p id="message" className="text-center">
            {message}
          </p>
        </div>
        {wallets ? (
          wallets.map(item => (
            <div className={styles.mainBox} key={item.id}>
              <Wallet key={item.id} {...item} />
            </div>
          ))
        ) : (
          <h1 className="text-center text-2xl my-24">No wallets found</h1>
        )}
      </div>
    </Dashboard>
  );
}
