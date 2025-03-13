"use client"
import { chainConfig } from "@cfce/app-config"
import type { Contract, OrganizationData } from "@cfce/database"
import type { ChainSlugs } from "@cfce/types"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { type FieldValues, useForm } from "react-hook-form"
import ButtonBlue from "~/components/buttonblue"
import ContractView from "~/components/contract"
import Select from "~/components/form/select"
import LinkButton from "~/components/linkbutton"
import Title from "~/components/title"
import styles from "~/styles/dashboard.module.css"

interface PageProps {
  organization: OrganizationData
  allContracts: Contract[]
  initialChain: string
  network: string
}

interface FormProps extends FieldValues {
  chain: string
  contract_type: string
  wallet: string
}

export default function Page({
  organization,
  allContracts,
  initialChain,
  network,
}: PageProps) {
  function listWallets(chain: string, network: string) {
    const wallets = organization?.wallets?.filter(
      (it) =>
        it?.chain.toLowerCase() === chain.toLowerCase() &&
        it?.network === network,
    )
    const list = wallets?.map((it) => {
      return { id: it.address, name: it.address }
    })
    return list
  }

  function listContracts() {
    return [
      //{ id: '721',     name: '721' },
      //{ id: '1155',    name: '1155' },
      { id: "Credits", name: "Credits" },
      { id: "NFTReceipt", name: "NFTReceipt" },
      //{ id: 'V2E',     name: 'V2E' },
    ]
  }

  function listInitiatives() {
    const list = organization?.initiative.map((it) => {
      return { id: it.tag, name: it.title }
    })
    return list
  }

  function listChains() {
    const list = (Object.keys(chainConfig) as ChainSlugs[]).map((chain) => ({
      id: chainConfig[chain].slug,
      name: chainConfig[chain].name,
    }))
    //console.log("CHAINS", list)
    //setChains(list)
    return list
  }

  function selectChain(value: string) {
    console.log("CHAIN", value)
    setSelectedChain(value)
    const wallets = listWallets(value, network)
    setWallets(wallets)
    setSelectedWallet(wallets.length > 0 ? wallets[0].id : "")
    console.log("W>", wallets.length > 0 ? wallets[0].id : "")
  }

  function selectWallet(value: string) {
    setSelectedWallet(value)
    //console.log('WALLET', value)
  }

  function selectContract(value: string) {
    setSelectedContract(value)
  }

  async function onSubmit(data: FormProps) {
    // For some reason, form data is not being passed correctly
    // Every time the view is refreshed it gets reset to default
    // While selectedWallet retains its value, so we'll use it
    console.log("FORM", data)
    const url = `/dashboard/contract/${data.contract_type.toLowerCase()}?chain=${data.chain}&network=${network}&wallet=${selectedWallet}&organizationId=${organization.id}`
    console.log("URL", url)
    redirect(url)
  }

  const chains = listChains()
  const initialWallets = listWallets(initialChain, network)
  const contracts = listContracts()
  const initialWallet = initialWallets?.[0]?.id
  const initialContract = "Credits" // TODO: get from config
  const [wallets, setWallets] = useState(initialWallets)
  const [selectedChain, setSelectedChain] = useState(initialChain.toLowerCase())
  const [selectedWallet, setSelectedWallet] = useState(initialWallet)
  const [selectedContract, setSelectedContract] = useState(initialContract)

  //console.log("REFRESH")
  //console.log("wallets", organization?.wallets)
  console.log("chain", initialChain)
  console.log("wallet", initialWallet)
  console.log("contract", initialContract)

  const [change, setChange] = useState(0)
  //const { register, handleSubmit, watch } = useForm({})
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      chain: initialChain.toLowerCase(),
      wallet: initialWallet,
      contract_type: initialContract,
    },
  })
  const [chain, wallet, contract_type] = watch([
    "chain",
    "wallet",
    "contract_type",
  ])

  return (
    <div className={styles.content}>
      <Title text="Smart Contracts" />
      <div className={styles.mainBox}>
        <form className={styles.vbox}>
          <Select
            label="Chain"
            {...register("chain")}
            options={chains}
            handler={selectChain}
            value={selectedChain}
          />
          <Select
            label="Wallet"
            {...register("wallet")}
            options={wallets}
            handler={selectWallet}
            value={selectedWallet}
          />
          <Select
            label="Contract Type"
            {...register("contract_type")}
            options={contracts}
            handler={selectContract}
            value={selectedContract}
          />
        </form>
        <ButtonBlue
          text="CLICK TO START"
          onClick={() =>
            onSubmit({
              chain: selectedChain,
              wallet: selectedWallet,
              contract_type: selectedContract,
            })
          }
        />
      </div>
      {allContracts &&
      allContracts.constructor === Array &&
      allContracts.length > 0 ? (
        allContracts.map((item) => (
          <div className={styles.mainBox} key={item.id}>
            <ContractView {...JSON.parse(JSON.stringify(item))} />
          </div>
        ))
      ) : (
        <h1 className="text-center text-2xl my-24">No contracts found</h1>
      )}
    </div>
  )
}
