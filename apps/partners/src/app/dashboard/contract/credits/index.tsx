import Dashboard from '~/components/dashboard'
import Sidebar from '~/components/sidebar'
import ContractCredits from '~/components/contract-credits'
import styles from '~/styles/dashboard.module.css'

export async function getServerSideProps(context) {
  console.log('QUERY', context.query)
  const { chain, network, wallet, organizationId } = context.query
  return { props: { chain, network, wallet, organizationId } }
}

export default function Page(props) {
  const { chain, network, wallet, organizationId } = props

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.mainBox}>
          <ContractCredits chain={chain} network={network} wallet={wallet} organizationId={organizationId} />
        </div>
      </div>
    </Dashboard>
  )
}
