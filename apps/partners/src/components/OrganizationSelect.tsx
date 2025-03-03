'use client';
import type { Organization } from '@cfce/database';
import { useSession } from 'next-auth/react';
//import { useRouter } from 'next/navigation';
//import { revalidatePath } from "next/cache"

const OrganizationSelect = ({
  organizations,
}: {
  organizations: Organization[];
}) => {
  const { data: session, update } = useSession();
  //const router = useRouter();
  return (
    <div className="w-full box-border">
      <select
        className="my-4 w-full box-border"
        value={session?.orgId}
        onChange={evt => {
          const orgId = evt.target.value;
          console.log('ORG CHANGED', orgId);
          update({ orgId });
          setTimeout(()=>{location.reload()}, 500) // weird hack as it won't update session if we won't wait
          //router.refresh();
          //revalidatePath("/dashboard")
        }}
      >
        {organizations ? (
          organizations.map(item => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))
        ) : (
          <option>No organizations...</option>
        )}
      </select>
    </div>
  );
};

export default OrganizationSelect;
