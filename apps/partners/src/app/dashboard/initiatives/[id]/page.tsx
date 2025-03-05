import { type Initiative, getInitiativeById } from "@cfce/database"
import Title from "~/components/title"
import styles from "~/styles/dashboard.module.css"
import InitiativeForm from "~/components/InitiativeForm"
import { FormMode, type InitiativeData } from '~/types/data'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const data = await getInitiativeById(id)
  if (!data) {
    throw new Error(`Initiative not found: ${id}`)
  }
  const initiative = JSON.parse(JSON.stringify(data))

  return (
    <div className={styles.mainBox}>
      <Title text="Edit Initiative" />
      <InitiativeForm id={id} initiative={initiative} formMode={FormMode.Edit} />
    </div>
  )
}
