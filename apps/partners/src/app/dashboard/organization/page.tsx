import { getCategories } from '@cfce/database';
import React from 'react';
import AddOrganizationForm from '~/components/AddOrganizationForm';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';

export default async function Page() {
  const categories = await getCategories({});

  return (
    <div className={styles.content}>
      <Title text="New Organization" />
      <AddOrganizationForm categories={categories} />
    </div>
  );
}
