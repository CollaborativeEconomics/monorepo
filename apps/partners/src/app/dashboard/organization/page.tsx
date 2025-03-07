import { getCategories } from '@cfce/database'
import Title from '~/components/title'
import styles from '~/styles/dashboard.module.css'
import OrganizationForm from '~/components/OrganizationForm'
import { FormMode, type OrganizationData } from '~/types/data'
import { sortCategories } from '~/utils/data'

export default async function Page() {
  try {
    const organization:OrganizationData = {
      name:'',
      description:'',
      email:''
    }
    const list = await getCategories({})
    const categories = sortCategories(list)

    return (
      <div className={styles.mainBox}>
        <Title text="New Organization" />
        <OrganizationForm organization={organization} categories={categories} formMode={FormMode.New} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch organization:', error)
    throw error
  }
}
