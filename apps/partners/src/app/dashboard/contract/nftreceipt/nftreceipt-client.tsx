"use client"

import appConfig from "@cfce/app-config"
import type { Contract, Organization, Prisma } from "@cfce/database"
import type { Chain } from "@cfce/database"
import type { ChainSlugs } from "@cfce/types"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import factoryDeployers from "~/chains"
import ButtonBlue from "~/components/buttonblue"
import Select from "~/components/form/select"
import TextInput from "~/components/form/textinput"
import Title from "~/components/title"
import styles from "~/styles/dashboard.module.css"
import { apiFetch, apiPost } from "~/utils/api"

type OrganizationData = Prisma.OrganizationGetPayload<{
  include: { initiative: true }
}>

interface PageProps {
  chain: string
  network: string
  organization?: OrganizationData | null
  organizationId?: string
  wallet?: string
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
  organization,
  organizationId,
  wallet,
}: PageProps) {
  console.log("CHAIN", chain)
  const contract_type = "NFTReceipt"
  const chainSlug = chain.toLowerCase() as ChainSlugs
  const appChainConfig = appConfig.chains[chainSlug]
  if (!appChainConfig) {
    throw new Error("Chain required but not found")
  }

  const [initiative, setInitiative] = useState(
    organization?.initiative[0].id || "",
  )
  const [initialURI, setInitialURI] = useState(
    organization?.initiative[0].imageUri || "",
  )

  const [buttonText, setButtonText] = useState("NEW CONTRACT")
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [message, showMessage] = useState("Enter contract options")
  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 }

  function setButtonState(state: number) {
    switch (state) {
      case ButtonState.READY:
        setButtonText("NEW CONTRACT")
        setButtonDisabled(false)
        break
      case ButtonState.WAIT:
        setButtonText("WAIT")
        setButtonDisabled(true)
        break
      case ButtonState.DONE:
        setButtonText("DONE")
        setButtonDisabled(true)
        break
    }
  }

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      name: "Give Credits",
      symbol: "GIVE",
      baseURI: initialURI,
      initiativeId: initiative,
    },
  })

  const [name, symbol, baseURI, initiativeId] = watch([
    "name",
    "symbol",
    "baseURI",
    "initiativeId",
  ])

  function listInitiatives() {
    if (!organization || organization.initiative?.length < 1) {
      return [{ id: "ALL", name: "All initiatives" }]
    }
    const list = organization.initiative?.map((it) => {
      return { id: it.id, name: it.title }
    })
    console.log("LIST", list)
    return list
  }

  function selectInitiative(selected: string) {
    console.log("SEL", selected)
    setInitiative(selected)
  }

  async function onSubmit(data: FormProps) {
    console.log("SUBMIT", data)
    showMessage("Not ready...")

    if (!chain) {
      showMessage("Chain is required")
      return
    }
    if (!wallet) {
      showMessage("Wallet is required")
      return
    }
    try {
      showMessage("Deploying contract, please sign transaction...")
      setButtonState(ButtonState.WAIT)

      // DEPLOY
      const address = appChainConfig?.contracts?.receiptFactory || ""
      console.log("CTR", address)
      const factory = factoryDeployers[chainSlug]
      console.log("FAC", factory)
      if (!factory) {
        showMessage("Error deploying contract: Factory not found")
        setButtonState(ButtonState.READY)
        return
      }

      // This only works for Stellar, refactor and universalize
      const wasm_hash = appChainConfig?.contracts?.Receipt_NFTHash || ""
      const init_fn = "initialize"
      const init_args = [name, symbol]
      const res = await factory.NFTReceipt.deploy({
        chain: chain.toLowerCase(),
        network,
        name: data.name,
        symbol: data.symbol,
      })
      console.log("RES", res)
      if (!res || res?.error) {
        showMessage(`Error deploying contract: ${res?.error || "Unknown"}`)
        setButtonState(ButtonState.READY)
        return
      }
      showMessage("Contract deployed successfully")
      setButtonState(ButtonState.READY)
      // Save to db contracts
      const contract = {
        chain: chain.toLowerCase(),
        network,
        contract_type,
        contract_address: res?.contractId,
        start_block: res?.block,
        entity_id: data.initiativeId,
        admin_wallet_address: wallet,
      }
      console.log("CTR", contract)
      const saved = await apiPost("contracts", contract)
      console.log("SAVED", saved)
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (ex: any) {
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
              {...register("initiativeId")}
              options={listInitiatives()}
              handler={selectInitiative}
            />
            <TextInput label="Name" {...register("name")} />
            <TextInput label="Symbol" {...register("symbol")} />
            <TextInput label="Image URI" {...register("baseURI")} />
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
  )
}
