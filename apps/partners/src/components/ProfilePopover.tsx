"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { useAppState } from "../state/appState"
import * as React from "react"

function getInitials(name?: string) {
  if (!name) return "?"
  const parts = name.split(" ")
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?"
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export default function ProfilePopover({ session, organizations, currentOrg }: {
  session: any,
  organizations: any[],
  currentOrg: any
}) {
  const router = useRouter()
  const { setCurrentOrg } = useAppState()
  const [open, setOpen] = React.useState(false)

  if (!session) return null

  const user = session.user || {}
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
      <PopoverContent align="start" className="w-72 p-0">
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
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
        <div className="max-h-60 overflow-y-auto">
          {organizations.map((org) => (
            <button
              key={org.id}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-accent hover:text-accent-foreground ${currentOrg?.id === org.id ? "bg-gray-100 font-bold" : ""}`}
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
        <div className="border-t border-gray-200 p-2">
          <button
            className="w-full px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            onClick={() => {
              setOpen(false)
              router.push("/organization")
            }}
          >
            + Create Organization
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
} 