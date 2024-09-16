import { getCategories } from '@cfce/database';
import React from 'react';
import AddOrganizationForm from '~/components/AddOrganizationForm';
import Dashboard from '~/components/dashboard';
import Sidebar from '~/components/sidebar';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';
export default async function Page() {
  const categories = await getCategories({});

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="New Organization" />
        <AddOrganizationForm categories={categories} />
      </div>
    </Dashboard>
  );
}
