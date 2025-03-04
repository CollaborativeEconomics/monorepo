import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@cfce/auth';
import { getOrganizationById, getOrganizations } from '~/actions/database'
import type { Session } from 'next-auth';
import OrganizationSelect from './OrganizationSelect';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import { HandCoins, ScrollText, Shovel, TreePine, Users, Wallet } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"


const items = [
  {
    title: "Donations",
    url: "/dashboard/donations",
    icon: HandCoins,
  },
  {
    title: "Initiatives",
    url: "/dashboard/initiatives",
    icon: TreePine,
  },
  {
    title: "Stories",
    url: "/dashboard/stories",
    icon: Shovel,
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: Users,
  },
  {
    title: "Wallets",
    url: "/dashboard/wallets",
    icon: Wallet,
  },
  {
    title: "Contracts",
    url: "/dashboard/contracts",
    icon: ScrollText,
  },
]

export async function AppSidebar() {
  const session = await auth();
  const list = await getOrganizations();
  const organizations = JSON.parse(JSON.stringify(list))
  let data = null;
  if (session?.orgId) {
    data = await getOrganizationById(session.orgId);
  }
  const currentOrg = JSON.parse(JSON.stringify(data)) 

  return (
    <Sidebar>
      <SidebarHeader>
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
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {session?.isAdmin && organizations?.length ? (
            <div className="px-2">
              <OrganizationSelect organizations={organizations} />
            </div>
          ) : null}
          {currentOrg && (
            <div className="bg-gray-700 mx-2 mb-4 p-2 rounded-md text-center">
              <span className="text-gray-300 text-sm block mb-1">
                Current Organization
              </span>
              <Link href={`/dashboard/organization/${currentOrg.id}`}>
                <strong className="text-lg">{currentOrg.name}</strong>
              </Link>
            </div>
          )}
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 border-t border-gray-700">
          {!session ? (
            <div>
              <p className="text-gray-300 mb-2">You are not signed in</p>
              <SignInButton className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" />
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex flex-row">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    width={48}
                    height={48}
                    className="rounded-full mb-2 mr-2"
                  />
                )}
                <div>
                  <p className="text-sm mb-1">
                    <strong>{session.orgName ?? ''}</strong>
                  </p>
                  <p className="text-xs text-gray-300 mb-2">
                    {session.user?.email ?? session.user?.name}
                  </p>
                </div>
              </div>
              <SignOutButton className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" />
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
