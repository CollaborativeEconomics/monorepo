/* TODO:
 - componentize each form by contract type
 - return contract arguments from form input
*/

import appConfig from "@cfce/app-config"
import { auth } from "@cfce/auth"
import { Suspense } from "react"
import { getContracts, getOrganizationById } from "~/actions/database"
import ContractsClient from "./contracts-client"
import { verifyOrgAccess } from '~/utils/verifyOrgAccess';

interface PageProps {
  params: { orgId: string };
}

export default async function Page({ params }: PageProps) {
  const chain = "Stellar" // TODO: Get from config but for now start with Stellar
  const network = appConfig.chainDefaults.network
  const session = await auth();
  if (!session || !session.user || !params?.orgId || typeof session.user.id !== 'string') {
    return null;
  }
  await verifyOrgAccess(session.user.id as string, params.orgId, !!session.isAdmin);
  const organizationData = await getOrganizationById(params.orgId)
  const organization = JSON.parse(JSON.stringify(organizationData))
  const contractsData = await getContracts({
    entity_id: params.orgId,
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
