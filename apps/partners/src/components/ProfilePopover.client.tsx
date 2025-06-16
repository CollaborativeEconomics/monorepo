"use client"
import { Button } from "@cfce/components/ui"
import Image from "next/image"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useAppState } from "../state/appState"
import SignOutButton from "./SignOutButton"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export interface Organization {
  id: string
  name: string
}

export interface UserInfo {
  id: string
  name: string
  email?: string
  image?: string
}

interface ProfilePopoverClientProps {
  user: UserInfo
  organizations: Organization[]
  currentOrg: Organization | null
}

function getInitials(name?: string) {
  if (!name) return "?"
  const parts = name.split(" ")
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?"
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export default function ProfilePopoverClient({
  user,
  organizations,
  currentOrg,
}: ProfilePopoverClientProps) {
  const router = useRouter()
  const { setCurrentOrg } = useAppState()
  const [open, setOpen] = React.useState(false)

  const avatar = user.image
  const name = user.name || user.email || "User"
  const email = user.email

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {avatar ? (
          <Image
            src={avatar}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full cursor-pointer border border-gray-600"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 text-white font-bold text-lg cursor-pointer border border-gray-600">
            {getInitials(name)}
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-72 p-0 bg-popover text-popover-foreground border-border"
      >
        <div className="p-4 border-b border-border flex items-center gap-3">
          {avatar ? (
            <Image
              src={avatar}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 text-white font-bold text-lg">
              {getInitials(name)}
            </div>
          )}
          <div>
            <div className="font-semibold">{name}</div>
            <div className="text-xs text-gray-500">{email}</div>
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto py-2">
          {organizations.map((org) => (
            <button
              key={org.id}
              type="button"
              className={`w-full text-left px-4 flex items-center gap-2 hover:bg-secondary ${currentOrg?.id === org.id ? "font-bold" : ""}`}
              onClick={() => {
                setCurrentOrg(org)
                setOpen(false)
                router.push(`/organization/${org.id}`)
              }}
            >
              <span className="flex-1 truncate">{org.name}</span>
              {currentOrg?.id === org.id && (
                <span className="text-xs text-blue-500">(Current)</span>
              )}
            </button>
          ))}
        </div>
        <div className="border-t border-border p-2">
          <Button
            className="w-full px-4 py-2 rounded-md text-white font-semibold"
            variant="outline"
            onClick={() => {
              setOpen(false)
              router.push("/organization")
            }}
          >
            + Create Organization
          </Button>
          <SignOutButton className="w-full mt-2 px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold" />
        </div>
      </PopoverContent>
    </Popover>
  )
}
