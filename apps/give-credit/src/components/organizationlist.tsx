import Image from 'next/image'
import { Organization } from 'types/registryTypes'

export default function OrganizationList({
  organizations,
  onOrgPress
}: {
  organizations: Organization[];
  onOrgPress: (org: Organization) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 auto-rows-max">
      {organizations.map((organization) => { 
        if(organization.inactive){ return null }
        return (
          <div
            className="rounded-xl py-6 pt-0 relative overflow-hidden"
            key={organization.id}
          >
            <button onClick={() => onOrgPress(organization)}>
              <div className="flex flex-col">
                <Image
                  src={organization.image}
                  alt={`${organization.name} Logo`}
                  className="self-center mb-4"
                  width={400}
                  height={400}
                />
                <h3 className="font-bold text-center z-10">
                  {organization.name}
                </h3>
              </div>
            </button>
            <div className="bg-gradient-to-b from-transparent to-black absolute top-2/3 left-0 right-0 bottom-0 z-0" />
          </div>
        )}
      )}
    </div>
  )
}
