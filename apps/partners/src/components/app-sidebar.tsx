import { auth } from "@cfce/auth"
import {
  HandCoins,
  ScrollText,
  Shovel,
  TreePine,
  Users,
  Wallet,
  Webhook,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getOrganizationById } from "~/actions/database"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import ProfilePopover from "./ProfilePopover.server"
import SignInButton from "./SignInButton"
import { ThemeToggle } from "./ThemeToggle"

const items = [
  {
    title: "Donations",
    url: "donations",
    icon: HandCoins,
  },
  {
    title: "Initiatives",
    url: "initiatives",
    icon: TreePine,
  },
  {
    title: "Stories",
    url: "stories",
    icon: Shovel,
  },
  {
    title: "Events",
    url: "events",
    icon: Users,
  },
  {
    title: "Wallets",
    url: "wallets",
    icon: Wallet,
  },
  {
    title: "Contracts",
    url: "contracts",
    icon: ScrollText,
  },
  {
    title: "Hooks",
    url: "hooks",
    icon: Webhook,
  },
]

export async function AppSidebar({ orgId }: { orgId: string }) {
  const session = await auth()
  let data = null
  if (orgId) {
    data = await getOrganizationById(orgId)
  }
  const currentOrg = JSON.parse(JSON.stringify(data))
  console.log("CURRENT ORG", currentOrg, orgId)
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
        {currentOrg && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="bg-gray-700 mx-2 mb-4 p-2 rounded-md text-center">
                <span className="text-gray-300 text-sm block mb-1">
                  Current Organization
                </span>
                <Link href={`/organization/${currentOrg.id}`}>
                  <strong className="text-lg">{currentOrg.name}</strong>
                </Link>
              </div>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={`/organization/${orgId}/${item.url}`}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 border-t border-gray-700 flex flex-row justify-between w-full">
          <ThemeToggle />
          {!session ? (
            <div>
              <p className="text-gray-300 mb-2">You are not signed in</p>
              <SignInButton className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" />
            </div>
          ) : (
            <div className="flex justify-start">
              <ProfilePopover />
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
