"use client"
import { useState, createContext } from 'react'
import DonationForm from '@/components/DonationForm'
import NFTReceipt from '@/components/NFTReceipt'

export const DonationContext = createContext() // For use in NFTReceipt component

export default function DonationView({initiative, receipt}){
  const [donation, setDonation] = useState(receipt)

  return (
    <DonationContext.Provider value={{donation, setDonation}}>
      <div className="flex flex-nowrap lg:flex-nowrap gap-10 items-start">
        <div className="w-full lg:w-[60%]">
          <DonationForm initiative={initiative} />
        </div>
        <div className="lg:w-[40%]">
          <NFTReceipt receipt={donation} />
        </div>
      </div>
    </DonationContext.Provider>
  )
}
