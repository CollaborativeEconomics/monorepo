import { auth } from "@cfce/auth"
import Link from "next/link"
import { type Initiative, InitiativeStatus, getOrganizationById } from "@cfce/database"
import styles from "~/styles/dashboard.module.css"
import Title from "~/components/title"
import InitiativeForm from "~/components/InitiativeForm"
import InitiativeCard from "~/components/InitiativeCard"
import { type InitiativeData, FormMode } from '~/types/data'

export default async function Page() {
  const session = await auth()
  const orgId = session?.orgId || ""
  const organization = await getOrganizationById(orgId)
  const initiatives = organization?.initiative.map((it) => ({ ...it, organization })) || []
  const initiative:InitiativeData = {
    organizationId: orgId,
    title: '',
    description: '',
    start: new Date(),
    finish: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: InitiativeStatus.Draft,
  }

  return (
    <div>
      <Title text="Create a Funding Initiative" />
      <p className={styles.intro}>
        Creating an initiative allows donors to contribute to a specific
        campaign. This helps get your donors excited about the impact they can
        make, and helps them visualize how they&apos;ll make the world a better
        place!
      </p>
      <div className={styles.mainBox}>
        <InitiativeForm initiative={initiative} formMode={FormMode.New} />
      </div>
      {initiatives.length > 0 ? (
        initiatives.map((item: Initiative) => (
          <div className={styles.cardBox} key={item.id}>
            <Link href={`/dashboard/initiatives/${item.id}`} className="w-full">
              <InitiativeCard key={item.id} {...item} />
            </Link>
          </div>
        ))
      ) : (
        <h1 className="text-center text-2xl my-24">No initiatives found</h1>
      )}
    </div>
  )
}
