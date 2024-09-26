import { getCategories } from '@cfce/database';
import React from 'react';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';
import AddOrganizationForm from './AddOrganizationForm';

export default async function Page() {
  const categories = await getCategories({});

  return (
    <div className={styles.content}>
      <Title text="New Organization" />
      <AddOrganizationForm categories={categories} />
    </div>
  );
}
