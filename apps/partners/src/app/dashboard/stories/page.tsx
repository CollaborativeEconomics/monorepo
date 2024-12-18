import { auth } from '@cfce/auth';
// /app/dashboard/page.tsx
import { getCategories, getOrganizationById, getStories } from '@cfce/database';
import Story from '~/components/story';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';
import AddStoryForm from './AddStoryForm';

export default async function DashboardPage() {
  const session = await auth(); // Fetch session
  const orgId = session?.orgId ?? '';
  const organization = await getOrganizationById(orgId);
  const initiatives = organization?.initiative || [];
  const stories = await getStories({ orgId });
  const categories = await getCategories({});

  return (
    <div className={styles.content}>
      <Title text="Share a Story: Post a Story NFT" />
      <p className={styles.intro}>
        Story NFTs allow you to share your donors what their donations are
        contributing to. Tell a story that will attract new donations and make
        your donors feel good about supporting you!
      </p>

      {/* Pass data to the client-side form */}
      <AddStoryForm
        userId={session?.user?.id ?? 'anonymous'}
        orgId={orgId}
        initiatives={initiatives}
        categories={categories}
      />

      {stories.length > 0 ? (
        stories.map(item => (
          <div className={styles.mainBox} key={item.id}>
            <Story {...item} />
          </div>
        ))
      ) : (
        <h1 className="text-center text-2xl my-24">No stories found</h1>
      )}
    </div>
  );
}
