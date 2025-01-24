import { getDonations } from '@cfce/database';
import { imageUrl } from '@cfce/utils';
import Image from 'next/image';

type Props = {
  userId: string;
};

export async function FavoriteOrganizations({ userId }: Props) {
  const favoriteOrganizations = (await getDonations({ favs: userId })) || [];

  // Create a Map to store unique organizations, using org.id as the key
  const uniqueOrgs = new Map(
    favoriteOrganizations
      .map(donation => donation.organization)
      .filter(Boolean)
      .map(org => [org.id, org]),
  );

  return (
    <div>
      <h1 className="text-2xl font-medium mb-4">Favorite Organizations</h1>
      <div className="grid grid-cols-2 gap-2 mb-8">
        {uniqueOrgs.size > 0 ? (
          Array.from(uniqueOrgs.values()).map(org => (
            <div
              key={org.id}
              className="flex flex-row justify-start items-center content-center mt-4"
            >
              {org?.image && (
                <Image
                  className="rounded-full mr-1"
                  src={imageUrl(org.image)}
                  width={64}
                  height={64}
                  alt="Organization"
                />
              )}
              <h1 className="text-sm text-center">{org.name}</h1>
            </div>
          ))
        ) : (
          <div className="text-gray-300">None</div>
        )}
      </div>
    </div>
  );
}
