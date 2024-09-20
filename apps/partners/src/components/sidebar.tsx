import {
  type Organization,
  getOrganizationById,
  getOrganizations,
} from '@cfce/database';
import {
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@cfce/universe-components/ui';
import { authOptions } from '@cfce/utils';
import { Menu } from 'lucide-react';
import { type Session, getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { MobileMenuButton } from './MobileMenuButton';
import OrganizationSelect from './OrganizationSelect';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';

const SidebarContent = ({
  session,
  currentOrg,
  organizations,
}: {
  session: Session | null;
  currentOrg: Organization | null;
  organizations: Organization[] | null;
}) => (
  <div className="flex flex-col h-full">
    <div className="p-4">
      <Link href="/dashboard" className="block w-full">
        <Image
          src="/give-logo.svg"
          alt="Give Logo"
          width={200}
          height={60}
          className="mx-auto"
        />
      </Link>
    </div>

    {session?.isAdmin && organizations?.length ? (
      <div className="px-4 mb-4">
        <OrganizationSelect organizations={organizations} />
      </div>
    ) : null}

    {currentOrg && (
      <div className="bg-gray-700 mx-4 p-3 rounded-md text-center mb-4">
        <span className="text-gray-300 text-sm block mb-1">
          Current Organization
        </span>
        <strong className="text-lg">{currentOrg.name}</strong>
      </div>
    )}

    <nav className="flex-grow">
      <ul>
        {[
          { href: '/dashboard/organization', label: 'New Organization' },
          { href: '/dashboard/donations', label: 'Donations' },
          { href: '/dashboard/initiatives', label: 'Initiatives' },
          { href: '/dashboard/stories', label: 'Stories' },
          { href: '/dashboard/wallets', label: 'Wallets' },
        ].map(item => (
          <li key={item.href} className="hover:bg-gray-700">
            <Link href={item.href} className="block px-4 py-2">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>

    <div className="p-4 border-t border-gray-700">
      {!session ? (
        <div>
          <p className="text-gray-300 mb-2">You are not signed in</p>
          <SignInButton className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" />
        </div>
      ) : (
        <div>
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="User Avatar"
              width={48}
              height={48}
              className="rounded-full mb-2"
            />
          )}
          <p className="text-sm mb-1">
            <strong>{session.orgName ?? ''}</strong>
          </p>
          <p className="text-xs text-gray-300 mb-2">
            {session.user?.email ?? session.user?.name}
          </p>
          <SignOutButton className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" />
        </div>
      )}
    </div>
  </div>
);

const Sidebar = async () => {
  const session = await getServerSession(authOptions);
  const organizations = await getOrganizations({});

  let currentOrg = null;
  if (session?.orgId) {
    currentOrg = await getOrganizationById(session.orgId);
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SidebarContent
            session={session}
            currentOrg={currentOrg}
            organizations={organizations}
          />
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex flex-col w-64 min-h-screen bg-gray-800 text-white">
        <SidebarContent
          session={session}
          currentOrg={currentOrg}
          organizations={organizations}
        />
      </div>
    </>
  );
};

export default Sidebar;
