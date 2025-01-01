'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import appConfig from '@cfce/app-config';
import type { Contract, Organization, Prisma } from '@cfce/database';
import ButtonBlue from '~/components/buttonblue';
import Title from '~/components/title';
import TextInput from '~/components/form/textinput'
import Select from '~/components/form/select'
import styles from '~/styles/dashboard.module.css';
import { apiFetch, apiPost } from '~/utils/api';
import chains from '~/chains';
import type { ChainSlugs } from "@cfce/types"

type OrganizationData = Prisma.OrganizationGetPayload<{ include: { initiative: true } }>

interface PageProps {
  chain: string;
  network: string;
  wallet?: string;
  organizationId?: string;
  organization?: OrganizationData | null;
}

interface FormProps {
  baseURI?: string
  initiativeId?: string
  name?: string
  symbol?: string
}

export default function NFTReceiptClient({
  chain,
  network,
  wallet,
  organizationId,
  organization,
}: PageProps) {
  const chainSlug = chain.toLowerCase()
  const config = appConfig.chains[chainSlug as ChainSlugs]
  if(!config){ throw new Error('Chain required but not found') }
  const contract_type = 'NFTReceipt'

  const [initiative, setInitiative] = useState(organization?.initiative[0].id||'')
  const [initialURI, setInitialURI] = useState(organization?.initiative[0].imageUri||'')

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
      name: 'Give Credits',
      symbol: 'GIVE',
      baseURI: initialURI,
      initiativeId: initiative
    }
  })

  const [
    name,
    symbol,
    baseURI,
    initiativeId
  ] = watch([
    'name',
    'symbol',
    'baseURI',
    'initiativeId'
  ])

  function listInitiatives() {
    if(!organization || organization.initiative?.length < 1){
      return [{id:'ALL', name:'All initiatives'}]
    }
    const list = organization.initiative?.map(it=>{ return { id: it.id, name: it.title } })
    console.log('LIST', list)
    return list
  }

  function selectInitiative(selected:string){
    console.log('SEL', selected)
    setInitiative(selected)
  }

  async function onSubmit(data: FormProps) {
    console.log('SUBMIT', data)
    showMessage('Not ready...')

    if (!chainSlug) {
      showMessage('Chain is required')
      return
    }
    if (!wallet) {
      showMessage('Wallet is required')
      return
    }
    try {
      showMessage('Deploying contract, please sign transaction...')
      setButtonState(ButtonState.WAIT)

      // DEPLOY
      const address = config?.contracts?.factory || ''
      console.log('CTR', address)
      const factory = chains[chain]
      console.log('FAC', factory)
      if(!factory){
        showMessage('Error deploying contract: Factory not found')
        setButtonState(ButtonState.READY)
        return
      }

      // This only works for Stellar, refactor and universalize
      const wasm_hash = config?.contracts?.receiptMintbotERC721Hash || ''
      const init_fn = 'init'
      const init_args = [ name, symbol ]
      const res = await factory.contracts.NFTReceipt.deploy({
        chain: chainSlug,
        network,
        name: data.name,
        symbol: data.symbol
      })
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
        chain: chainSlug,
        network,
        contract_type,
        contract_address: res?.contractId,
        start_block: res?.block,
        entity_id: data.initiativeId,
        admin_wallet_address: wallet
      }
      console.log('CTR', contract)
      const saved = await apiPost('contracts', contract)
      console.log('SAVED', saved)
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (ex:any) {
      console.error(ex)
      showMessage(`Error deploying contract: ${ex?.message}`)
      setButtonState(ButtonState.READY)
    }
  }

  return (
    <div className={styles.vbox}>
      <Title text="NFT Receipt Contract" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row justify-center w-[640px] mx-auto">
          <div className="w-full">
            <Select
              label="Initiative"
              register={register('initiativeId')}
              options={listInitiatives()}
              handler={selectInitiative}
            />
            <TextInput label="Name" register={register('name')} />
            <TextInput label="Symbol" register={register('symbol')} />
            <TextInput label="Image URI" id="baseURI" register={register('baseURI')} />
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
