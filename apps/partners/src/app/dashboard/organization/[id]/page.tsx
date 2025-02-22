import React from 'react';
import { getCategories, getOrganizationById } from '@cfce/database';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';
import OrganizationEdit from './OrganizationEdit';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const data = await getOrganizationById(id, false); // No include sub-models
  const organization = JSON.parse(JSON.stringify(data))
  const categories = await getCategories({});
  const list = categories.map(it=>{ return {id:it.id, name:it.title} })

  return (
    <div>
      <Title text="Edit Organization" />
      <OrganizationEdit organization={organization} categories={list} />
    </div>
  );
}
