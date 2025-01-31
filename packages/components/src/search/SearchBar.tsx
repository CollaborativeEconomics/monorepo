"use client"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import React from "react"
import { type KeyboardEvent, useState } from "react"
import { Button } from "~/ui/button"
import { CardContent } from "~/ui/card"
import { Input } from "~/ui/input"
import CategorySelect from "./CategorySelect"
import InitiativeOrgSwitch from "./InitiativeOrgSwitch"
import LocationSelect from "./LocationSelect"

interface SearchBarProps {
  text?: string
}

export default function SearchBar(props: SearchBarProps) {
  const text = props?.text || ""
  const router = useRouter()
  const [query, setQuery] = useState(text)
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")

  function checkEnter(evt: KeyboardEvent) {
    if (evt.key === "Enter") {
      search()
    }
  }

  function search() {
    console.log("SEARCH", query, category, location)
    const params = { query, category, location }
    const url = new URLSearchParams(params).toString()
    //console.log(url)
    if (params) {
      router.push(`?${url}`)
      //router.push(`?search=${query}`)
    } else {
      router.push("?")
    }
  }

  return (
    <CardContent className="p-3 w-full">
      <div className="flex flex-col lg:flex-row w-full space-y-2 lg:space-y-0 lg:space-x-2">
        <div className="flex-[2] flex flex-row gap-2">
          <InitiativeOrgSwitch className="flex-initial" />
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search"
              className="flex-1"
              value={query}
              onChange={(evt) => setQuery(evt.target.value)}
              onKeyDown={checkEnter}
            />
            <MagnifyingGlassIcon className="h-[1.2rem] w-[1.2rem] absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <div className="flex flex-row flex-1 gap-2">
          <CategorySelect
            className="flex-1 md:flex-initial"
            onChange={(val: string) => {
              setCategory(val)
            }}
          />
          <LocationSelect
            className="flex-1 lg:flex-initial"
            onChange={(val: string) => {
              if (val === "All") {
                setLocation("")
              } else {
                setLocation(val)
              }
            }}
          />
          <Button type="submit" onClick={search} className="flex-initial">
            Search
          </Button>
        </div>
      </div>
    </CardContent>
  )
}
