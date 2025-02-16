import { auth } from "@cfce/auth"
import Link from "next/link"
import { type Initiative, getOrganizationById } from "@cfce/database"
import styles from "~/styles/dashboard.module.css"
import Title from "~/components/title"
import InitiativeForm from "./InitiativeForm"
import InitiativeCard from "~/components/InitiativeCard"

export default async function Page() {
  const session = await auth()
  const orgId = session?.orgId || ""

  const organization = await getOrganizationById(orgId)

  const initiatives =
    organization?.initiative.map((i) => ({ ...i, organization })) || []

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
        <InitiativeForm orgId={orgId} />
      </div>
      {initiatives.length > 0 ? (
        initiatives.map((item: Initiative) => (
          <div className={styles.mainBox} key={item.id}>
            <Link href={`/dashboard/initiatives/${item.id}`}>
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
