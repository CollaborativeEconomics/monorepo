/* TODO:
 - componentize each form by contract type
 - return contract arguments from form input
*/

import appConfig from "@cfce/app-config"
import { auth } from "@cfce/auth"
import { Suspense } from "react"
import { getContracts, getOrganizationById } from "~/actions/database"
import ContractsClient from "./contracts-client"

export default async function Page() {
  const chain = "Stellar" // TODO: Get from config but for now start with Stellar
  const network = appConfig.chainDefaults.network
  const session = await auth()
  const orgId = session?.orgId ?? ""
  const organizationData = await getOrganizationById(orgId)
  const organization = JSON.parse(JSON.stringify(organizationData))
  const contractsData = await getContracts({
    entity_id: orgId,
    chain,
    network,
  })
  const contracts = JSON.parse(JSON.stringify(contractsData))
  console.log("Org", organization?.name)
  console.log("Ctr", contracts?.length)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContractsClient
        organization={organization}
        allContracts={contracts}
        initialChain={chain}
        network={network}
      />
    </Suspense>
  )
}
