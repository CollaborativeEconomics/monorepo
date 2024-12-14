/* TODO:
 - componentize each form by contract type
 - return contract arguments from form input
*/

import { Suspense } from 'react';
import { auth } from '@cfce/auth';
import { chainConfig } from '@cfce/blockchain-tools';
import { getOrganizationById, getContracts } from '~/actions/database'
//import Dashboard from '~/components/dashboard'
//import Sidebar from '~/components/sidebar'
import ContractsClient from './contracts-client';

export default async function Page() {
  const chain = 'Arbitrum'  // TODO: Get from config
  const network = 'testnet' // TODO: Get from config
  const session = await auth();
  const orgId = session?.orgId ?? '';
  const organizationData = await getOrganizationById(orgId)
  const organization = JSON.parse(JSON.stringify(organizationData))
  const contractsData = await getContracts({entity_id:orgId, chain, network})
  const contracts = JSON.parse(JSON.stringify(contractsData))
  console.log('Org', organization?.name)
  console.log('Ctr', contracts?.length)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContractsClient organization={organization} contracts={contracts} initialChain={chain} network={network} />
    </Suspense>
  )
}
