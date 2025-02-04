import { getDonations } from '@cfce/database';
import { ipfsCIDToUrl } from '@cfce/utils';
import Image from 'next/image';

type Props = {
  userId: string;
};

export async function Badges({ userId }: Props) {
  const donations = (await getDonations({ badges: userId })) || [];

  // Extract unique categories
  const uniqueBadges = donations.reduce((acc, donation) => {
    const category = donation.category;
    if (!category || !category.image) return acc;

    // Use category.id as key to ensure uniqueness
    if (!acc.has(category.id)) {
      acc.set(category.id, category);
    }
    return acc;
  }, new Map());

  const badges = Array.from(uniqueBadges.values());

  return (
    <div>
      <h1 className="text-2xl font-medium mb-4">Badges</h1>
      <div className="grid grid-cols-4 gap-2 mb-8">
        {badges.length > 0 ? (
          badges.map(badge => (
            <Image
              key={badge.id}
              className="mr-1"
              src={ipfsCIDToUrl(badge.image)}
              width={72}
              height={72}
              alt="Badge"
            />
          ))
        ) : (
          <div className="text-gray-300">None</div>
        )}
      </div>
    </div>
  );
}
