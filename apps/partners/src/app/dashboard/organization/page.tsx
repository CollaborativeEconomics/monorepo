import { getCategories } from "@cfce/database"
import React from "react"
import Title from "~/components/title"
import styles from "~/styles/dashboard.module.css"
import AddOrganizationForm from "./AddOrganizationForm"

export default async function Page() {
  const categories = await getCategories({})
  const list = categories.map((it) => {
    return { id: it.id, name: it.title }
  })
  //console.log('CATS', list)

  return (
    <div className={styles.content}>
      <Title text="New Organization" />
      <AddOrganizationForm categories={list} />
    </div>
  )
}
