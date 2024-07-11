"use client"
import React from 'react';
import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import CategorySelect from './CategorySelect';
import LocationSelect from './LocationSelect';
import { Button } from '@/src/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import InitiativeOrgSwitch from './InitiativeOrgSwitch';

export default function SearchBar(props:any) {
  const text = props?.text || ''
  const router = useRouter();
  const [query, setQuery] = useState(text)
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')

  function checkEnter(evt:KeyboardEvent){
    if(evt.keyCode==13){
      search()
    }
  }

  function search(){
    //console.log('SEARCHBAR', query, category, location)
    const params = {query, category, location}
    const url = new URLSearchParams(params).toString()
    //console.log(url)
    if(params){
      router.push(`?${url}`)
      //router.push(`?search=${query}`)
    } else {
      router.push('?')
    }
  }

  return (
    <CardContent className="p-3 w-full">
      <div className="flex flex-col lg:flex-row w-full space-y-2 lg:space-y-0 lg:space-x-2">
        <InitiativeOrgSwitch />
        <Input type="search" placeholder="Search" className="flex-1" value={query} onChange={(evt)=>setQuery(evt.target.value)} onKeyDown={checkEnter} />
        <div className="flex flex-row justify-between">
          <CategorySelect onChange={(val:string)=>{setCategory(val)}} />
          <LocationSelect onChange={(val:string)=>{setLocation(val)}} />
        </div>
        <Button type="submit" onClick={search}>Search</Button>
      </div>
    </CardContent>
  );
}
