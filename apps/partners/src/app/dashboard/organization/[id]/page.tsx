import { getCategories, getOrganizationById } from '@cfce/database'
import Title from '~/components/title'
import styles from '~/styles/dashboard.module.css'
import OrganizationForm from '~/components/OrganizationForm'
import { FormMode, type OrganizationData } from '../types'
import { sortCategories } from '~/utils/data'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  try {
    const { id } = await params
    const data = await getOrganizationById(id, false) // No sub-models
    if (!data) {
      throw new Error(`Organization not found: ${id}`)
    }
    const organization = JSON.parse(JSON.stringify(data))
    const list = await getCategories({})
    const categories = sortCategories(list)

    return (
      <div className={styles.mainBox}>
        <Title text="Edit Organization" />
        <OrganizationForm id={id} organization={organization} categories={categories} formMode={FormMode.Edit} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch organization:', error)
    throw error
  }
}
