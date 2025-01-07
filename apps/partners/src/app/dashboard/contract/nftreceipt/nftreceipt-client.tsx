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
import { apiFetch } from '~/utils/api';

type OrganizationData = Prisma.OrganizationGetPayload<{ include: { initiative: true } }>

interface PageProps {
  chain?: string;
  network?: string;
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
    // TODO: finish it
  }

              //onChange={selectInitiative}
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
