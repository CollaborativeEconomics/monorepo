'use client';
import type { Organization } from '@cfce/database';
import { useSession } from 'next-auth/react';

const OrganizationSelect = ({
  organizations,
  afterChange,
}: {
  organizations: Organization[];
  afterChange: (orgId: string) => void;
}) => {
  const { data: session, update } = useSession();
  return (
    <div className="w-full box-border">
      <select
        className="my-4 w-full box-border"
        value={session?.orgId}
        onChange={evt => {
          const orgId = evt.target.value;
          console.log('Changed', orgId);
          update({ orgId: orgId });
          afterChange(orgId);
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
