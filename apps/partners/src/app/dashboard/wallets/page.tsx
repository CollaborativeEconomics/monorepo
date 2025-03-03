import { chainConfig } from "@cfce/app-config"
import { auth } from "@cfce/auth"
import { getOrganizationById } from "@cfce/database"
import type { ChainSlugs } from "@cfce/types"
import Title from "~/components/title"
import Wallet from "~/components/wallet"
import styles from "~/styles/dashboard.module.css"
import WalletForm from "./WalletForm"

async function getWalletData(orgId: string) {
  const organization = await getOrganizationById(orgId)
  if (!organization) { throw new Error("Organization not found") }
  //console.log('ORG', organization)
  const data = organization.wallets || []
  const wallets = data.sort((a, b) => a.chain.localeCompare(b.chain)) // sort by chain
  const list = organization.initiative
  const initiatives = list.map(it=>{ return {id:it.id, name:it.title} })
  return { organization, initiatives, wallets }
}

export default async function WalletsPage() {
  const session = await auth()
  const orgId = session?.orgId as string
  if (!orgId) throw new Error("Not authorized")

  const { organization, initiatives, wallets } = await getWalletData(orgId)
  const chainsList = (Object.keys(chainConfig) as ChainSlugs[]).map(
    (chain) => ({
      id: chainConfig[chain].name,
      name: chainConfig[chain].name,
    }),
  )

  return (
    <div>
      <Title text="Wallets" />
      <p className={styles.intro}>
        Enter crypto wallets you&apos;d like to accept donations through.
        Wallets connected to your account will be verified for approval
      </p>
      <div className={styles.mainBox}>
        <WalletForm orgId={orgId} chains={chainsList} initiatives={initiatives} />
      </div>
      {wallets.length > 0 ? (
        wallets.map((item) => (
          <div className={styles.mainBox} key={item.id}>
            <Wallet {...item} />
          </div>
        ))
      ) : (
        <h1 className="text-center text-2xl my-24">No wallets found</h1>
      )}
    </div>
  )
}
