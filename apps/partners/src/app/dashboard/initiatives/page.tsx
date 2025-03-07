import { auth } from "@cfce/auth"
import {
  type Initiative,
  InitiativeStatus,
  getOrganizationById,
} from "@cfce/database"
import Link from "next/link"
import InitiativeCard from "~/components/InitiativeCard"
import InitiativeForm from "~/components/InitiativeForm"
import Title from "~/components/title"
import styles from "~/styles/dashboard.module.css"
import { FormMode, type InitiativeData } from "~/types/data"

export default async function Page() {
  const session = await auth()
  const orgId = session?.orgId || ""
  const organization = await getOrganizationById(orgId)
  const initiatives =
    organization?.initiative.map((it) => ({ ...it, organization })) || []
  const initiative: InitiativeData = {
    organizationId: orgId,
    title: "",
    description: "",
    start: new Date(),
    finish: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: InitiativeStatus.Draft,
  }

  // Define a mapping from string enum values to numbers
  const statusToNumber = {
    Draft: 0,
    Active: 1,
    Finished: 2,
    Archived: 3,
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
