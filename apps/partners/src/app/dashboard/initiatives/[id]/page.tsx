import { auth } from "@cfce/auth"
import { type Initiative, getInitiativeById } from "@cfce/database"
import Title from "~/components/title"
import InitiativeEdit from "./InitiativeEdit"
import styles from "~/styles/dashboard.module.css"

interface PageProps {
  params: Promise<{ id: string }>;
  //searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const data = await getInitiativeById(id)
  const initiative = JSON.parse(JSON.stringify(data))

  return (
    <div className={styles.content}>
      <Title text="Edit Initiative" />
      <div className={styles.mainBox}>
        <InitiativeEdit initiative={initiative} />
      </div>
    </div>
  )
}
