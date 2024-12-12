/* TODO:
 - componentize each form by contract type
 - return contract arguments from form input
*/

'use client'
import { auth } from '@cfce/auth';
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Dashboard from '~/components/dashboard'
import Sidebar from '~/components/sidebar'
import Title from '~/components/title'
import Select from '~/components/form/select'
import LinkButton from '~/components/linkbutton'
import Contract from '~/components/contract'
import styles from '~/styles/dashboard.module.css'
import { chainConfig } from '@cfce/blockchain-tools';
import { registryApi } from '@cfce/utils';
import { getOrganizationById, getContracts } from '~/actions/database'
import type { ChainSlugs } from '@cfce/types';

// TODO: we should put all this methods in one huge registry script like in old times not to guess how they are constructed
//async function getOrganizationById(id:string){
//  const result = await registryApi.get<Organization>(`/organizations/${id}`)
//  console.log('ORG', result)
//  return result
//}
//
//async function getContractsByOrganization(id, chain, network){
//  const result = await registryApi.get<User>(`/contracts?entity_id=${id}&chain=${chain}&network=${network}`)
//  console.log('CTRS', result)
//  return result
//}

export default async function Page() {

  //function filterWallets(wallets, chain, network) {
  //  console.log(chain, network)
  //  const list = wallets?.filter(it=>it?.chain===chain)
  //  //const list = wallets?.filter(it=>(it?.chain==chain && it?.network==network))
  //  return list
  //}

  function listWallets(chain:string, network:string) {
    //const wallets = filterWallets(organization?.wallets, chain, network)
    const wallets = organization?.wallets?.filter(it=>it?.chain===chain) // filter wallets by chain
    const list = wallets?.map(it=>{ return {id:it.address, name:it.address} })
    return list
  }

  function listContracts() {
    return [
      //{ id: '721',     name: '721' },
      //{ id: '1155',    name: '1155' },
      { id: 'Credits', name: 'Credits' },
      { id: 'NFTReceipt', name: 'NFTReceipt' },
      //{ id: 'V2E',     name: 'V2E' },
    ]
  }

  //function listChains() {
  //  const list = chains.map(it=>{ return { id: it, name: it } })
  //  return list
  //}

  function listInitiatives() {
    const list = organization?.initiative.map(it=>{ return { id: it.tag, name: it.title } })
    return list
  }

  //function selectContract(contract:event){
  //  console.log('SEL', contract)
  //}


  const session = await auth();
  const orgId = session?.orgId ?? '';
  const organization = await getOrganizationById(orgId)
  const initialChain = 'Arbitrum' // TODO: Get from config
  const network = 'testnet' // TODO: Get from config
  const dataContracts = await getContracts({entity_id:orgId, chain:initialChain, network})
  const contracts = JSON.parse(JSON.stringify(dataContracts))
  //console.log('Org', organization)
  //console.log('Ctr', contracts)
  const chains = (Object.keys(chainConfig) as ChainSlugs[]).map(chain => ({
    id: chainConfig[chain].slug,
    name: chainConfig[chain].name,
  }));

  const initialWallets = listWallets(initialChain, network)  
  console.log('WALLETS', initialWallets)
  const initialWallet = initialWallets?.[0]?.id
  const initialContract = 'Credits' // TODO: get from config
  //const [wallets, setWallets] = useState(initialWallets)
  const wallets = initialWallets
  console.log('wallets', organization?.wallets)
  console.log('wallet', initialWallet)
  console.log('contract', initialContract)

  const [ change, setChange ] = useState(0)
  const { register, watch } = useForm({
    defaultValues: {
      chain: initialChain,
      wallet: initialWallet,
      contract_type: initialContract
    }
  })
  const [
    chain,
    wallet,
    contract_type,
  ] = watch([
    'chain',
    'wallet',
    'contract_type',
  ])

  const url = `/dashboard/contract/${contract_type.toLowerCase()}?chain=${chain}&network=${network}&wallet=${wallet}&organizationId=${orgId}`
  console.log('URL', url)

  // Used to refresh list of wallets after new record added
  //useEffect(()=>{
  //  console.log('Wallets changed!', change)
  //},[change])

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="Smart Contracts" />
        <div className={styles.mainBox}>
          <form className={styles.vbox}>
            <Select
              label="Chain"
              register={register('chain')}
              options={chains}
            />
            <Select
              label="Wallet"
              register={register('wallet')}
              options={listWallets(chain, network)}
            />
            <Select
              label="Contract Type"
              register={register('contract_type')}
              options={listContracts()}
            />
          </form>
        </div>

        <LinkButton href={url} className="mb-12" text="CLICK TO START" />
        { (contracts && contracts.constructor === Array) ? contracts.map((item) => (
          <div className={styles.mainBox} key={item.id}>
            <Contract key={item.id} {...item} />
          </div>
        )) : (
          <h1 className="text-center text-2xl my-24">No contracts found</h1>
        )}
      </div>
    </Dashboard>
  )
}
