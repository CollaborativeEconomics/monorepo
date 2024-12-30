'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import appConfig from '@cfce/app-config';
import type { Contract } from '@cfce/database';
import ButtonBlue from '~/components/buttonblue';
import Title from '~/components/title';
import TextInput from '~/components/form/textinput'
import styles from '~/styles/dashboard.module.css';
import { apiFetch } from '~/utils/api';
import chains from '~/chains';

interface PageProps {
  chain?: string;
  network?: string;
  wallet?: string;
  organizationId?: string;
}

interface FormProps {
  bucket?: string
  chain?: string
  minimum?: string
  provider?: string
  provider_fees?: string
  vendor?: string
  vendor_fees?: string
  wallet?: string
}

export default function ContractCreditsClient({
  organizationId,
  chain,
  network,
  wallet,
}: PageProps) {
  const contract_type = 'Credits'

  // TODO: Componentize button state
  const [buttonText, setButtonText] = useState('NEW CONTRACT')
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [message, showMessage] = useState('Enter contract options')
  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 }
  
  function setButtonState(state:number) {
    switch (state) {
      case ButtonState.READY:
        setButtonText('NEW CONTRACT')
        setButtonDisabled(false)
        break
      case ButtonState.WAIT:
        setButtonText('WAIT')
        setButtonDisabled(true)
        break
      case ButtonState.DONE:
        setButtonText('DONE')
        setButtonDisabled(true)
        break
    }
  }

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      chain: chain,
      wallet: wallet,
      vendor: '',
      vendor_fees: '90',
      provider: '',
      provider_fees: '10',
      minimum: '1',
      bucket: '20'
    }
  })
  const [
    vendor,
    vendor_fees,
    provider,
    provider_fees,
    minimum,
    bucket
  ] = watch([
    'vendor',
    'vendor_fees',
    'provider',
    'provider_fees',
    'minimum',
    'bucket'
  ])


  async function onSubmit(data: FormProps) {
    console.log('SUBMIT', data)

    if (!data.chain) {
      showMessage('Chain is required')
      return
    }
    if (!data.wallet) {
      showMessage('Wallet is required')
      return
    }

    //showMessage('Not ready...')

    try {
      showMessage('Deploying contract, please sign transaction...')
      setButtonState(ButtonState.WAIT)

      // DEPLOY
      // TODO: get args from form component
      const address = appConfig.chains[chain]?.contracts.factory
      console.log('CTR', address)
      if(!address){
        showMessage('Error deploying contract: Contract not found')
        setButtonState(ButtonState.READY)
        return
      }
      const factory = chains[chain]
      if(!factory){
        showMessage('Error deploying contract: Factory not found')
        setButtonState(ButtonState.READY)
        return
      }
      // This works for Stellar only, refactor and universalize
      const owner = ''
      const deployer = ''
      const wasm_hash = ''
      const salt = ''
      const init_fn = ''
      const init_args = []
      const res = await factory.deploy(network, address, owner, deployer, wasm_hash, salt, init_fn, init_args)

      console.log('RES', res)
      if(!res || res?.error){
        showMessage(`Error deploying contract: ${res?.error||'Unknown'}`)
        setButtonState(ButtonState.READY)
        return
      }
      showMessage('Contract deployed successfully')
      setButtonState(ButtonState.READY)
      // Save to db contracts
      const contract = {
        chain,
        network,
        contract_type,
        contract_address: res?.contractId,
        start_block: res?.block,
        entity_id: organizationId,
        admin_wallet_address: wallet
      }
      console.log('CTR', contract)
      const saved = await apiPost('contracts', contract)
      console.log('SAVED', saved)
    } catch (ex) {
      console.error(ex)
      showMessage(`Error deploying contract: ${ex.message}`)
      setButtonState(ButtonState.READY)
    }

  }


  return (
    <div className={styles.vbox}>
      <Title text="Credits Contract" />
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* PAGER */}
        <div className="flex flex-row justify-center w-[640px] mx-auto">
          {/* PAGE */}
          <div className="w-full">
            <TextInput label="Credit Vendor (Wallet address)" register={register('vendor')} />
            <TextInput label="Vendor Fees (percentage)" register={register('vendor_fees')} />
            <TextInput label="Credit Provider (Wallet address)" register={register('provider')} />
            <TextInput label="Provider Fees (percentage)" register={register('provider_fees')} />
            <TextInput label="Bucket Size" register={register('bucket')} />
            <TextInput label="Minimum Donation" register={register('minimum')} />
          </div>
        </div>
        <ButtonBlue
          id="buttonSubmit"
          text={buttonText}
          disabled={buttonDisabled}
        />
      </form>
      <p id="message" className="text-center">
        {message}
      </p>
    </div>
  );
}
